MODELS = [
    {
        "id": "nvidia/nemotron-3-super-120b-a12b:free",
        "name": "Nemotron 3 Super",
        "origin_country": "US",
        "description": "NVIDIA's 120B open model",
    },
    {
        "id": "qwen/qwen3.6-plus:free",
        "name": "Qwen 3.6 Plus",
        "origin_country": "China",
        "description": "Alibaba's latest reasoning model",
    },
    {
        "id": "google/gemma-3-27b-it:free",
        "name": "Gemma 3 27B",
        "origin_country": "US",
        "description": "Google's open instruction-tuned model",
    },
    {
        "id": "meta-llama/llama-3.3-70b-instruct:free",
        "name": "Llama 3.3 70B",
        "origin_country": "US",
        "description": "Meta's open-weight instruction model",
    },
    {
        "id": "nousresearch/hermes-3-llama-3.1-405b:free",
        "name": "Hermes 3 405B",
        "origin_country": "US",
        "description": "Nous Research's large open model",
    },
]


def get_model(model_id: str):
    return next((m for m in MODELS if m["id"] == model_id), None)
