import { Bell, Menu, Search, X } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

export default function Header({
  user,
  theme,
  changeTheme,
  search,
  onSearch,
  onOpenMenu,
  onToggleNotifications,
  notificationsOpen,
  notificationCount,
}) {
  return (
    <header className="flex flex-col gap-4 rounded-lg border border-olive-100 bg-white p-4 shadow-sm dark:border-olive-800 dark:bg-olive-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onOpenMenu} className="icon-btn lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div>
          <p className="eyebrow">Welcome back</p>
          <h2 className="text-2xl font-black text-olive-900 dark:text-olive-50">Dashboard</h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden min-w-72 items-center gap-2 rounded-lg border border-olive-100 bg-olive-50 px-3 py-2 text-sm text-olive-700 dark:border-olive-700 dark:bg-olive-800 dark:text-olive-200 md:flex">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-olive-500 dark:placeholder:text-olive-300"
            placeholder="Search projects and tasks"
          />
          {search && (
            <button type="button" onClick={() => onSearch("")} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </label>
        <ThemeToggle theme={theme} changeTheme={changeTheme} />
        <button
          type="button"
          onClick={onToggleNotifications}
          className="secondary-btn relative !h-11 !min-h-0 !w-11 !px-0"
          aria-label="Notifications"
          aria-pressed={notificationsOpen}
        >
          <Bell size={18} />
          {notificationCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
              {notificationCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-3 rounded-lg bg-olive-800 px-3 py-2 text-white dark:bg-olive-100 dark:text-olive-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-sm font-black text-olive-800 dark:bg-olive-800 dark:text-olive-100">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="hidden text-sm sm:block">
            <p className="font-bold leading-none">{user.name}</p>
            <p className="mt-1 text-xs capitalize text-olive-100 dark:text-olive-700">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
