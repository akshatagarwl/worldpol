export type TopicCategory = "territorial" | "religious" | "historical" | "ideological";

export interface Topic {
  id: string;
  category: TopicCategory;
  name: string;
  prompt_template: string;
}

export interface Model {
  id: string;
  name: string;
  origin_country: string;
  description: string;
}

export type TextDirection = "ltr" | "rtl";

export interface Language {
  code: string;
  name: string;
  native_name: string;
  direction: TextDirection;
}

export interface CompareResultItem {
  model: {
    id: string;
    name: string;
    origin: string;
  };
  language: {
    code: string;
    name: string;
  };
  prompt_sent: string;
  response: string;
  cached: boolean;
  timestamp: string;
}

export interface CompareResponse {
  comparison_id: string;
  topic: {
    id: string;
    name: string;
    category: string;
    prompt_template: string;
  };
  results: CompareResultItem[];
}

export const RTL_CODES = new Set(["ar", "he"]);

export const CATEGORY_COLORS: Record<TopicCategory, { bg: string; text: string; border: string }> =
  {
    territorial: { bg: "bg-red-950/50", text: "text-red-400", border: "border-red-800" },
    religious: { bg: "bg-purple-950/50", text: "text-purple-400", border: "border-purple-800" },
    historical: { bg: "bg-amber-950/50", text: "text-amber-400", border: "border-amber-800" },
    ideological: { bg: "bg-blue-950/50", text: "text-blue-400", border: "border-blue-800" },
  };

export const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  China: "🇨🇳",
  UK: "🇬🇧",
  France: "🇫🇷",
  Germany: "🇩🇪",
  India: "🇮🇳",
  Japan: "🇯🇵",
  SouthKorea: "🇰🇷",
  Canada: "🇨🇦",
  UAE: "🇦🇪",
};
