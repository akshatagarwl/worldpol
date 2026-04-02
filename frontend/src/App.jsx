import { useState, useEffect } from 'react';
import { fetchTopics, fetchModels, fetchLanguages, runComparison } from './api';
import TopicSelector from './components/TopicSelector';
import ModelSelector from './components/ModelSelector';
import LanguageSelector from './components/LanguageSelector';
import CompareButton from './components/CompareButton';
import ResultsGrid from './components/ResultsGrid';

export default function App() {
  const [topics, setTopics] = useState([]);
  const [models, setModels] = useState([]);
  const [languages, setLanguages] = useState([]);

  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchTopics(), fetchModels(), fetchLanguages()])
      .then(([t, m, l]) => {
        setTopics(t);
        setModels(m);
        setLanguages(l);
      })
      .catch((err) => setError('Failed to load data from API: ' + err.message));
  }, []);

  const toggleModel = (id) =>
    setSelectedModels((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );

  const toggleLanguage = (code) =>
    setSelectedLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );

  const canCompare = selectedTopic && selectedModels.length > 0 && selectedLanguages.length > 0;

  const handleCompare = async () => {
    if (!canCompare) return;
    setLoading(true);
    setError(null);
    try {
      const data = await runComparison(selectedTopic.id, selectedModels, selectedLanguages);
      setResults(data);
    } catch (err) {
      setError('Comparison failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">worldpol</h1>
          <span className="text-sm text-gray-500">Multilingual LLM Bias Observatory</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <TopicSelector topics={topics} selectedTopic={selectedTopic} onSelect={setSelectedTopic} />

        <ModelSelector
          models={models}
          selectedModels={selectedModels}
          onToggle={toggleModel}
          onSelectAll={() => setSelectedModels(models.map((m) => m.id))}
          onDeselectAll={() => setSelectedModels([])}
        />

        <LanguageSelector
          languages={languages}
          selectedLanguages={selectedLanguages}
          onToggle={toggleLanguage}
          onSelectAll={() => setSelectedLanguages(languages.map((l) => l.code))}
        />

        <CompareButton disabled={!canCompare} loading={loading} onClick={handleCompare} />

        <ResultsGrid results={results} models={models} languages={languages} />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-4 text-center text-xs text-gray-600">
        worldpol — Multilingual LLM Bias Observatory | See FUTURE.md for research roadmap
      </footer>
    </div>
  );
}
