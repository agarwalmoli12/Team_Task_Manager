import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, changeTheme }) {
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div className="inline-flex rounded-lg border border-olive-100 bg-white p-1 shadow-sm dark:border-olive-700 dark:bg-olive-800">
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => changeTheme(value)}
            className={`inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold transition ${
              active
                ? "bg-olive-800 text-white dark:bg-olive-100 dark:text-olive-900"
                : "text-olive-700 hover:bg-olive-50 dark:text-olive-100 dark:hover:bg-olive-700"
            }`}
            aria-pressed={active}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
