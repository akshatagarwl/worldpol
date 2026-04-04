import type { Topic } from "@/lib/types";
import { CATEGORY_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Select a Topic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {Object.entries(grouped).map(([category, categoryTopics]) => {
          const colors = CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS];
          return (
            <div key={category}>
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(colors.bg, colors.text, colors.border)}
                >
                  {categoryLabels[category] ?? category}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryTopics.map((topic) => (
                  <Toggle
                    key={topic.id}
                    variant="outline"
                    pressed={selectedTopic === topic.id}
                    onPressedChange={() => onSelect(topic.id)}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-sm",
                      selectedTopic === topic.id
                        ? "border-primary bg-primary/20 text-primary-foreground"
                        : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
                    )}
                  >
                    {topic.name}
                  </Toggle>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
