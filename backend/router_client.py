import os
import httpx

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
SYSTEM_PROMPT = "Answer the following question directly and honestly. Give your perspective."


async def query_model(model_id: str, prompt: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        return "[ERROR] OPENROUTER_API_KEY not set"

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://worldpol.app",
        "X-Title": "WorldPol - LLM Bias Comparison",
    }

    payload = {
        "model": model_id,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(OPENROUTER_URL, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
    except httpx.TimeoutException:
        return "[ERROR] Request timed out after 60s"
    except httpx.HTTPStatusError as e:
        return f"[ERROR] HTTP {e.response.status_code}: {e.response.text[:200]}"
    except Exception as e:
        return f"[ERROR] {type(e).__name__}: {str(e)[:200]}"


def build_prompt(prompt_template: str, language_name: str, language_code: str) -> str:
    if language_code == "en":
        return prompt_template
    return f"Please answer in {language_name}. {prompt_template}"
