const countryFlags = {
  US: '🇺🇸',
  France: '🇫🇷',
  China: '🇨🇳',
  UK: '🇬🇧',
  Germany: '🇩🇪',
  Japan: '🇯🇵',
  Russia: '🇷🇺',
  India: '🇮🇳',
  Israel: '🇮🇱',
  UAE: '🇦🇪',
};

export default function ModelSelector({ models, selectedModels, onToggle, onSelectAll, onDeselectAll }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">2. Select Models</h2>
        <div className="flex gap-2">
          <button
            onClick={onSelectAll}
            className="text-xs px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition cursor-pointer"
          >
            Select All
          </button>
          <button
            onClick={onDeselectAll}
            className="text-xs px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition cursor-pointer"
          >
            Deselect All
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {models.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          const flag = countryFlags[model.origin_country] || '🌐';
          return (
            <label
              key={model.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-indigo-900/30 border-indigo-600 text-white'
                  : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-800 hover:border-gray-500'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(model.id)}
                className="accent-indigo-500 w-4 h-4"
              />
              <div>
                <div className="font-medium text-sm">
                  {flag} {model.name}
                </div>
                <div className="text-xs text-gray-500">{model.origin_country}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
