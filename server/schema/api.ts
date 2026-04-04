import { Schema } from "@effect/schema"

export const CompareRequest = Schema.Struct({
  topic_id: Schema.String.pipe(Schema.nonEmptyString()),
  model_ids: Schema.Array(Schema.String.pipe(Schema.nonEmptyString())),
  language_codes: Schema.Array(Schema.String.pipe(Schema.nonEmptyString())),
})

export type CompareRequest = Schema.Schema.Type<typeof CompareRequest>

export interface CompareResponse {
  readonly comparison_id: string
  readonly topic: {
    readonly id: string
    readonly name: string
    readonly category: string
    readonly prompt_template: string
  }
  readonly results: ReadonlyArray<{
    readonly model: {
      readonly id: string
      readonly name: string
      readonly origin: string
    }
    readonly language: {
      readonly code: string
      readonly name: string
    }
    readonly prompt_sent: string
    readonly response: string
    readonly cached: boolean
    readonly timestamp: string
  }>
}
