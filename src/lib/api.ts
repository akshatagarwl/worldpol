import { Effect, Schema } from "effect";
import { HttpClient, HttpClientRequest } from "@effect/platform";
import { FetchHttpClient } from "@effect/platform";
import type { Topic, Model, Language, CompareResponse } from "./types";

const API_BASE = "/api";

const TopicSchema = Schema.Struct({
  id: Schema.String,
  category: Schema.String,
  name: Schema.String,
  prompt_template: Schema.String,
});

const ModelSchema = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  origin_country: Schema.String,
  description: Schema.String,
});

const LanguageSchema = Schema.Struct({
  code: Schema.String,
  name: Schema.String,
  native_name: Schema.String,
  direction: Schema.String,
});

const TopicsResponse = Schema.Array(TopicSchema);
const ModelsResponse = Schema.Array(ModelSchema);
const LanguagesResponse = Schema.Array(LanguageSchema);

const CompareRequestSchema = Schema.Struct({
  topic_id: Schema.String,
  model_ids: Schema.Array(Schema.String),
  language_codes: Schema.Array(Schema.String),
});

const CompareResponseSchema = Schema.Struct({
  comparison_id: Schema.String,
  topic: Schema.Struct({
    id: Schema.String,
    name: Schema.String,
    category: Schema.String,
    prompt_template: Schema.String,
  }),
  results: Schema.Array(
    Schema.Struct({
      model: Schema.Struct({
        id: Schema.String,
        name: Schema.String,
        origin: Schema.String,
      }),
      language: Schema.Struct({
        code: Schema.String,
        name: Schema.String,
      }),
      prompt_sent: Schema.String,
      response: Schema.String,
      cached: Schema.Boolean,
      timestamp: Schema.String,
    }),
  ),
});

const provideClient = Effect.provide(FetchHttpClient.layer);

function fetchJson<A>(url: string, schema: Schema.Schema<A>) {
  return Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const request = HttpClientRequest.get(url);
    const response = yield* client.execute(request);
    const body = yield* response.json;
    return yield* Schema.decodeUnknown(schema)(body);
  }).pipe(provideClient);
}

function postJson<A>(url: string, body: unknown, schema: Schema.Schema<A>) {
  return Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const request = HttpClientRequest.bodyUnsafeJson(HttpClientRequest.post(url), body);
    const response = yield* client.execute(request);
    const json = yield* response.json;
    return yield* Schema.decodeUnknown(schema)(json);
  }).pipe(provideClient);
}

export function fetchTopics(): Promise<Topic[]> {
  return Effect.runPromise(fetchJson(`${API_BASE}/topics`, TopicsResponse)) as Promise<Topic[]>;
}

export function fetchModels(): Promise<Model[]> {
  return Effect.runPromise(fetchJson(`${API_BASE}/models`, ModelsResponse)) as Promise<Model[]>;
}

export function fetchLanguages(): Promise<Language[]> {
  return Effect.runPromise(fetchJson(`${API_BASE}/languages`, LanguagesResponse)) as Promise<
    Language[]
  >;
}

export function runComparison(
  topicId: string,
  modelIds: string[],
  languageCodes: string[],
): Promise<CompareResponse> {
  const body = Schema.encodeSync(CompareRequestSchema)({
    topic_id: topicId,
    model_ids: modelIds,
    language_codes: languageCodes,
  });
  return Effect.runPromise(
    postJson(`${API_BASE}/compare`, body, CompareResponseSchema),
  ) as Promise<CompareResponse>;
}
