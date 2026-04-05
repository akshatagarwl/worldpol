import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const responses = sqliteTable(
  "responses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    topicId: text("topic_id").notNull(),
    modelId: text("model_id").notNull(),
    languageCode: text("language_code").notNull(),
    prompt: text("prompt").notNull(),
    responseText: text("response_text").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (t) => [uniqueIndex("idx_responses_unique").on(t.topicId, t.modelId, t.languageCode)],
);
