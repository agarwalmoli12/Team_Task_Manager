import { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import StatCard from "../components/common/StatCard";
import ProjectList from "../components/projects/ProjectList";
import TaskBoard from "../components/tasks/TaskBoard";
import { apiRequest, toApiDateTime } from "../api";
import {
  AlertTriangle,
  CheckCircle2,
  FolderKanban,
  ListChecks,
  Loader2,
  UserPlus,
  UsersRound,
} from "lucide-react";

const emptyProjectForm = { name: "", description: "" };
const emptyTaskForm = {
  title: "",
  description: "",
  assignee_email: "",
  due_date: "",
};
const emptyMemberForm = { email: "", role: "member" };

function normalizeEmail(value) {
  return value.trim().toLowerCase();
}

export default function DashboardPage({ session, logout, theme, changeTheme }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [dashboard, setDashboard] = useState({});
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState(emptyProjectForm);
  const [taskForm, setTaskForm] = useState(emptyTaskForm);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const token = session.access_token;
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0];
  const activeProjectId = selectedProject?.id || null;
  const isAccountAdmin = session.user.role === "admin";
  const isProjectAdmin = selectedProject?.my_role === "admin";
  const normalizedSearch = search.trim().toLowerCase();
  const filteredProjects = normalizedSearch
    ? projects.filter((project) =>
        [project.name, project.description, project.my_role]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedSearch))
      )
    : projects;
  const searchedTasks = normalizedSearch
    ? tasks.filter((task) =>
        [task.title, task.description, task.status, task.assignee_id ? `user #${task.assignee_id}` : ""]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(normalizedSearch))
      )
    : tasks;
  const visibleTasks =
    statusFilter === "all"
      ? searchedTasks
      : searchedTasks.filter((task) => task.status === statusFilter);
  const overdueTasks = tasks.filter(
    (task) => task.due_date && new Date(task.due_date) < new Date() && task.status !== "done"
  );

  function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function loadTasks(projectId) {
    if (!projectId) {
      setTasks([]);
      return;
    }

    const taskData = await apiRequest(`/projects/${projectId}/tasks/`, { token });
    setTasks(taskData);
  }

  async function loadMembers(projectId, projectRole = selectedProject?.my_role) {
    if (!projectId || projectRole !== "admin") {
      setMembers([]);
      return;
    }

    const memberData = await apiRequest(`/projects/${projectId}/members`, { token });
    setMembers(memberData);
  }

  async function loadData(preferredProjectId = selectedProjectId) {
    setError("");
    const projectData = await apiRequest("/projects/", { token });
    const dashboardData = await apiRequest("/dashboard/", { token });
    const nextProject =
      projectData.find((project) => project.id === preferredProjectId) || projectData[0];

    setProjects(projectData);
    setDashboard(dashboardData);
    setSelectedProjectId(nextProject?.id || null);

    if (nextProject) {
      await loadTasks(nextProject.id);
      await loadMembers(nextProject.id, nextProject.my_role);
    } else {
      setTasks([]);
      setMembers([]);
    }
  }

  async function runAction(action, successMessage) {
    setError("");
    setNotice("");
    setIsBusy(true);

    try {
      await action();
      if (successMessage) setNotice(successMessage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleSelectProject(projectId) {
    const project = projects.find((item) => item.id === projectId);
    setSelectedProjectId(projectId);
    setError("");
    setNotice("");
    await runAction(async () => {
      await loadTasks(projectId);
      await loadMembers(projectId, project?.my_role);
    });
    scrollToSection("team");
  }

  async function handleCreateProject(e) {
    e.preventDefault();
    await runAction(async () => {
      const project = await apiRequest("/projects/", {
        method: "POST",
        token,
        body: projectForm,
      });
      setProjectForm(emptyProjectForm);
      await loadData(project.id);
    }, "Project created.");
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    if (!activeProjectId) return;

    const assigneeEmail = normalizeEmail(taskForm.assignee_email);
    if (assigneeEmail && isProjectAdmin) {
      const isProjectMember = members.some((member) => normalizeEmail(member.email) === assigneeEmail);
      if (!isProjectMember) {
        setNotice("");
        setError("Assignee must already be added as a member of this project.");
        scrollToSection("team");
        return;
      }
    }

    await runAction(async () => {
      await apiRequest(`/projects/${activeProjectId}/tasks/`, {
        method: "POST",
        token,
        body: {
          ...taskForm,
          assignee_email: assigneeEmail || null,
          due_date: toApiDateTime(taskForm.due_date),
        },
      });
      setTaskForm(emptyTaskForm);
      await loadTasks(activeProjectId);
      const dashboardData = await apiRequest("/dashboard/", { token });
      setDashboard(dashboardData);
    }, "Task created.");
  }

  async function handleStatusChange(taskId, status) {
    if (!activeProjectId) return;

    await runAction(async () => {
      await apiRequest(`/projects/${activeProjectId}/tasks/${taskId}`, {
        method: "PATCH",
        token,
        body: { status },
      });
      await loadTasks(activeProjectId);
      const dashboardData = await apiRequest("/dashboard/", { token });
      setDashboard(dashboardData);
    }, "Task status updated.");
  }

  async function handleDeleteTask(taskId) {
    if (!activeProjectId) return;

    await runAction(async () => {
      await apiRequest(`/projects/${activeProjectId}/tasks/${taskId}`, {
        method: "DELETE",
        token,
      });
      await loadTasks(activeProjectId);
      const dashboardData = await apiRequest("/dashboard/", { token });
      setDashboard(dashboardData);
    }, "Task deleted.");
  }

  async function handleAddMember(e) {
    e.preventDefault();
    if (!activeProjectId) return;

    const email = normalizeEmail(memberForm.email);
    if (members.some((member) => normalizeEmail(member.email) === email)) {
      setNotice("");
      setError("This user is already a member of the selected project.");
      return;
    }

    await runAction(async () => {
      await apiRequest(`/projects/${activeProjectId}/members`, {
        method: "POST",
        token,
        body: { ...memberForm, email },
      });
      setMemberForm(emptyMemberForm);
      await loadMembers(activeProjectId, selectedProject?.my_role);
    }, "Team member added.");
  }

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        await loadData();
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-olive-50 dark:bg-[#171d12]">
      <Sidebar
        logout={logout}
        user={session.user}
        onNavigate={(section) => scrollToSection(section)}
      />

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-olive-900/70 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="h-full w-72" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              logout={logout}
              user={session.user}
              mobile
              onClose={() => setMobileMenuOpen(false)}
              onNavigate={(section) => scrollToSection(section)}
            />
          </div>
        </div>
      )}

      <main id="dashboard" className="min-w-0 flex-1 p-4 sm:p-6">
        <Header
          user={session.user}
          theme={theme}
          changeTheme={changeTheme}
          search={search}
          onSearch={setSearch}
          onOpenMenu={() => setMobileMenuOpen(true)}
          onToggleNotifications={() => setNotificationsOpen((open) => !open)}
          notificationsOpen={notificationsOpen}
          notificationCount={overdueTasks.length}
        />

        <label className="mt-4 flex items-center gap-2 rounded-lg border border-olive-100 bg-white px-3 py-2 text-sm text-olive-700 dark:border-olive-700 dark:bg-olive-900 dark:text-olive-200 md:hidden">
          Search
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-olive-500 dark:placeholder:text-olive-300"
            placeholder="Projects and tasks"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="font-bold">
              Clear
            </button>
          )}
        </label>

        {notificationsOpen && (
          <section className="mt-4 rounded-lg border border-olive-100 bg-white p-4 shadow-sm dark:border-olive-800 dark:bg-olive-900">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-black text-olive-900 dark:text-olive-50">Notifications</h2>
              <button
                type="button"
                onClick={() => setNotificationsOpen(false)}
                className="text-sm font-bold text-olive-700 dark:text-olive-200"
              >
                Close
              </button>
            </div>
            <div className="mt-3 space-y-2 text-sm text-olive-700 dark:text-olive-200">
              {overdueTasks.length === 0 ? (
                <p>No overdue tasks right now.</p>
              ) : (
                overdueTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => {
                      setStatusFilter("all");
                      setNotificationsOpen(false);
                      scrollToSection("tasks");
                    }}
                    className="block w-full rounded-md bg-red-50 px-3 py-2 text-left font-semibold text-red-700 transition hover:bg-red-100 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900"
                  >
                    {task.title} is overdue.
                  </button>
                ))
              )}
            </div>
          </section>
        )}

        {(error || notice) && (
          <div
            className={`mt-5 rounded-lg border px-4 py-3 text-sm font-semibold ${
              error
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500 dark:bg-red-950 dark:text-red-100"
                : "border-olive-200 bg-olive-50 text-olive-800 dark:border-olive-700 dark:bg-olive-900 dark:text-olive-100"
            }`}
          >
            {error || notice}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Projects"
            value={dashboard.total_projects}
            icon={FolderKanban}
            tone="medium"
            helper="Workspaces you can access"
            onClick={() => {
              setStatusFilter("all");
              scrollToSection("projects");
            }}
          />
          <StatCard
            label="Tasks"
            value={dashboard.total_tasks}
            icon={ListChecks}
            tone="olive"
            helper={`${dashboard.todo || 0} todo, ${dashboard.in_progress || 0} active`}
            active={statusFilter === "all"}
            onClick={() => {
              setStatusFilter("all");
              scrollToSection("tasks");
            }}
          />
          <StatCard
            label="Done"
            value={dashboard.done}
            icon={CheckCircle2}
            tone="deep"
            helper="Completed work"
            active={statusFilter === "done"}
            onClick={() => {
              setStatusFilter("done");
              scrollToSection("tasks");
            }}
          />
          <StatCard
            label="Overdue"
            value={dashboard.overdue}
            icon={AlertTriangle}
            tone="red"
            helper="Needs attention"
            onClick={() => {
              setStatusFilter("all");
              setNotificationsOpen(true);
              scrollToSection("tasks");
            }}
          />
        </div>

        {isLoading ? (
          <div className="mt-8 flex min-h-64 items-center justify-center rounded-lg border border-olive-100 bg-white dark:border-olive-800 dark:bg-olive-900">
            <Loader2 className="animate-spin text-olive-700 dark:text-olive-200" size={28} />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <div id="projects">
              <ProjectList
                projects={filteredProjects}
                selectedProjectId={activeProjectId}
                onSelectProject={handleSelectProject}
                canCreate={isAccountAdmin}
                form={projectForm}
                onFormChange={setProjectForm}
                onCreateProject={handleCreateProject}
                isBusy={isBusy}
              />
            </div>

            <div id="team" className="min-w-0 space-y-6">
              <section className="panel">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="eyebrow">Current project</p>
                    <h2 className="mt-1 text-2xl font-black text-olive-900 dark:text-olive-50">
                      {selectedProject?.name || "No project selected"}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-olive-700 dark:text-olive-200">
                      {selectedProject?.description ||
                        "Create or select a project to manage tasks and members."}
                    </p>
                  </div>
                  {selectedProject && (
                    <span className="w-fit rounded-md bg-olive-50 px-3 py-2 text-xs font-bold capitalize text-olive-800 ring-1 ring-olive-100 dark:bg-olive-800 dark:text-olive-100 dark:ring-olive-700">
                      Your role: {selectedProject.my_role || "member"}
                    </span>
                  )}
                </div>
              </section>

              {selectedProject && isProjectAdmin && (
                <section className="panel">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="eyebrow">Team management</p>
                      <h2 className="mt-1 text-lg font-black text-olive-900 dark:text-olive-50">Members</h2>
                    </div>
                    <UsersRound className="text-olive-700 dark:text-olive-200" size={22} />
                  </div>

                  <form onSubmit={handleAddMember} className="mt-5 grid gap-3 md:grid-cols-[1fr_160px_auto]">
                    <input
                      className="field"
                      type="email"
                      placeholder="member@example.com"
                      value={memberForm.email}
                      onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                      required
                    />
                    <select
                      className="field"
                      value={memberForm.role}
                      onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button className="primary-btn" disabled={isBusy}>
                      <UserPlus size={18} />
                      Add
                    </button>
                  </form>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    {members.length === 0 && (
                      <p className="rounded-lg border border-dashed border-olive-200 p-4 text-sm text-olive-700 dark:border-olive-700 dark:text-olive-200">
                        No team members loaded.
                      </p>
                    )}

                    {members.map((member) => (
                      <div key={member.user_id} className="rounded-lg border border-olive-100 bg-olive-50 p-4 dark:border-olive-700 dark:bg-olive-800">
                        <p className="font-bold text-olive-900 dark:text-olive-50">{member.name}</p>
                        <p className="mt-1 text-sm text-olive-700 dark:text-olive-200">{member.email}</p>
                        <span className="mt-3 inline-flex rounded-md bg-white px-2 py-1 text-xs font-bold capitalize text-olive-700 ring-1 ring-olive-100 dark:bg-olive-900 dark:text-olive-100 dark:ring-olive-700">
                          {member.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <div id="tasks">
                <TaskBoard
                  tasks={visibleTasks}
                  canCreate={isAccountAdmin && Boolean(selectedProject)}
                  taskForm={taskForm}
                  onTaskFormChange={setTaskForm}
                  onCreateTask={handleCreateTask}
                  onStatusChange={handleStatusChange}
                  onDeleteTask={handleDeleteTask}
                  isBusy={isBusy}
                  canDelete={isAccountAdmin}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
