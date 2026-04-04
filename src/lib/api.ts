import type { Topic, Model, Language, CompareResponse } from "./types";

const API_BASE = "/api";

export async function fetchTopics(): Promise<Topic[]> {
  const res = await fetch(`${API_BASE}/topics`);
  if (!res.ok) throw new Error(`Failed to fetch topics: ${res.statusText}`);
  return res.json();
}

export async function fetchModels(): Promise<Model[]> {
  const res = await fetch(`${API_BASE}/models`);
  if (!res.ok) throw new Error(`Failed to fetch models: ${res.statusText}`);
  return res.json();
}

export async function fetchLanguages(): Promise<Language[]> {
  const res = await fetch(`${API_BASE}/languages`);
  if (!res.ok) throw new Error(`Failed to fetch languages: ${res.statusText}`);
  return res.json();
}

export async function runComparison(
  topicId: string,
  modelIds: string[],
  languageCodes: string[],
): Promise<CompareResponse> {
  const res = await fetch(`${API_BASE}/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic_id: topicId,
      model_ids: modelIds,
      language_codes: languageCodes,
    }),
  });
  if (!res.ok) throw new Error(`Comparison failed: ${res.statusText}`);
  return res.json();
}
