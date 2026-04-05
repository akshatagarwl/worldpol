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
