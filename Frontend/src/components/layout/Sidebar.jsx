import { FolderKanban, LayoutDashboard, LogOut, ShieldCheck, UserRound } from "lucide-react";

export default function Sidebar({ logout, user, onNavigate, mobile = false, onClose }) {
  return (
    <aside
      className={`${
        mobile ? "relative block h-full" : "sticky top-0 hidden h-screen lg:block"
      } w-72 shrink-0 border-r border-olive-100 bg-white p-6 dark:border-olive-800 dark:bg-[#202917]`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-olive-800 text-white">
          <FolderKanban size={22} />
        </div>
        <div>
          <h1 className="text-xl font-black text-olive-900 dark:text-olive-50">Taskify</h1>
          <p className="text-xs font-semibold uppercase tracking-wide text-olive-600">
            Team workspace
          </p>
        </div>
      </div>

      <nav className="mt-10 space-y-2">
        <button
          type="button"
          onClick={() => {
            onNavigate?.("dashboard");
            onClose?.();
          }}
          className="flex w-full items-center gap-3 rounded-lg bg-olive-800 px-4 py-3 text-left text-sm font-bold text-white"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>
        <button
          type="button"
          onClick={() => {
            onNavigate?.("team");
            onClose?.();
          }}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-olive-700 transition hover:bg-olive-50 dark:text-olive-200 dark:hover:bg-olive-800"
        >
          <UserRound size={18} />
          Team and tasks
        </button>
      </nav>

      <button
        onClick={logout}
        className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
      >
        <LogOut size={18} />
        Logout
      </button>

      <div className="absolute bottom-24 left-6 right-6 rounded-lg border border-olive-100 bg-olive-50 p-4 dark:border-olive-700 dark:bg-olive-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-olive-700 text-sm font-black text-white">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-olive-900 dark:text-olive-50">{user.name}</p>
            <p className="truncate text-xs text-olive-700 dark:text-olive-200">{user.email}</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-white px-2 py-1 text-xs font-bold capitalize text-olive-700 ring-1 ring-olive-100 dark:bg-olive-800 dark:text-olive-100 dark:ring-olive-700">
          <ShieldCheck size={14} />
          {user.role}
        </div>
      </div>
    </aside>
  );
}
