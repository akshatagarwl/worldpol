import type { Language } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Select Languages</CardTitle>
        <CardAction>
          <Button variant="secondary" size="xs" onClick={onSelectAll}>
            Select All
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => {
            const isSelected = selectedLanguages.includes(lang.code);
            return (
              <Toggle
                key={lang.code}
                variant="outline"
                pressed={isSelected}
                onPressedChange={() => onToggle(lang.code)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  isSelected
                    ? "border-primary bg-primary/20 text-primary-foreground"
                    : "border-border bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
              >
                <span className="font-medium">{lang.native_name}</span>
                <span className="text-xs text-muted-foreground">({lang.name})</span>
              </Toggle>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
