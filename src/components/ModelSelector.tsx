import type { Model } from "@/lib/types";
import { COUNTRY_FLAGS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

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
        <CardTitle className="text-lg font-semibold">Select Models</CardTitle>
        <CardAction>
          <div className="flex gap-2">
            <Button variant="secondary" size="xs" onClick={onSelectAll}>
              Select All
            </Button>
            <Button variant="secondary" size="xs" onClick={onDeselectAll}>
              Deselect All
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => {
            const isSelected = selectedModels.includes(model.id);
            const flag = COUNTRY_FLAGS[model.origin_country] ?? "\u{1F30D}";
            return (
              <label
                key={model.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-secondary hover:bg-secondary/80",
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggle(model.id)}
                />
                <span className="text-lg">{flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-card-foreground">
                    {model.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{model.description}</div>
                </div>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
