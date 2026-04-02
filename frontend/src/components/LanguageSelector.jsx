export default function LanguageSelector({ languages, selectedLanguages, onToggle, onSelectAll }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">3. Select Languages</h2>
        <button
          onClick={onSelectAll}
          className="text-xs px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition cursor-pointer"
        >
          Select All
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => {
          const isSelected = selectedLanguages.includes(lang.code);
          return (
            <label
              key={lang.code}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-emerald-900/30 border-emerald-600 text-white'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-500'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(lang.code)}
                className="accent-emerald-500 w-4 h-4"
              />
              <span className="text-sm font-medium">{lang.native_name}</span>
              <span className="text-xs text-gray-500">{lang.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
