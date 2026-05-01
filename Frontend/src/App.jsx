import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

function applyTheme(nextTheme) {
  const theme = nextTheme === "dark" ? "dark" : "light";
  const root = document.documentElement;

  root.classList.remove("light", "dark");
  root.classList.add(theme);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  localStorage.setItem("ttm_theme", theme);
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("ttm_theme");
    const initialTheme = stored === "dark" || stored === "light" ? stored : "light";
    applyTheme(initialTheme);
    return initialTheme;
  });

  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem("ttm_session");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function changeTheme(nextTheme) {
    const themeName = nextTheme === "dark" ? "dark" : "light";
    applyTheme(themeName);
    setTheme(themeName);
  }

  function saveSession(data) {
    localStorage.setItem("ttm_session", JSON.stringify(data));
    setSession(data);
  }

  function logout() {
    localStorage.removeItem("ttm_session");
    setSession(null);
  }

  if (!session) {
    return (
      <AuthPage
        onAuthed={saveSession}
        theme={theme}
        changeTheme={changeTheme}
      />
    );
  }

  return (
    <DashboardPage
      session={session}
      logout={logout}
      theme={theme}
      changeTheme={changeTheme}
    />
  );
}
