import { Folder, Plus, Users } from "lucide-react";

export default function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  canCreate,
  form,
  onFormChange,
  onCreateProject,
  isBusy,
}) {
  return (
    <section className="panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2 className="mt-1 text-lg font-black text-olive-900 dark:text-olive-50">Projects</h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-olive-700 text-white">
          <Folder size={19} />
        </div>
      </div>

      {canCreate && (
        <form onSubmit={onCreateProject} className="mt-5 space-y-3 rounded-lg border border-olive-100 bg-olive-50 p-3 dark:border-olive-700 dark:bg-olive-800">
          <input
            className="field"
            placeholder="Project name"
            value={form.name}
            onChange={(e) => onFormChange({ ...form, name: e.target.value })}
            required
          />
          <textarea
            className="field min-h-24 resize-none"
            placeholder="Short description"
            value={form.description}
            onChange={(e) => onFormChange({ ...form, description: e.target.value })}
          />
          <button className="primary-btn w-full" disabled={isBusy}>
            <Plus size={18} />
            Create project
          </button>
        </form>
      )}

      <div className="mt-5 space-y-3">
        {projects.length === 0 && (
          <div className="rounded-lg border border-dashed border-olive-200 p-5 text-sm text-olive-700 dark:border-olive-700 dark:text-olive-200">
            No projects yet.
          </div>
        )}

        {projects.map((project) => {
          const active = project.id === selectedProjectId;
          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onSelectProject(project.id)}
              className={`w-full rounded-lg border p-4 text-left transition ${
                active
                  ? "border-olive-500 bg-olive-50 shadow-sm dark:bg-olive-800"
                  : "border-olive-100 bg-white hover:border-olive-200 hover:bg-olive-50 dark:border-olive-700 dark:bg-olive-900 dark:hover:bg-olive-800"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-bold text-olive-900 dark:text-olive-50">{project.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-olive-700 dark:text-olive-200">
                    {project.description || "No description added."}
                  </p>
                </div>
                <span className="rounded-md bg-white px-2 py-1 text-xs font-bold capitalize text-olive-700 ring-1 ring-olive-100 dark:bg-olive-800 dark:text-olive-100 dark:ring-olive-700">
                  {project.my_role || "member"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-olive-700 dark:text-olive-200">
                <Users size={15} />
                Manage team and tasks
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
