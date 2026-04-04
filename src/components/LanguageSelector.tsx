import type { Language } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguages: string[];
  onToggle: (code: string) => void;
  onSelectAll: () => void;
}

export function LanguageSelector({
  languages,
  selectedLanguages,
  onToggle,
  onSelectAll,
}: LanguageSelectorProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">Select Languages</h2>
        <button
          onClick={onSelectAll}
          className="rounded-md bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          Select All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => onToggle(lang.code)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
                isSelected
                  ? "border-primary bg-primary/20 text-primary-foreground"
                  : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              <span className="font-medium">{lang.native_name}</span>
              <span className="text-xs text-muted-foreground">({lang.name})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
