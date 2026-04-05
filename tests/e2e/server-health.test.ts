/**
 * E2E tests for server startup and health checks.
 */
import { describe, it, expect } from "vite-plus/test";

const BASE = "http://localhost:3001";

describe("Server health", () => {
  it("responds on port 3001", async () => {
    const res = await fetch(`${BASE}/api/topics`);
    expect(res.ok).toBe(true);
  });

  it("returns valid JSON for all static endpoints", async () => {
    const endpoints = ["/api/topics", "/api/models", "/api/languages"];
    for (const ep of endpoints) {
      const res = await fetch(`${BASE}${ep}`);
      expect(res.ok).toBe(true);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    }
  });
});
