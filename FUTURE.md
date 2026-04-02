# Future Expansion & Research Scope

## Phase 2: Automated Analysis

- **Stance detection** — classify each response as pro/neutral/anti on the topic's axis
- **Sentiment analysis** — emotional tone scoring per response
- **Refusal detection** — flag when models refuse to engage vs give a hedged answer
- **Consistency scoring** — does the same model contradict itself across languages?

## Phase 3: Deeper Linguistic Analysis

- **Translation parity** — translate all responses to English and compare semantic similarity
- **Cultural framing** — detect when models adopt culturally specific narratives (e.g., "liberation" vs "terrorism" for the same event)
- **Prompt sensitivity** — how much does rephrasing the same question shift the answer?
- **Code-switching** — ask in mixed languages (Hinglish, Arabic-English) and see what happens

## Phase 4: Temporal Tracking

- **Model version drift** — track how GPT-4's answer to "Who owns Taiwan?" changes across updates
- **News reactivity** — do models shift stance after major world events?
- **Training data archaeology** — infer training data bias from response patterns

## Phase 5: Community & Research

- **User-submitted prompts** — let researchers add their own contested questions
- **Exportable datasets** — CSV/JSON dumps for academic research
- **Bias scorecards** — per-model report cards on geopolitical alignment
- **Embeddable widgets** — let journalists embed specific comparisons
- **Academic paper pipeline** — auto-generate comparison tables for papers

## Phase 6: Beyond Text

- **Image generation bias** — same prompt to DALL-E, Midjourney, Stable Diffusion across languages
- **Voice/TTS tone** — does the emotional delivery change by language?
- **Video generation** — emerging models (Sora, etc.) on contested historical events

## Research Questions This Tool Can Answer

1. Do Chinese-trained models (DeepSeek, Qwen) systematically align with PRC positions?
2. Does asking in Arabic about Islam produce more sympathetic responses than asking in English?
3. Which models refuse to engage with contested topics, and in which languages?
4. Is there a measurable "Western liberal" bias in US-trained models?
5. Do European models (Mistral) show different stances on colonialism than US models?
6. How do models handle the same historical event framed differently (e.g., "Nakba" vs "Israeli War of Independence")?
7. Does model size correlate with more or less opinionated responses?
8. Are open-source models more or less biased than proprietary ones?

## Technical Expansion

- **Self-hosted models** via Ollama/vLLM for models not on OpenRouter
- **Batch processing** — run all permutations overnight, browse results next day
- **Diff view** — character-level diff between same-model different-language responses
- **API access** — let researchers query the collected dataset programmatically
- **Caching layer** — avoid re-running identical queries (SQLite → PostgreSQL for scale)
