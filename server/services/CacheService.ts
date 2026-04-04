import { Effect } from "effect"
import { eq, and } from "drizzle-orm"
import { db } from "../db/index.ts"
import { responses } from "../db/schema.ts"
export interface CacheRow {
  readonly id: number
  readonly topic_id: string
  readonly model_id: string
  readonly language_code: string
  readonly prompt: string
  readonly response_text: string
  readonly created_at: string
}

export interface CacheServiceApi {
  readonly get: (
    topicId: string,
    modelId: string,
    languageCode: string,
  ) => Effect.Effect<CacheRow | null>
  readonly store: (
    topicId: string,
    modelId: string,
    languageCode: string,
    prompt: string,
    responseText: string,
  ) => Effect.Effect<string>
}

export class CacheService extends Effect.Service<CacheService>()(
  "CacheService",
  {
    sync: () => {
      const get: CacheServiceApi["get"] = (topicId, modelId, languageCode) =>
        Effect.sync(() => {
          const rows = db
            .select()
            .from(responses)
            .where(
              and(
                eq(responses.topicId, topicId),
                eq(responses.modelId, modelId),
                eq(responses.languageCode, languageCode),
              ),
            )
            .get()
          return (rows as unknown as CacheRow | undefined) ?? null
        })

      const store: CacheServiceApi["store"] = (
        topicId,
        modelId,
        languageCode,
        prompt,
        responseText,
      ) =>
        Effect.sync(() => {
          const createdAt = new Date().toISOString()
          db.insert(responses)
            .values({
              topicId,
              modelId,
              languageCode,
              prompt,
              responseText,
              createdAt,
            })
            .onConflictDoUpdate({
              target: [
                responses.topicId,
                responses.modelId,
                responses.languageCode,
              ],
              set: {
                prompt,
                responseText,
                createdAt,
              },
            })
            .run()
          return createdAt
        })

      return { get, store }
    },
  },
) {}
