import aiosqlite
import os
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "cache.db")


async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS responses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                topic_id TEXT NOT NULL,
                model_id TEXT NOT NULL,
                language_code TEXT NOT NULL,
                prompt TEXT NOT NULL,
                response_text TEXT NOT NULL,
                created_at TEXT NOT NULL,
                UNIQUE(topic_id, model_id, language_code)
            )
        """)
        await db.commit()


async def get_cached(topic_id: str, model_id: str, language_code: str):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        cursor = await db.execute(
            "SELECT * FROM responses WHERE topic_id=? AND model_id=? AND language_code=?",
            (topic_id, model_id, language_code),
        )
        row = await cursor.fetchone()
        if row:
            return dict(row)
    return None


async def store_response(
    topic_id: str,
    model_id: str,
    language_code: str,
    prompt: str,
    response_text: str,
) -> str:
    created_at = datetime.now(timezone.utc).isoformat()
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            """INSERT OR REPLACE INTO responses
               (topic_id, model_id, language_code, prompt, response_text, created_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (topic_id, model_id, language_code, prompt, response_text, created_at),
        )
        await db.commit()
    return created_at
