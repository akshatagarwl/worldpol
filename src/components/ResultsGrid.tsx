import type { CompareResponse, Language, Model } from "@/lib/types";
import { RTL_CODES } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ResultsGridProps {
  data: CompareResponse;
  models: Model[];
  languages: Language[];
  selectedModelIds: string[];
  selectedLanguageCodes: string[];
}

function ResponseCell({
  response,
  cached,
  langCode,
}: {
  response: string;
  cached: boolean;
  langCode: string;
}) {
  const isRtl = RTL_CODES.has(langCode);
  return (
    <ScrollArea className="relative h-64 rounded-lg border" dir={isRtl ? "rtl" : "ltr"}>
      <div className="p-3 text-sm leading-relaxed">
        {cached && (
          <Badge variant="outline" className="absolute top-2 right-2 text-xs">
            Cached
          </Badge>
        )}
        <p className="whitespace-pre-wrap">{response}</p>
      </div>
    </ScrollArea>
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
    data.results.find((r) => r.model.id === modelId && r.language.code === langCode);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>Topic: {data.topic.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              {selectedLangs.map((lang) => (
                <TableHead key={lang.code} className="text-center">
                  {lang.native_name}
                  <span className="ml-1 text-muted-foreground">({lang.name})</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedModels.map((model) => (
              <TableRow key={model.id}>
                <TableCell>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-muted-foreground">{model.origin_country}</div>
                </TableCell>
                {selectedLangs.map((lang) => {
                  const result = getResponse(model.id, lang.code);
                  return (
                    <TableCell key={lang.code} className="p-1">
                      {result ? (
                        <ResponseCell
                          response={result.response}
                          cached={result.cached}
                          langCode={lang.code}
                        />
                      ) : (
                        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                          No data
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
