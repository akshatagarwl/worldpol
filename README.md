# worldpol

**Multilingual LLM Bias Observatory** — side-by-side comparison of how different AI models respond to politically and religiously contested topics across languages.

## Why this exists

The same question about Israel-Palestine, Taiwan, Kashmir, or religious comparison gets wildly different answers depending on:
- **Which model** you ask (GPT-4, Claude, Gemini, DeepSeek, Qwen, Llama, Mistral)
- **Which language** you ask in (English, Arabic, Chinese, Russian, Hindi, Hebrew, Turkish)

This tool makes those differences visible.

## Architecture

```
Frontend (React + Vite)     →  Backend (FastAPI)     →  OpenRouter API
   comparison grid UI           prompt dispatch            multi-model access
                                SQLite response cache
```

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
echo "OPENROUTER_API_KEY=your-key" > .env
uvicorn app:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Topics (v1)

| Category | Topics |
|----------|--------|
| Territorial | Israel-Palestine, Taiwan, Kashmir, Crimea/Ukraine, South China Sea |
| Religious | Islam & violence, Hinduism & caste, Christianity & colonialism, atheism |
| Historical | Tiananmen Square, Armenian genocide, Partition of India, Nakba |
| Ideological | Capitalism vs socialism, democracy in China, US foreign policy |

## Models (v1)

- `openai/gpt-4o` — US/Western baseline
- `anthropic/claude-sonnet-4` — US/Western, different alignment
- `google/gemini-2.0-flash` — Google's perspective
- `deepseek/deepseek-chat` — Chinese-trained
- `qwen/qwen-2.5-72b-instruct` — Chinese (Alibaba)
- `meta-llama/llama-3.1-70b-instruct` — Open-source US
- `mistralai/mistral-large` — European (French)

## Languages (v1)

English, Arabic (العربية), Chinese (中文), Russian (Русский), Hindi (हिन्दी), Hebrew (עברית), Turkish (Türkçe)

## License

MIT

See [FUTURE.md](FUTURE.md) for research roadmap and expansion plans.
