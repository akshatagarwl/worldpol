import asyncio
import hashlib
from contextlib import asynccontextmanager
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from cache import init_db, get_cached, store_response
from languages import LANGUAGES, get_language
from models import MODELS, get_model
from router_client import build_prompt, query_model
from topics import TOPICS, get_topic

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="WorldPol API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CompareRequest(BaseModel):
    topic_id: str
    model_ids: list[str]
    language_codes: list[str]


@app.get("/api/topics")
async def list_topics():
    return TOPICS


@app.get("/api/models")
async def list_models():
    return MODELS


@app.get("/api/languages")
async def list_languages():
    return LANGUAGES


async def fetch_one(topic_id: str, model_id: str, language_code: str, prompt: str):
    """Fetch a single model+language response, using cache if available."""
    cached = await get_cached(topic_id, model_id, language_code)
    if cached:
        model = get_model(model_id)
        lang = get_language(language_code)
        return {
            "model": {"id": model_id, "name": model["name"], "origin": model["origin_country"]},
            "language": {"code": language_code, "name": lang["name"]},
            "prompt_sent": cached["prompt"],
            "response": cached["response_text"],
            "cached": True,
            "timestamp": cached["created_at"],
        }

    response_text = await query_model(model_id, prompt)
    timestamp = await store_response(topic_id, model_id, language_code, prompt, response_text)

    model = get_model(model_id)
    lang = get_language(language_code)
    return {
        "model": {"id": model_id, "name": model["name"], "origin": model["origin_country"]},
        "language": {"code": language_code, "name": lang["name"]},
        "prompt_sent": prompt,
        "response": response_text,
        "cached": False,
        "timestamp": timestamp,
    }


@app.post("/api/compare")
async def compare(req: CompareRequest):
    topic = get_topic(req.topic_id)
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")

    for mid in req.model_ids:
        if not get_model(mid):
            raise HTTPException(status_code=400, detail=f"Unknown model: {mid}")
    for lc in req.language_codes:
        if not get_language(lc):
            raise HTTPException(status_code=400, detail=f"Unknown language: {lc}")

    tasks = []
    for model_id in req.model_ids:
        for lang_code in req.language_codes:
            lang = get_language(lang_code)
            prompt = build_prompt(topic["prompt_template"], lang["name"], lang_code)
            tasks.append(fetch_one(req.topic_id, model_id, lang_code, prompt))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Convert exceptions to error entries
    final_results = []
    for r in results:
        if isinstance(r, Exception):
            final_results.append({"error": str(r)})
        else:
            final_results.append(r)

    # Generate a comparison ID from the request params
    raw = f"{req.topic_id}:{'|'.join(sorted(req.model_ids))}:{'|'.join(sorted(req.language_codes))}"
    comparison_id = hashlib.md5(raw.encode()).hexdigest()[:12]

    return {
        "comparison_id": comparison_id,
        "topic": {
            "id": topic["id"],
            "name": topic["name"],
            "prompt": topic["prompt_template"],
        },
        "results": final_results,
    }


@app.get("/api/results/{comparison_id}")
async def get_results(comparison_id: str):
    # Since comparisons are deterministic based on params, this is a placeholder
    # In production you'd store comparison metadata; for now return a helpful message
    raise HTTPException(
        status_code=404,
        detail="Use POST /api/compare to generate results. Comparison caching by ID is planned.",
    )
