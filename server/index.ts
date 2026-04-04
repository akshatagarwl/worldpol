import { Effect, Layer } from "effect"
import {
  HttpServer,
  HttpRouter,
  HttpServerResponse,
  HttpServerRequest,
  FetchHttpClient,
} from "@effect/platform"
import { BunHttpServer } from "@effect/platform-bun"
import { Schema } from "@effect/schema"
import { TOPICS } from "./data/topics.ts"
import { MODELS } from "./data/models.ts"
import { LANGUAGES } from "./data/languages.ts"
import { CompareService } from "./services/CompareService.ts"
import { CompareRequest } from "./schema/api.ts"
import type { CompareResponse } from "./schema/api.ts"

function md5Sync(input: string): string {
  const hasher = new Bun.CryptoHasher("md5")
  hasher.update(input)
  return hasher.digest("hex")
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

const app = HttpRouter.empty.pipe(
  // CORS preflight
  HttpRouter.options(
    "/api/*",
    HttpServerResponse.empty({ status: 204, headers: corsHeaders }),
  ),

  // GET /api/topics
  HttpRouter.get(
    "/api/topics",
    Effect.succeed(
      HttpServerResponse.unsafeJson(TOPICS, { headers: corsHeaders }),
    ),
  ),

  // GET /api/models
  HttpRouter.get(
    "/api/models",
    Effect.succeed(
      HttpServerResponse.unsafeJson(MODELS, { headers: corsHeaders }),
    ),
  ),

  // GET /api/languages
  HttpRouter.get(
    "/api/languages",
    Effect.succeed(
      HttpServerResponse.unsafeJson(LANGUAGES, { headers: corsHeaders }),
    ),
  ),

  // POST /api/compare
  HttpRouter.post(
    "/api/compare",
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest
      const body = yield* request.json

      const parsed = Schema.decodeUnknownEither(CompareRequest)(body)
      if (parsed._tag === "Left") {
        return HttpServerResponse.unsafeJson(
          { error: "Invalid request", details: String(parsed.left) },
          { status: 400, headers: corsHeaders },
        )
      }

      const { topic_id, model_ids, language_codes } = parsed.right

      const topic = TOPICS.find((t) => t.id === topic_id)
      if (!topic) {
        return HttpServerResponse.unsafeJson(
          { error: `Unknown topic: ${topic_id}` },
          { status: 400, headers: corsHeaders },
        )
      }

      const sortedModels = [...model_ids].sort().join(",")
      const sortedLangs = [...language_codes].sort().join(",")
      const comparisonId = md5Sync(`${topic_id}:${sortedModels}:${sortedLangs}`).slice(0, 12)

      const compareService = yield* CompareService

      const effects = model_ids.flatMap((modelId) =>
        language_codes.map((langCode) =>
          compareService.fetchOne(topic_id, modelId, langCode).pipe(
            Effect.catchAll((error) =>
              Effect.succeed({
                model: { id: modelId, name: modelId, origin: "" },
                language: { code: langCode, name: langCode },
                prompt_sent: "",
                response: error instanceof Error ? error.message : String(error),
                cached: false,
                timestamp: new Date().toISOString(),
              }),
            ),
          ),
        ),
      )

      const results = yield* Effect.all(effects, { concurrency: "unbounded" })

      const response: CompareResponse = {
        comparison_id: comparisonId,
        topic: {
          id: topic.id,
          name: topic.name,
          category: topic.category,
          prompt_template: topic.prompt_template,
        },
        results,
      }

      return HttpServerResponse.unsafeJson(response, { headers: corsHeaders })
    }),
  ),

  // Catch-all 404
  HttpRouter.all(
    "/*",
    Effect.succeed(
      HttpServerResponse.unsafeJson(
        { error: "Not found" },
        { status: 404, headers: corsHeaders },
      ),
    ),
  ),
)

const appLayer = HttpServer.serve(app).pipe(
  Layer.provide(BunHttpServer.layer({ port: 3001 })),
  Layer.provide(FetchHttpClient.layer),
  Layer.provide(CompareService.Default),
)
// Run the server
Effect.runFork(
  Layer.launch(appLayer) as Effect.Effect<never, never, never>,
)
