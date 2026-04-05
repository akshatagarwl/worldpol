import type { Model } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ModelSelectorProps {
  models: Model[];
  selectedModels: string[];
  onToggle: (modelId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export function ModelSelector({
  models,
  selectedModels,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: ModelSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Models</CardTitle>
        <CardAction>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onSelectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={onDeselectAll}>
              Deselect All
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => {
            const isSelected = selectedModels.includes(model.id);
            return (
              <label
                key={model.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted has-[button[data-checked]]:border-primary has-[button[data-checked]]:bg-primary/10"
              >
                <Checkbox checked={isSelected} onCheckedChange={() => onToggle(model.id)} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{model.name}</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {model.origin_country}
                  </Badge>
                </div>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
