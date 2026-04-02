const BASE_URL = '/api';

export async function fetchTopics() {
  const res = await fetch(`${BASE_URL}/topics`);
  if (!res.ok) throw new Error('Failed to fetch topics');
  return res.json();
}

export async function fetchModels() {
  const res = await fetch(`${BASE_URL}/models`);
  if (!res.ok) throw new Error('Failed to fetch models');
  return res.json();
}

export async function fetchLanguages() {
  const res = await fetch(`${BASE_URL}/languages`);
  if (!res.ok) throw new Error('Failed to fetch languages');
  return res.json();
}

export async function runComparison(topicId, modelIds, languageCodes) {
  const res = await fetch(`${BASE_URL}/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topic_id: topicId,
      model_ids: modelIds,
      language_codes: languageCodes,
    }),
  });
  if (!res.ok) throw new Error('Comparison failed');
  return res.json();
}
