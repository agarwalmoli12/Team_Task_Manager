export default function StatCard({
  label,
  value,
  icon: Icon,
  tone = "olive",
  helper,
  onClick,
  active = false,
}) {
  const tones = {
    olive: "bg-olive-800 text-white",
    light: "bg-olive-100 text-olive-800 dark:bg-olive-800 dark:text-olive-100",
    medium: "bg-olive-600 text-white",
    deep: "bg-olive-900 text-white",
    red: "bg-red-600 text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`panel w-full text-left transition hover:-translate-y-0.5 hover:border-olive-300 disabled:cursor-default disabled:hover:translate-y-0 ${
        active ? "ring-2 ring-olive-500 dark:ring-olive-200" : ""
      }`}
      disabled={!onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{label}</p>
          <h2 className="mt-2 text-3xl font-black text-olive-900 dark:text-olive-50">{value || 0}</h2>
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {helper && <p className="mt-3 text-sm text-olive-700 dark:text-olive-200">{helper}</p>}
    </button>
  );
}
