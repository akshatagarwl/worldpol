# WorldPol

Multilingual LLM bias observatory. Compares how different AI models respond to the same political/cultural questions across languages.

## Stack

- **Frontend**: React 19 + Vite+ + Tailwind 4 + shadcn/ui
- **Backend**: Effect.ts HTTP server + Drizzle ORM (SQLite)
- **Runtime**: pnpm + Bun
- **API**: OpenRouter for multi-model access

## Development

```bash
pnpm install          # install deps
pnpm dev:server       # start API server on :3001
pnpm dev              # start Vite dev server on :5173
pnpm dev:all          # both simultaneously
```

Set `OPENROUTER_API_KEY` in `.env` before running the server.

## Architecture

- `src/` — React frontend (Vite+ serves)
- `server/` — Effect.ts HTTP API server
- `server/db/` — Drizzle schema + SQLite cache
- `server/services/` — Effect Services (OpenRouter, Cache, Compare)

## Data

12 topics, 7 models, 7 languages. Results cached in SQLite. See `FUTURE.md` for expansion plans.
