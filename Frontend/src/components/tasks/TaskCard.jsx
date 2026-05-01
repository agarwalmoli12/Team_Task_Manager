import { CalendarClock, CheckCircle2, Clock3, Loader2, Trash2, UserRound } from "lucide-react";

const statusConfig = {
  todo: {
    label: "To do",
    icon: Clock3,
    badge: "bg-olive-50 text-olive-800 ring-1 ring-olive-100 dark:bg-olive-800 dark:text-olive-100 dark:ring-olive-700",
  },
  in_progress: {
    label: "In progress",
    icon: Loader2,
    badge: "bg-olive-100 text-olive-900 dark:bg-olive-700 dark:text-white",
  },
  done: {
    label: "Done",
    icon: CheckCircle2,
    badge: "bg-olive-700 text-white",
  },
};

function formatDate(value) {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function TaskCard({ task, onStatusChange, onDelete, canDelete, isBusy }) {
  const status = statusConfig[task.status] || statusConfig.todo;
  const StatusIcon = status.icon;
  const overdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";

  return (
    <article className={`rounded-lg border bg-white p-4 shadow-sm dark:bg-olive-900 ${overdue ? "border-red-200 dark:border-red-500" : "border-olive-100 dark:border-olive-800"}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-bold text-olive-900 dark:text-olive-50">{task.title}</h3>
          <p className="mt-1 text-sm leading-6 text-olive-700 dark:text-olive-200">
            {task.description || "No description added."}
          </p>
        </div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${status.badge}`}>
          <StatusIcon size={14} />
          {status.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-olive-700 dark:text-olive-200">
        <span className={`inline-flex items-center gap-1 ${overdue ? "text-red-700 dark:text-red-300" : ""}`}>
          <CalendarClock size={15} />
          {overdue ? "Overdue " : ""}
          {formatDate(task.due_date)}
        </span>
        <span className="inline-flex items-center gap-1">
          <UserRound size={15} />
          {task.assignee_id ? `User #${task.assignee_id}` : "Unassigned"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-olive-100 pt-4 dark:border-olive-800">
        {Object.keys(statusConfig).map((nextStatus) => (
          <button
            key={nextStatus}
            type="button"
            onClick={() => onStatusChange(task.id, nextStatus)}
            disabled={isBusy || task.status === nextStatus}
            className={`rounded-md px-3 py-2 text-xs font-bold transition ${
              task.status === nextStatus
                ? "bg-olive-800 text-white dark:bg-olive-100 dark:text-olive-900"
                : "bg-olive-50 text-olive-700 hover:bg-olive-100 dark:bg-olive-800 dark:text-olive-100 dark:hover:bg-olive-700"
            } disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {statusConfig[nextStatus].label}
          </button>
        ))}
        {canDelete && (
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            disabled={isBusy}
            className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md bg-red-50 text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </article>
  );
}
