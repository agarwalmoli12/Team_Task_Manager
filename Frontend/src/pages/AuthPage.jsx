import { useState } from "react";
import { apiRequest } from "../api";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import ThemeToggle from "../components/common/ThemeToggle";

export default function AuthPage({ onAuthed, theme, changeTheme }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setIsBusy(true);

    try {
      const payload =
        mode === "signup"
          ? form
          : { email: form.email, password: form.password };

      const data = await apiRequest(`/auth/${mode}`, {
        method: "POST",
        body: payload,
      });

      onAuthed(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-olive-200 px-3 py-6 dark:bg-[#171d12] sm:px-6 sm:py-8">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-[1.5rem] border border-white/70 bg-white p-4 shadow-soft dark:border-olive-800 dark:bg-olive-900 sm:rounded-[1.75rem] sm:p-6 lg:p-7">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-olive-800 dark:text-olive-50">
            <FolderKanban size={18} />
            <span className="text-sm font-black tracking-wide">TASKIFY</span>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-black text-olive-900 dark:text-olive-100 lg:flex">
            <span>Opportunities</span>
            <span>Partners</span>
            <span>The blog</span>
            <span>Reviews</span>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle theme={theme} changeTheme={changeTheme} />
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`hidden rounded-lg px-4 py-2 text-xs font-black transition sm:block ${
                mode === "login"
                  ? "bg-olive-100 text-olive-900 dark:bg-olive-800 dark:text-olive-50"
                  : "text-olive-700 hover:bg-olive-50 dark:text-olive-200 dark:hover:bg-olive-800"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`hidden rounded-lg px-4 py-2 text-xs font-black transition sm:block ${
                mode === "signup"
                  ? "bg-olive-700 text-white"
                  : "bg-olive-800 text-white hover:bg-olive-900 dark:bg-olive-100 dark:text-olive-900"
              }`}
            >
              Registration
            </button>
          </div>
        </header>

        <section className="relative mt-8 grid items-center gap-8 lg:min-h-[560px] lg:grid-cols-[1fr_1fr]">
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="rounded-lg bg-olive-700 p-7 text-white shadow-soft dark:bg-olive-800">
              <p className="text-xs font-black">TASKIFY</p>
              <h1 className="mt-5 text-3xl font-black leading-tight">
                Team Task Management Service
              </h1>
              <div className="mt-5 h-1.5 w-24 rounded-full bg-white/80" />
              <div className="mt-6 grid gap-3">
                {[
                  { icon: FolderKanban, label: "Project planning" },
                  { icon: UsersRound, label: "Team assignments" },
                  { icon: Clock3, label: "Deadline visibility" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-lg bg-white/12 px-3 py-3 text-sm font-bold">
                    <Icon size={18} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 hidden grid-cols-3 gap-6 rounded-lg border border-olive-100 bg-olive-50 p-5 text-xs font-bold text-olive-900 dark:border-olive-700 dark:bg-olive-900 dark:text-olive-100 sm:grid">
              <div>
                <p className="font-black">Product</p>
                <p className="mt-2 text-olive-600 dark:text-olive-300">Roles</p>
                <p className="text-olive-600 dark:text-olive-300">Integrations</p>
              </div>
              <div>
                <p className="font-black">Resources</p>
                <p className="mt-2 text-olive-600 dark:text-olive-300">Dashboard</p>
                <p className="text-olive-600 dark:text-olive-300">Reports</p>
              </div>
              <div>
                <p className="font-black">For teams</p>
                <p className="mt-2 text-olive-600 dark:text-olive-300">Developers</p>
                <p className="text-olive-600 dark:text-olive-300">Managers</p>
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md rounded-lg bg-[#f0f1f3] p-5 shadow-soft dark:bg-[#202917] sm:p-8 lg:mx-0 lg:ml-2">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-white text-olive-700 shadow-sm dark:bg-olive-800 dark:text-olive-100">
                <Sparkles size={22} />
              </div>
              <h2 className="mt-4 text-3xl font-black text-olive-700 dark:text-olive-100">
                {mode === "login" ? "Log in" : "Sign up"}
              </h2>
            </div>

            <form onSubmit={submit} className="mt-7 space-y-4">
              {mode === "signup" && (
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-black text-olive-800 dark:text-olive-100">
                    <UserRound size={16} />
                    Name
                  </span>
                  <input
                    className="field"
                    placeholder="Alex Morgan"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-black text-olive-800 dark:text-olive-100">
                  <Mail size={16} />
                  Email
                </span>
                <input
                  className="field"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-black text-olive-800 dark:text-olive-100">
                  <LockKeyhole size={16} />
                  Password
                </span>
                <input
                  className="field"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </label>

              {mode === "signup" && (
                <label className="block">
                  <span className="mb-2 text-xs font-black text-olive-800 dark:text-olive-100">Role</span>
                  <select
                    className="field"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </label>
              )}

              {error && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-500/40 dark:bg-red-950 dark:text-red-100">
                  {error}
                </p>
              )}

              <button className="primary-btn w-full" disabled={isBusy}>
                {isBusy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
                {!isBusy && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[ShieldCheck, CheckCircle2, UsersRound].map((Icon, index) => (
                <div key={index} className="flex h-11 items-center justify-center rounded-lg bg-white text-olive-700 shadow-sm dark:bg-olive-800 dark:text-olive-100">
                  <Icon size={18} />
                </div>
              ))}
            </div>

            <button
              className="mt-5 w-full text-center text-sm font-bold text-olive-700 hover:text-olive-900 dark:text-olive-200 dark:hover:text-white"
              onClick={() => {
                setError("");
                setMode(mode === "login" ? "signup" : "login");
              }}
            >
              {mode === "login" ? "Need an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
