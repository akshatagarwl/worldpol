export default function CompareButton({ disabled, loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-4 rounded-xl text-lg font-bold transition-all cursor-pointer ${
        disabled
          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
          : loading
          ? 'bg-indigo-800 text-indigo-300 cursor-wait'
          : 'bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.99] shadow-lg shadow-indigo-900/50'
      }`}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating Comparisons…
        </span>
      ) : (
        'Compare Responses'
      )}
    </button>
  );
}
