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

  if (result.loading) {
    return (
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 h-64 flex items-center justify-center">
        <svg className="animate-spin h-6 w-6 text-gray-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden h-64 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-xs font-medium text-gray-300 truncate">
          {result.model_name} · {language.native_name}
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

  // Build a lookup: { `${model_id}-${lang_code}` : result }
  const lookup = {};
  for (const r of results.results) {
    for (const resp of r.responses || []) {
      lookup[`${r.model_id}-${resp.language}`] = {
        model_name: r.model_name,
        response: resp.response,
        cached: resp.cached,
      };
    }
  }

  const selectedModels = results.results.map((r) => ({
    id: r.model_id,
    name: r.model_name,
  }));

  const selectedLanguages = languages.filter((l) =>
    results.results[0]?.responses?.some((resp) => resp.language === l.code)
  );

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
            <>
              <div
                key={`label-${model.id}`}
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
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
