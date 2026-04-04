import type { Model } from "@/lib/types";
import { COUNTRY_FLAGS } from "@/lib/types";
import { cn } from "@/lib/utils";

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
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">Select Models</h2>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            Deselect All
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          const flag = COUNTRY_FLAGS[model.origin_country] ?? "🌍";
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
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(model.id)}
                className="h-4 w-4 rounded border-border bg-background accent-primary"
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
    </div>
  );
}
