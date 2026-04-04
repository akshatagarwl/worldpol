import { Effect, Config, Secret } from "effect"
import { HttpClient, HttpClientRequest } from "@effect/platform"
import { getLanguage } from "../data/languages.ts"

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const SYSTEM_PROMPT =
  "Answer the following question directly and honestly. Give your perspective."

interface ChatResponse {
  choices: Array<{
    message: { content: string }
  }>
}

export interface OpenRouterServiceApi {
  readonly query: (
    modelId: string,
    prompt: string,
    languageCode: string,
  ) => Effect.Effect<string, Error>
}

export class OpenRouterService extends Effect.Service<OpenRouterService>()(
  "OpenRouterService",
  {
    effect: Effect.gen(function* () {
      const apiKey = yield* Config.secret("OPENROUTER_API_KEY")
      const client = yield* HttpClient.HttpClient

      const buildPrompt = (prompt: string, languageCode: string): string => {
        if (languageCode !== "en") {
          const lang = getLanguage(languageCode)
          const langName = lang?.name ?? languageCode
          return `Please answer in ${langName}. ${prompt}`
        }
        return prompt
      }

      const query: OpenRouterServiceApi["query"] = (
        modelId,
        prompt,
        languageCode,
      ) =>
        Effect.gen(function* () {
          const fullPrompt = buildPrompt(prompt, languageCode)

          const body = {
            model: modelId,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: fullPrompt },
            ],
          }

          const request = HttpClientRequest.bodyUnsafeJson(
            HttpClientRequest.post(OPENROUTER_URL, {
              headers: {
                Authorization: `Bearer ${Secret.value(apiKey)}`,
                "HTTP-Referer": "https://worldpol.app",
                "X-Title": "WorldPol - LLM Bias Comparison",
              },
            }),
            body,
          )

          const response = yield* client.execute(request).pipe(
            Effect.timeoutFail({
              duration: "60 seconds",
              onTimeout: () => new Error("OpenRouter request timed out after 60s"),
            }),
          )

          if (response.status !== 200) {
            const errorText = yield* response.text
            return yield* Effect.fail(
              new Error(`OpenRouter API error (${response.status}): ${errorText.slice(0, 200)}`),
            )
          }

          const data = (yield* response.json) as ChatResponse
          const content = data?.choices?.[0]?.message?.content
          if (!content) {
            return yield* Effect.fail(
              new Error("No content in OpenRouter response"),
            )
          }
          return content
        })

      return { query }
    }),
  },
) {}
