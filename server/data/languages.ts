export type TextDirection = "ltr" | "rtl";

export interface Language {
  code: string;
  name: string;
  native_name: string;
  direction: TextDirection;
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", native_name: "English", direction: "ltr" },
  { code: "ar", name: "Arabic", native_name: "العربية", direction: "rtl" },
  { code: "zh", name: "Chinese", native_name: "中文", direction: "ltr" },
  { code: "ru", name: "Russian", native_name: "Русский", direction: "ltr" },
  { code: "hi", name: "Hindi", native_name: "हिन्दी", direction: "ltr" },
  { code: "he", name: "Hebrew", native_name: "עברית", direction: "rtl" },
  { code: "tr", name: "Turkish", native_name: "Türkçe", direction: "ltr" },
];

export function getLanguage(code: string): Language | undefined {
  return LANGUAGES.find((l) => l.code === code);
}
