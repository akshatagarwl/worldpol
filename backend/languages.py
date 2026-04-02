LANGUAGES = [
    {"code": "en", "name": "English", "native_name": "English", "direction": "ltr"},
    {"code": "ar", "name": "Arabic", "native_name": "العربية", "direction": "rtl"},
    {"code": "zh", "name": "Chinese", "native_name": "中文", "direction": "ltr"},
    {"code": "ru", "name": "Russian", "native_name": "Русский", "direction": "ltr"},
    {"code": "hi", "name": "Hindi", "native_name": "हिन्दी", "direction": "ltr"},
    {"code": "he", "name": "Hebrew", "native_name": "עברית", "direction": "rtl"},
    {"code": "tr", "name": "Turkish", "native_name": "Türkçe", "direction": "ltr"},
]


def get_language(code: str):
    return next((l for l in LANGUAGES if l["code"] == code), None)
