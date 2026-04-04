import { Effect, Layer } from "effect";
import {
  HttpServer,
  HttpRouter,
  HttpServerResponse,
  HttpServerRequest,
  FetchHttpClient,
} from "@effect/platform";
import { NodeHttpServer } from "@effect/platform-node";
import { createServer } from "node:http";
import { Schema } from "effect";
import { TOPICS } from "./data/topics";
import { MODELS } from "./data/models";
import { LANGUAGES } from "./data/languages";
import { CompareService } from "./services/CompareService";
import { OpenRouterService } from "./services/OpenRouterService";
import { CompareRequest } from "./schema/api";
import type { CompareResponse } from "./schema/api";

import { createHash } from "node:crypto";

function md5Sync(input: string): string {
  return createHash("md5").update(input).digest("hex");
}

const app = HttpRouter.empty.pipe(
  // CORS preflight
  HttpRouter.options(
    "/api/*",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const origin = req.headers["origin"] ?? "*";
      return HttpServerResponse.empty({
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }),
  ),

  // GET /api/topics
  HttpRouter.get(
    "/api/topics",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const origin = req.headers["origin"] ?? "*";
      return HttpServerResponse.unsafeJson(TOPICS, {
        headers: { "Access-Control-Allow-Origin": origin },
      });
    }),
  ),

  // GET /api/models
  HttpRouter.get(
    "/api/models",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const origin = req.headers["origin"] ?? "*";
      return HttpServerResponse.unsafeJson(MODELS, {
        headers: { "Access-Control-Allow-Origin": origin },
      });
    }),
  ),

  // GET /api/languages
  HttpRouter.get(
    "/api/languages",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const origin = req.headers["origin"] ?? "*";
      return HttpServerResponse.unsafeJson(LANGUAGES, {
        headers: { "Access-Control-Allow-Origin": origin },
      });
    }),
  ),

  // POST /api/compare
  HttpRouter.post(
    "/api/compare",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const origin = req.headers["origin"] ?? "*";
      const corsHeaders = { "Access-Control-Allow-Origin": origin };
      const body = yield* req.json;

      const parsed = Schema.decodeUnknownEither(CompareRequest)(body);
      if (parsed._tag === "Left") {
        return HttpServerResponse.unsafeJson(
          { error: "Invalid request", details: String(parsed.left) },
          { status: 400, headers: corsHeaders },
        );
      }

      const { topic_id, model_ids, language_codes } = parsed.right;

      const topic = TOPICS.find((t) => t.id === topic_id);
      if (!topic) {
        return HttpServerResponse.unsafeJson(
          { error: `Unknown topic: ${topic_id}` },
          { status: 400, headers: corsHeaders },
        );
      }

      const sortedModels = [...model_ids].sort().join(",");
      const sortedLangs = [...language_codes].sort().join(",");
      const comparisonId = md5Sync(`${topic_id}:${sortedModels}:${sortedLangs}`).slice(0, 12);

      const compareService = yield* CompareService;

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
      );

      const results = yield* Effect.all(effects, { concurrency: "unbounded" });

      const response: CompareResponse = {
        comparison_id: comparisonId,
        topic: {
          id: topic.id,
          name: topic.name,
          category: topic.category,
          prompt_template: topic.prompt_template,
        },
        results,
      };

      return HttpServerResponse.unsafeJson(response, { headers: corsHeaders });
    }),
  ),

  // Catch-all 404
  HttpRouter.all(
    "/*",
    Effect.succeed(HttpServerResponse.unsafeJson({ error: "Not found" }, { status: 404 })),
  ),
);

// Build layer graph: provide HttpClient to services that need it
const openRouterLayer = Layer.provide(OpenRouterService.Default, FetchHttpClient.layer);

const compareLayer = Layer.provide(CompareService.Default, openRouterLayer);

const serverLayer = Layer.provide(
  HttpServer.serve(app),
  Layer.mergeAll(
    compareLayer,
    NodeHttpServer.layer(() => createServer(), { port: 3001 }),
  ),
);

// Run the server
void Effect.runPromise(Layer.launch(serverLayer) as Effect.Effect<never, never, never>).then(() =>
  console.log("Server started on http://localhost:3001"),
);
