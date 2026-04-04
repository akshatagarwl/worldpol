import { drizzle } from "drizzle-orm/bun-sqlite"
import { Database } from "bun:sqlite"
import { resolve } from "node:path"
import * as schema from "./schema.ts"

const dbPath = resolve(process.cwd(), "cache.db")
const sqlite = new Database(dbPath)

// Create table if not exists
sqlite.run(`
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

export const db = drizzle(sqlite, { schema })
