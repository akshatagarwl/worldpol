import type { Language } from "@/lib/types";
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
        <CardTitle>Select Languages</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm" onClick={onSelectAll}>
            Select All
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Toggle
              key={lang.code}
              variant="outline"
              pressed={selectedLanguages.includes(lang.code)}
              onPressedChange={() => onToggle(lang.code)}
            >
              <span className="font-medium">{lang.native_name}</span>
              <span className="text-xs text-muted-foreground">({lang.name})</span>
            </Toggle>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
