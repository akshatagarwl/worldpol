# WorldPol Migration Plan

## Current Stack -> New Stack

| Layer      | Current                        | New                                       |
| ---------- | ------------------------------ | ----------------------------------------- |
| Language   | Python 3.14 + JS (JSX)         | TypeScript                                |
| Frontend   | React 19 + Vite 8 + Tailwind 4 | React 19 + Vite+ + Tailwind 4 + shadcn/ui |
| Backend    | FastAPI + uvicorn              | Bun + Effect HTTP server                  |
| API Client | httpx (Python) / fetch (JS)    | Effect.ts HTTP client                     |
| Database   | SQLite via aiosqlite           | SQLite via better-sqlite3                 |
| State Mgmt | React useState                 | React hooks + Effect API layer            |
| Toolchain  | npm + vite + manual            | Vite+ (vp)                                |
| Runtime    | Python + Node                  | Bun                                       |

## Architecture

```
worldpol/
  vite.config.ts             # Vite plugins, proxy /api -> :3001
  tsconfig.json
  package.json               # Bun-managed
  .env                       # OPENROUTER_API_KEY

  src/                       # Frontend (Vite+ serves this)
    main.tsx                 # React entry
    App.tsx                  # Root component
    index.css                # Tailwind + shadcn theme
    lib/
      types.ts              # Shared types
      data.ts               # Static data (topics, models, languages)
      api.ts                # Effect-based API client for frontend
      utils.ts              # shadcn cn() helper
    components/
      ui/                   # shadcn/ui primitives
      TopicSelector.tsx
      ModelSelector.tsx
      LanguageSelector.tsx
      CompareButton.tsx
      ResultsGrid.tsx

  server/                    # Backend (Bun runs this separately)
    index.ts                # Effect HTTP server entry point
    routes/
      api.ts                # /api/* route handlers
    services/
      OpenRouterService.ts  # Effect Service for OpenRouter API
      CacheService.ts       # Effect Service for SQLite cache
      CompareService.ts     # Orchestrator: cache -> fetch -> store
    schema/
      api.ts                # @effect/schema for validation
    data/
      topics.ts             # Static topic definitions
      models.ts             # Static model definitions
      languages.ts          # Static language definitions

  docs/
  README.md
  FUTURE.md
  .gitignore
```

## Effect.ts Services

OpenRouterService:

- Dependencies: HttpClient
- chatCompletion(model, messages) -> Effect of response or OpenRouterError
- Layer: Live with API key from env

CacheService:

- Dependencies: none (better-sqlite3)
- get(key), set(key, value), init()
- Layer: Live with DB path

CompareService:

- Dependencies: OpenRouterService + CacheService
- compare(topicId, modelIds, langCodes) -> Effect of results or CompareError
- Layer: Composed from OpenRouter + Cache layers

## Data Flow

Browser -> Vite dev server (:5173)
-> /api/\* proxied to Bun Effect server (:3001)
-> CompareService.compare()
-> CacheService.get() -> hit? return cached
-> miss -> OpenRouterService.chatCompletion()
-> CacheService.set()
-> return result

## Key Decisions

1. Bun over Node -- Vite+ manages it, faster startup
2. better-sqlite3 -- sync, simple, no ORM for 1 table
3. Effect HTTP server -- ecosystem consistency
4. Vite+ for tooling -- unified lint/format/test/build
5. SPA only, no SSR -- keep it simple like original
