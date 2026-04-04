import { Fragment } from 'react';

const rtlLanguages = ['ar', 'he'];

function ResponseCell({ result, language }) {
  const isRtl = rtlLanguages.includes(language.code);

  if (!result) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
        <div className="text-gray-600 text-sm">No data</div>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="bg-gray-800/50 border border-red-900/30 rounded-lg p-4 h-64 flex items-center justify-center">
        <div className="text-red-400 text-sm text-center">{result.error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden h-64 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-medium text-gray-300 truncate">
          {result.model?.name} · {language.native_name || language.name}
        </span>
        <div className="flex gap-1">
          {result.cached && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-900/50 text-yellow-400 border border-yellow-800">
              cached
            </span>
          )}
        </div>
      </div>
      <div
        className="response-cell flex-1 overflow-y-auto p-3 text-sm text-gray-300 leading-relaxed"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {result.response || <span className="text-gray-600 italic">Empty response</span>}
      </div>
    </div>
  );
}

export default function ResultsGrid({ results, models, languages }) {
  if (!results || !results.results || results.results.length === 0) {
    return null;
  }

  // Backend returns flat list: [{ model: {id, name, origin}, language: {code, name}, response, cached, ... }]
  // Build lookup: { `${model_id}-${lang_code}` : result }
  const lookup = {};
  for (const r of results.results) {
    const modelId = r.model?.id;
    const langCode = r.language?.code;
    if (modelId && langCode) {
      lookup[`${modelId}-${langCode}`] = r;
    }
  }

  // Extract unique model ids and language codes from results
  const modelIds = [...new Set(results.results.map((r) => r.model?.id).filter(Boolean))];
  const langCodes = [...new Set(results.results.map((r) => r.language?.code).filter(Boolean))];

  const selectedModels = modelIds.map((id) => {
    const r = results.results.find((r) => r.model?.id === id);
    return { id, name: r.model?.name || id };
  });

  const selectedLanguages = langCodes
    .map((code) => {
      const lang = languages.find((l) => l.code === code);
      const r = results.results.find((r) => r.language?.code === code);
      return { code, name: lang?.name || code, native_name: lang?.native_name || r?.language?.name || code };
    });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-200">
        Results: <span className="text-indigo-400">{results.topic?.name}</span>
      </h2>

      <div className="overflow-x-auto">
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: `160px repeat(${selectedLanguages.length}, minmax(280px, 1fr))`,
          }}
        >
          {/* Header row */}
          <div />
          {selectedLanguages.map((lang) => (
            <div key={lang.code} className="text-center text-sm font-medium text-gray-400 py-2">
              {lang.native_name}
              <div className="text-xs text-gray-600">{lang.name}</div>
            </div>
          ))}

          {/* Data rows */}
          {selectedModels.map((model) => (
            <Fragment key={`row-${model.id}`}>
              <div
                className="flex items-center text-sm font-medium text-gray-300 pr-2"
              >
                {model.name}
              </div>
              {selectedLanguages.map((lang) => (
                <ResponseCell
                  key={`${model.id}-${lang.code}`}
                  result={lookup[`${model.id}-${lang.code}`]}
                  language={lang}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
