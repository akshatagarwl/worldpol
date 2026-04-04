import { Effect } from "effect";
import { CacheService } from "./CacheService";
import { OpenRouterService } from "./OpenRouterService";
import { getTopic } from "../data/topics";
import { getModel } from "../data/models";
import { getLanguage } from "../data/languages";

export interface CompareResult {
  readonly model: {
    readonly id: string;
    readonly name: string;
    readonly origin: string;
  };
  readonly language: {
    readonly code: string;
    readonly name: string;
  };
  readonly prompt_sent: string;
  readonly response: string;
  readonly cached: boolean;
  readonly timestamp: string;
}

export class CompareService extends Effect.Service<CompareService>()("CompareService", {
  effect: Effect.gen(function* () {
    const cache = yield* CacheService;
    const router = yield* OpenRouterService;

    const fetchOne = (topicId: string, modelId: string, languageCode: string) =>
      Effect.gen(function* () {
        const topic = getTopic(topicId);
        if (!topic) {
          return yield* Effect.fail(new Error(`Unknown topic: ${topicId}`));
        }

        const model = getModel(modelId);
        if (!model) {
          return yield* Effect.fail(new Error(`Unknown model: ${modelId}`));
        }

        const language = getLanguage(languageCode);
        if (!language) {
          return yield* Effect.fail(new Error(`Unknown language: ${languageCode}`));
        }

        const prompt =
          languageCode !== "en"
            ? `Please answer in ${language.name}. ${topic.prompt_template}`
            : topic.prompt_template;

        const cached = yield* cache.get(topicId, modelId, languageCode);
        if (cached) {
          return {
            model: {
              id: model.id,
              name: model.name,
              origin: model.origin_country,
            },
            language: { code: language.code, name: language.name },
            prompt_sent: cached.prompt,
            response: cached.response_text,
            cached: true,
            timestamp: cached.created_at,
          };
        }

        const responseText = yield* router.query(modelId, topic.prompt_template, languageCode);

        const timestamp = yield* cache.store(topicId, modelId, languageCode, prompt, responseText);

        return {
          model: {
            id: model.id,
            name: model.name,
            origin: model.origin_country,
          },
          language: { code: language.code, name: language.name },
          prompt_sent: prompt,
          response: responseText,
          cached: false,
          timestamp,
        };
      });

    return { fetchOne };
  }),
  dependencies: [CacheService.Default, OpenRouterService.Default],
}) {}
