import { Effect } from "effect"
import Database from "better-sqlite3"
import { resolve } from "node:path"

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
      const dbPath = resolve(process.cwd(), "cache.db")
      const db = new Database(dbPath)

      db.exec(`
        CREATE TABLE IF NOT EXISTS responses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          topic_id TEXT NOT NULL,
          model_id TEXT NOT NULL,
          language_code TEXT NOT NULL,
          prompt TEXT NOT NULL,
          response_text TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          UNIQUE(topic_id, model_id, language_code)
        )
      `)

      const getStmt = db.prepare(
        "SELECT * FROM responses WHERE topic_id = ? AND model_id = ? AND language_code = ?",
      )
      const upsertStmt = db.prepare(`
        INSERT INTO responses (topic_id, model_id, language_code, prompt, response_text)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(topic_id, model_id, language_code)
        DO UPDATE SET prompt = excluded.prompt, response_text = excluded.response_text, created_at = datetime('now')
        RETURNING created_at
      `)

      const get: CacheServiceApi["get"] = (topicId, modelId, languageCode) =>
        Effect.sync(() => {
          const row = getStmt.get(topicId, modelId, languageCode) as CacheRow | undefined
          return row ?? null
        })

      const store: CacheServiceApi["store"] = (
        topicId,
        modelId,
        languageCode,
        prompt,
        responseText,
      ) =>
        Effect.sync(() => {
          const result = upsertStmt.get(topicId, modelId, languageCode, prompt, responseText) as { created_at: string }
          return result.created_at
        })

      return { get, store }
    },
  },
) {}
