/**
 * E2E tests for the WorldPol API server.
 *
 * Starts the real Effect-TS server on port 3001 and tests all endpoints
 * with actual HTTP requests against SQLite.
 *
 * Prerequisites:
 *   - OPENROUTER_API_KEY in .env
 *   - No other process on port 3001
 */
import { describe, it, expect, beforeAll, afterAll } from "vite-plus/test";

const BASE = "http://localhost:3001";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchJSON<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<{ status: number; body: T }> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  const body = (await res.json()) as T;
  return { status: res.status, body };
}

// ---------------------------------------------------------------------------
// Static data endpoints
// ---------------------------------------------------------------------------

describe("GET /api/topics", () => {
  it("returns the full topic list", async () => {
    const { status, body } = await fetchJSON<{ id: string; name: string; category: string }[]>(
      "/api/topics"
    );
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThanOrEqual(10);

    // Every topic has required fields
    for (const t of body) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(t.category).toBeTruthy();
    }
  });
});

describe("GET /api/models", () => {
  it("returns the model list", async () => {
    const { status, body } = await fetchJSON<{ id: string; name: string; origin_country: string }[]>(
      "/api/models"
    );
    expect(status).toBe(200);
    expect(body.length).toBeGreaterThanOrEqual(3);
    for (const m of body) {
      expect(m.id).toBeTruthy();
      expect(m.name).toBeTruthy();
      expect(m.origin_country).toBeTruthy();
    }
  });
});

describe("GET /api/languages", () => {
  it("returns the language list", async () => {
    const { status, body } = await fetchJSON<{ code: string; name: string }[]>(
      "/api/languages"
    );
    expect(status).toBe(200);
    expect(body.length).toBeGreaterThanOrEqual(5);
    for (const l of body) {
      expect(l.code).toBeTruthy();
      expect(l.name).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// Compare endpoint
// ---------------------------------------------------------------------------

describe("POST /api/compare", () => {
  it("rejects an empty body", async () => {
    const { status } = await fetchJSON("/api/compare", {
      method: "POST",
      body: JSON.stringify({}),
    });
    expect(status).toBe(400);
  });

  it("rejects missing model_ids", async () => {
    const { status } = await fetchJSON("/api/compare", {
      method: "POST",
      body: JSON.stringify({ topic_id: "israel_palestine", language_codes: ["en"] }),
    });
    expect(status).toBe(400);
  });

  it("rejects missing language_codes", async () => {
    const { status } = await fetchJSON("/api/compare", {
      method: "POST",
      body: JSON.stringify({ topic_id: "israel_palestine", model_ids: ["nvidia/nemotron-3-super-120b-a12b:free"] }),
    });
    expect(status).toBe(400);
  });

  it("handles empty model_ids array gracefully (returns empty results)", async () => {
    const { status, body } = await fetchJSON<{ results: unknown[] }>("/api/compare", {
      method: "POST",
      body: JSON.stringify({ topic_id: "israel_palestine", model_ids: [], language_codes: ["en"] }),
    });
    // Server accepts empty arrays and returns empty results
    expect(status).toBe(200);
    expect(body.results).toHaveLength(0);
  });

  it("runs a single-model single-language comparison", async () => {
    const { status, body } = await fetchJSON<{
      comparison_id: string;
      topic: { id: string };
      results: Array<{
        model: { id: string };
        language: { code: string };
        response: string;
        cached: boolean;
      }>;
    }>("/api/compare", {
      method: "POST",
      body: JSON.stringify({
        topic_id: "israel_palestine",
        model_ids: ["nvidia/nemotron-3-super-120b-a12b:free"],
        language_codes: ["en"],
      }),
    });

    expect(status).toBe(200);
    expect(body.comparison_id).toBeTruthy();
    expect(body.topic.id).toBe("israel_palestine");
    expect(body.results).toHaveLength(1);
    expect(body.results[0].model.id).toBe("nvidia/nemotron-3-super-120b-a12b:free");
    expect(body.results[0].language.code).toBe("en");
    // Response is either the LLM response or an error message (on API failure)
    expect(body.results[0].response).toBeTruthy();
    expect(typeof body.results[0].cached).toBe("boolean");
  }, 90_000);

  it("returns cached results on second call with same params", async () => {
    const payload = {
      topic_id: "israel_palestine",
      model_ids: ["nvidia/nemotron-3-super-120b-a12b:free"],
      language_codes: ["en"],
    };

    // First call (may or may not be cached)
    await fetchJSON("/api/compare", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Second call must be cached
    const { body } = await fetchJSON<{
      results: Array<{ cached: boolean }>;
    }>("/api/compare", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    expect(body.results[0].cached).toBe(true);
  }, 90_000);

  it("handles multi-model multi-language comparison", async () => {
    const { status, body } = await fetchJSON<{
      comparison_id: string;
      results: Array<{
        model: { id: string };
        language: { code: string };
        response: string;
      }>;
    }>("/api/compare", {
      method: "POST",
      body: JSON.stringify({
        topic_id: "taiwan",
        model_ids: ["nvidia/nemotron-3-super-120b-a12b:free", "qwen/qwen3.6-plus:free"],
        language_codes: ["en", "zh"],
      }),
    });

    expect(status).toBe(200);
    // 2 models x 2 languages = 4 results
    expect(body.results).toHaveLength(4);

    // All results have non-empty responses
    for (const r of body.results) {
      expect(r.response).toBeTruthy();
    }
  }, 120_000);
});

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

describe("CORS headers", () => {
  it("reflects origin on API responses", async () => {
    const res = await fetch(`${BASE}/api/topics`, {
      headers: { Origin: "http://localhost:5173" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:5173");
  });

  it("handles OPTIONS preflight", async () => {
    const res = await fetch(`${BASE}/api/compare`, {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:5173" },
    });
    expect(res.status).toBe(204);
  });
});

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------

describe("Unknown routes", () => {
  it("returns 404 for unknown API routes", async () => {
    const res = await fetch(`${BASE}/api/nonexistent`);
    expect(res.status).toBe(404);
  });
});
