import type { Topic } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";

interface TopicSelectorProps {
  topics: Topic[];
  selectedTopic: string | null;
  onSelect: (topicId: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  territorial: "Territorial",
  religious: "Religious",
  historical: "Historical",
  ideological: "Ideological",
};

const CATEGORY_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  territorial: "destructive",
  religious: "default",
  historical: "outline",
  ideological: "secondary",
};

export function TopicSelector({ topics, selectedTopic, onSelect }: TopicSelectorProps) {
  const grouped = topics.reduce<Record<string, Topic[]>>((acc, topic) => {
    if (!acc[topic.category]) acc[topic.category] = [];
    acc[topic.category].push(topic);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select a Topic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(grouped).map(([category, categoryTopics]) => (
          <div key={category}>
            <Badge variant={CATEGORY_VARIANT[category] ?? "outline"} className="mb-2">
              {CATEGORY_LABELS[category] ?? category}
            </Badge>
            <div className="flex flex-wrap gap-2">
              {categoryTopics.map((topic) => (
                <Toggle
                  key={topic.id}
                  variant="outline"
                  pressed={selectedTopic === topic.id}
                  onPressedChange={() => onSelect(topic.id)}
                >
                  {topic.name}
                </Toggle>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
