import TaskCard from "./TaskCard";
import { Plus, SendHorizontal } from "lucide-react";

export default function TaskBoard({
  tasks,
  canCreate,
  taskForm,
  onTaskFormChange,
  onCreateTask,
  onStatusChange,
  onDeleteTask,
  isBusy,
  canDelete,
}) {
  const grouped = {
    todo: tasks.filter((task) => task.status === "todo"),
    in_progress: tasks.filter((task) => task.status === "in_progress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  return (
    <section className="space-y-5">
      {canCreate && (
        <form onSubmit={onCreateTask} className="panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Planning</p>
              <h2 className="mt-1 text-lg font-black text-olive-900 dark:text-olive-50">Create task</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-olive-700 text-white">
              <Plus size={19} />
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input
              className="field"
              placeholder="Task title"
              value={taskForm.title}
              onChange={(e) => onTaskFormChange({ ...taskForm, title: e.target.value })}
              required
            />
            <input
              className="field"
              type="email"
              placeholder="Assignee email"
              value={taskForm.assignee_email}
              onChange={(e) => onTaskFormChange({ ...taskForm, assignee_email: e.target.value })}
            />
            <textarea
              className="field min-h-24 resize-none md:col-span-2"
              placeholder="Description"
              value={taskForm.description}
              onChange={(e) => onTaskFormChange({ ...taskForm, description: e.target.value })}
            />
            <input
              className="field"
              type="datetime-local"
              value={taskForm.due_date}
              onChange={(e) => onTaskFormChange({ ...taskForm, due_date: e.target.value })}
            />
            <button className="primary-btn" disabled={isBusy}>
              <SendHorizontal size={18} />
              Add task
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {[
          ["todo", "To do"],
          ["in_progress", "In progress"],
          ["done", "Done"],
        ].map(([status, label]) => (
          <div key={status} className="rounded-lg border border-olive-100 bg-olive-50 p-3 dark:border-olive-800 dark:bg-[#202917]">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-black text-olive-900 dark:text-olive-50">{label}</h3>
              <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-olive-700 ring-1 ring-olive-100 dark:bg-olive-800 dark:text-olive-100 dark:ring-olive-700">
                {grouped[status].length}
              </span>
            </div>

            <div className="space-y-3">
              {grouped[status].length === 0 && (
                <div className="rounded-lg border border-dashed border-olive-200 bg-white p-4 text-sm text-olive-700 dark:border-olive-700 dark:bg-olive-900 dark:text-olive-200">
                  No tasks here.
                </div>
              )}

              {grouped[status].map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onStatusChange}
                  onDelete={onDeleteTask}
                  canDelete={canDelete}
                  isBusy={isBusy}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
