import type { Topic } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TopicSelectorProps {
  topics: Topic[];
  selectedTopic: string | null;
  onSelect: (topicId: string) => void;
}

export function TopicSelector({ topics, selectedTopic, onSelect }: TopicSelectorProps) {
  const grouped = topics.reduce<Record<string, Topic[]>>((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    territorial: "Territorial",
    religious: "Religious",
    historical: "Historical",
    ideological: "Ideological",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-lg font-semibold text-card-foreground">Select a Topic</h2>
      <div className="space-y-5">
        {Object.entries(grouped).map(([category, categoryTopics]) => {
          const colors = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS];
          return (
            <div key={category}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
                    colors.bg,
                    colors.text,
                    "border",
                    colors.border,
                  )}
                >
                  {categoryLabels[category] ?? category}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => onSelect(topic.id)}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                      selectedTopic === topic.id
                        ? "border-primary bg-primary/20 text-primary-foreground"
                        : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )}
                  >
                    {topic.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
