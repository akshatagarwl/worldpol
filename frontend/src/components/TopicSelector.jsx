const categoryColors = {
  Territorial: 'bg-red-900/50 text-red-300 border-red-700',
  Religious: 'bg-purple-900/50 text-purple-300 border-purple-700',
  Historical: 'bg-amber-900/50 text-amber-300 border-amber-700',
  Ideological: 'bg-blue-900/50 text-blue-300 border-blue-700',
};

const categoryBadge = {
  Territorial: 'bg-red-800 text-red-200',
  Religious: 'bg-purple-800 text-purple-200',
  Historical: 'bg-amber-800 text-amber-200',
  Ideological: 'bg-blue-800 text-blue-200',
};

export default function TopicSelector({ topics, selectedTopic, onSelect }) {
  const grouped = topics.reduce((acc, topic) => {
    const cat = topic.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(topic);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-200">1. Select a Topic</h2>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-medium text-gray-400 mb-2">{category}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {items.map((topic) => {
              const isSelected = selectedTopic?.id === topic.id;
              const colors = categoryColors[category] || 'bg-gray-800 text-gray-300 border-gray-600';
              const badge = categoryBadge[category] || 'bg-gray-700 text-gray-300';
              return (
                <button
                  key={topic.id}
                  onClick={() => onSelect(topic)}
                  className={`text-left p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? `${colors} ring-2 ring-white/30 scale-[1.02]`
                      : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="font-medium text-sm">{topic.name}</div>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${badge}`}>
                    {category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
