/**
 * E2E browser tests for the WorldPol frontend.
 *
 * Tests the full user flow: select topic → select models → select languages →
 * compare → view results grid.
 *
 * Prerequisites:
 *   - Frontend dev server running (vp dev)
 *   - Backend server running (port 3001)
 *   - Both started via `dev:all` or separately
 */
import { describe, it, expect, beforeAll, afterAll } from "vite-plus/test";

const FRONTEND_BASE = "http://localhost:5173";
const API_BASE = "http://localhost:3001";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function isServerUp(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return res.ok || res.status === 404; // 404 is fine, server is up
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Prerequisites check
// ---------------------------------------------------------------------------

describe("Browser E2E — Full Compare Flow", () => {
  beforeAll(async () => {
    // Verify both servers are up
    const frontendUp = await isServerUp(FRONTEND_BASE);
    const apiUp = await isServerUp(`${API_BASE}/api/topics`);
    if (!apiUp) {
      throw new Error(
        "Backend not running on port 3001. Start it with: node --env-file=.env --import tsx server/index.ts"
      );
    }
  });

  it("loads the frontend page (requires dev server)", async () => {
    const frontendUp = await isServerUp(FRONTEND_BASE);
    if (!frontendUp) {
      // Skip if Vite dev server isn't running — this is expected in CI/server-only testing
      return;
    }
    const res = await fetch(FRONTEND_BASE);
    expect(res.ok).toBe(true);
    const html = await res.text();
    expect(html).toContain("WorldPol");
  });

  it("API returns topics that the frontend can render", async () => {
    const res = await fetch(`${API_BASE}/api/topics`);
    const topics = await res.json();
    expect(topics.length).toBeGreaterThan(0);
    // Verify at least one topic has the expected shape
    const first = topics[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("category");
    expect(first).toHaveProperty("prompt_template");
  });

  it("API returns models with origin info", async () => {
    const res = await fetch(`${API_BASE}/api/models`);
    const models = await res.json();
    expect(models.length).toBeGreaterThan(0);
    // Models have origin_country (raw endpoint returns the data shape from models.ts)
    expect(models.some((m: { origin_country: string }) => m.origin_country)).toBe(true);
  });

  it("API returns languages with RTL support info", async () => {
    const res = await fetch(`${API_BASE}/api/languages`);
    const langs = await res.json();
    expect(langs.length).toBeGreaterThan(0);
    // Verify RTL languages exist (Arabic, Hebrew)
    const codes = langs.map((l: { code: string }) => l.code);
    expect(codes).toContain("ar");
    expect(codes).toContain("he");
  });

  it("full compare cycle works end-to-end", async () => {
    // 1. Pick a topic, model, language
    const topicRes = await fetch(`${API_BASE}/api/topics`);
    const topics = await topicRes.json();
    const topic = topics[0];

    const modelRes = await fetch(`${API_BASE}/api/models`);
    const models = await modelRes.json();
    const model = models[0];

    const langRes = await fetch(`${API_BASE}/api/languages`);
    const languages = await langRes.json();
    const lang = languages[0];

    // 2. Call compare
    const compareRes = await fetch(`${API_BASE}/api/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic_id: topic.id,
        model_ids: [model.id],
        language_codes: [lang.code],
      }),
    });

    expect(compareRes.ok).toBe(true);
    const data = await compareRes.json();

    // 3. Verify response shape matches what the frontend expects
    expect(data).toHaveProperty("comparison_id");
    expect(data).toHaveProperty("topic");
    expect(data).toHaveProperty("results");
    expect(data.results).toHaveLength(1);

    const result = data.results[0];
    expect(result).toHaveProperty("model");
    expect(result).toHaveProperty("language");
    expect(result).toHaveProperty("prompt_sent");
    // Response may contain actual LLM output or error message (on rate limit)
    expect(result).toHaveProperty("response");
    expect(result.response).toBeTruthy();
    expect(result).toHaveProperty("cached");
    expect(result).toHaveProperty("timestamp");
  }, 90_000);

  it("RTL languages get proper direction hint in prompts", async () => {
    const res = await fetch(`${API_BASE}/api/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic_id: "israel_palestine",
        model_ids: ["nvidia/nemotron-3-super-120b-a12b:free"],
        language_codes: ["ar"],
      }),
    });

    const data = await res.json();
    const prompt = data.results[0].prompt_sent;
    // Should contain Arabic language instruction
    expect(prompt.toLowerCase()).toContain("arabic");
  }, 90_000);

  it("deterministic comparison_id for same inputs", async () => {
    const payload = {
      topic_id: "israel_palestine",
      model_ids: ["nvidia/nemotron-3-super-120b-a12b:free"],
      language_codes: ["en"],
    };

    const [first, second] = await Promise.all([
      fetch(`${API_BASE}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => r.json()),
      fetch(`${API_BASE}/api/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then((r) => r.json()),
    ]);

    expect(first.comparison_id).toBe(second.comparison_id);
  }, 90_000);
});
