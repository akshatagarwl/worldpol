import { useState, useEffect, useCallback } from "react";
import type { Topic, Model, Language, CompareResponse } from "@/lib/types";
import { fetchTopics, fetchModels, fetchLanguages, runComparison } from "@/lib/api";
import { TopicSelector } from "@/components/TopicSelector";
import { ModelSelector } from "@/components/ModelSelector";
import { LanguageSelector } from "@/components/LanguageSelector";
import { CompareButton } from "@/components/CompareButton";
import { ResultsGrid } from "@/components/ResultsGrid";
import { Globe } from "lucide-react";

function App() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);

  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [t, m, l] = await Promise.all([fetchTopics(), fetchModels(), fetchLanguages()]);
        setTopics(t);
        setModels(m);
        setLanguages(l);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      }
    }
    load();
  }, []);

  const toggleModel = useCallback((modelId: string) => {
    setSelectedModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId],
    );
  }, []);

  const toggleLanguage = useCallback((code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  }, []);

  const canCompare =
    selectedTopic !== null && selectedModels.length > 0 && selectedLanguages.length > 0;

  const handleCompare = async () => {
    if (!selectedTopic || selectedModels.length === 0 || selectedLanguages.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data = await runComparison(selectedTopic, selectedModels, selectedLanguages);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-4">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-card-foreground">WorldPol</h1>
          <span className="text-sm text-muted-foreground">AI Political Bias Comparison Tool</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {topics.length > 0 && (
          <TopicSelector
            topics={topics}
            selectedTopic={selectedTopic}
            onSelect={setSelectedTopic}
          />
        )}

        {models.length > 0 && (
          <ModelSelector
            models={models}
            selectedModels={selectedModels}
            onToggle={toggleModel}
            onSelectAll={() => setSelectedModels(models.map((m) => m.id))}
            onDeselectAll={() => setSelectedModels([])}
          />
        )}

        {languages.length > 0 && (
          <LanguageSelector
            languages={languages}
            selectedLanguages={selectedLanguages}
            onToggle={toggleLanguage}
            onSelectAll={() => setSelectedLanguages(languages.map((l) => l.code))}
          />
        )}

        <CompareButton onClick={handleCompare} disabled={!canCompare} loading={loading} />

        {results && (
          <ResultsGrid
            data={results}
            models={models}
            languages={languages}
            selectedModelIds={selectedModels}
            selectedLanguageCodes={selectedLanguages}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4 text-center text-xs text-muted-foreground">
          WorldPol — Comparing AI model biases across languages and cultures
        </div>
      </footer>
    </div>
  );
}

export default App;
