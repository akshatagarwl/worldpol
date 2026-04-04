import type { CompareResponse, Language, Model } from "@/lib/types";
import { RTL_CODES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ResultsGridProps {
  data: CompareResponse;
  models: Model[];
  languages: Language[];
  selectedModelIds: string[];
  selectedLanguageCodes: string[];
}

function ResponseCell({ response, cached, langCode }: { response: string; cached: boolean; langCode: string }) {
  const isRtl = RTL_CODES.has(langCode);
  return (
    <div
      className={cn(
        "relative h-64 overflow-y-auto rounded-lg border border-border bg-muted/50 p-3 text-sm leading-relaxed",
        isRtl && "text-right",
      )}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {cached && (
        <span className="absolute top-2 right-2 inline-flex items-center rounded-md bg-amber-900/50 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
          Cached
        </span>
      )}
      <p className="whitespace-pre-wrap text-foreground">{response}</p>
    </div>
  );
}

export function ResultsGrid({
  data,
  models,
  languages,
  selectedModelIds,
  selectedLanguageCodes,
}: ResultsGridProps) {
  const selectedModels = models.filter((m) => selectedModelIds.includes(m.id));
  const selectedLangs = languages.filter((l) => selectedLanguageCodes.includes(l.code));

  const getResponse = (modelId: string, langCode: string) =>
    data.results.find(
      (r) => r.model.id === modelId && r.language.code === langCode,
    );

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-card-foreground">Results</h2>
        <p className="text-sm text-muted-foreground">
          Topic: <span className="font-medium text-foreground">{data.topic.name}</span>
        </p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-fit">
          {/* Header row */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `minmax(120px, 1fr) repeat(${selectedLangs.length}, minmax(280px, 1fr))` }}>
            <div className="p-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Model
            </div>
            {selectedLangs.map((lang) => (
              <div key={lang.code} className="p-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {lang.native_name}
                <span className="ml-1 text-muted-foreground/60">({lang.name})</span>
              </div>
            ))}
          </div>
          {/* Data rows */}
          {selectedModels.map((model) => (
            <div
              key={model.id}
              className="grid gap-2 border-t border-border pt-2 mt-2"
              style={{ gridTemplateColumns: `minmax(120px, 1fr) repeat(${selectedLangs.length}, minmax(280px, 1fr))` }}
            >
              <div className="flex items-start p-2">
                <div>
                  <div className="text-sm font-medium text-card-foreground">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.origin_country}</div>
                </div>
              </div>
              {selectedLangs.map((lang) => {
                const result = getResponse(model.id, lang.code);
                return (
                  <div key={lang.code} className="p-1">
                    {result ? (
                      <ResponseCell
                        response={result.response}
                        cached={result.cached}
                        langCode={lang.code}
                      />
                    ) : (
                      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                        No data
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
