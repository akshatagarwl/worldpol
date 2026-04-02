MODELS = [
    {
        "id": "openai/gpt-4o",
        "name": "GPT-4o",
        "origin_country": "US",
        "description": "OpenAI's flagship multimodal model",
    },
    {
        "id": "anthropic/claude-sonnet-4",
        "name": "Claude Sonnet 4",
        "origin_country": "US",
        "description": "Anthropic's balanced intelligence model",
    },
    {
        "id": "google/gemini-2.0-flash-001",
        "name": "Gemini 2.0 Flash",
        "origin_country": "US",
        "description": "Google's fast multimodal model",
    },
    {
        "id": "deepseek/deepseek-chat",
        "name": "DeepSeek Chat",
        "origin_country": "China",
        "description": "DeepSeek's conversational model",
    },
    {
        "id": "qwen/qwen-2.5-72b-instruct",
        "name": "Qwen 2.5 72B",
        "origin_country": "China",
        "description": "Alibaba's large instruction-tuned model",
    },
    {
        "id": "meta-llama/llama-3.1-70b-instruct",
        "name": "Llama 3.1 70B",
        "origin_country": "US",
        "description": "Meta's open-weight instruction model",
    },
    {
        "id": "mistralai/mistral-large",
        "name": "Mistral Large",
        "origin_country": "France",
        "description": "Mistral AI's most capable model",
    },
]


def get_model(model_id: str):
    return next((m for m in MODELS if m["id"] == model_id), None)
