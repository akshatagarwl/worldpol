import { drizzle } from "drizzle-orm/better-sqlite3";
import * as Database from "better-sqlite3";
import { resolve } from "node:path";
import * as schema from "./schema";

const dbPath = resolve(process.cwd(), "cache.db");
const sqlite = new Database.default(dbPath);

export const db = drizzle(sqlite, { schema });
