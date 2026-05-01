export const taskStatuses = ["todo", "in_progress", "done"];

export function formatStatus(status) {
  return status.replace("_", " ");
}

export function isOverdue(task) {
  return (
    task.due_date &&
    task.status !== "done" &&
    new Date(task.due_date) < new Date()
  );
}