import { useMemo, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import SkillDetailPage from "./pages/SkillDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AIChatPage from "./pages/AIChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SettingsPage from "./pages/SettingsPage";
import BlogPage from "./pages/BlogPage";
import RewardSection from "./components/RewardSection";
import BottomNav from "./components/BottomNav";
import { useAuth } from "./hooks/useAuth";
import { useDevtrackrData } from "./hooks/useDevtrackrData";
import { NotificationProvider } from "./contexts/NotificationContext";

function AppContent() {
  const { token, user, loading: authLoading, login, register, logout } = useAuth();
  const [authView, setAuthView] = useState("login");
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [view, setView] = useState("dashboard");
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("devtrackr_theme") || "dark";
    }
    return "dark";
  });
  const [addSkillBusy, setAddSkillBusy] = useState(false);
  const [insightBusy, setInsightBusy] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    document.documentElement.classList.toggle("theme-light", theme === "light");
    localStorage.setItem("devtrackr_theme", theme);
  }, [theme]);

  // Handle welcome animation
  useEffect(() => {
    if (user && !sessionStorage.getItem("welcome_shown")) {
      setShowWelcome(true);
      sessionStorage.setItem("welcome_shown", "true");
      const timer = setTimeout(() => setShowWelcome(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  const {
    loading,
    error,
    skills,
    logsBySkill,
    selectedSkill,
    selectedLogs,
    selectedSkillId,
    setSelectedSkillId,
    allLogs,
    summary,
    insight,
    addSkill,
    addLog,
    refreshInsight,
  } = useDevtrackrData(token);

  async function onLogin(form) {
    setAuthBusy(true);
    setAuthError("");
    try {
      await login(form.email, form.password);
    } catch (e) {
      setAuthError(e.message || "Login failed");
    } finally {
      setAuthBusy(false);
    }
  }

  async function onRegister(form) {
    setAuthBusy(true);
    setAuthError("");
    try {
      await register(form);
    } catch (e) {
      setAuthError(e.message || "Registration failed");
    } finally {
      setAuthBusy(false);
    }
  }

  async function onAddSkill(payload) {
    setAddSkillBusy(true);
    try {
      await addSkill(payload);
    } finally {
      setAddSkillBusy(false);
    }
  }

  async function onQuickLog(skillId, amount = 1, quality = "medium", notes = "Quick log", logDate = null) {
    return await addLog({
      skill_id: skillId,
      hours: Number(amount),
      quality: quality,
      notes: notes,
      log_date: logDate,
    });
  }

  async function onRefreshInsight() {
    setInsightBusy(true);
    try {
      await refreshInsight();
    } finally {
      setInsightBusy(false);
    }
  }

  const content = useMemo(() => {
    if (view === "dashboard") {
      return (
        <DashboardPage
          skills={skills}
          logsBySkill={logsBySkill}
          selectedSkillId={selectedSkillId}
          setSelectedSkillId={setSelectedSkillId}
          setView={setView}
          summary={summary}
          insight={insight}
          onRefreshInsight={onRefreshInsight}
          onAddSkill={onAddSkill}
          addSkillLoading={addSkillBusy}
          insightLoading={insightBusy}
          token={token}
        />
      );
    }

    if (view === "skill") {
      return (
        <SkillDetailPage
          skill={selectedSkill}
          logs={selectedLogs}
          insight={insight}
          onLog={onQuickLog}
          onRefreshInsight={onRefreshInsight}
          insightLoading={insightBusy}
          token={token}
        />
      );
    }

    if (view === "analytics") {
      return <AnalyticsPage logs={allLogs} />;
    }

    if (view === "chat") {
      return <AIChatPage skill={selectedSkill} insight={insight} token={token} />;
    }

    if (view === "leaderboard") {
      return <LeaderboardPage token={token} />;
    }

    if (view === "settings") {
      return <SettingsPage token={token} user={user} onUserUpdate={() => {}} />;
    }

    if (view === "blog") {
      return <BlogPage token={token} user={user} />;
    }

    if (view === "rewards") {
      return <RewardSection user={user} summary={summary} token={token} setUser={setUser} />;
    }

    return <AIChatPage skill={selectedSkill} insight={insight} token={token} />;
  }, [
    view,
    skills,
    logsBySkill,
    selectedSkillId,
    setSelectedSkillId,
    summary,
    insight,
    addSkillBusy,
    insightBusy,
    selectedSkill,
    selectedLogs,
    allLogs,
    user,
    token,
  ]);

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center text-slate-300">Loading...</div>;
  }

  if (!user) {
    if (authView === "login") {
      return (
        <LoginPage
          onSubmit={onLogin}
          onSwitch={() => setAuthView("register")}
          loading={authBusy}
          error={authError}
        />
      );
    }

    return (
      <RegisterPage
        onSubmit={onRegister}
        onSwitch={() => setAuthView("login")}
        loading={authBusy}
        error={authError}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-page text-primary">
      {theme === "dark" && (
        <>
          <div className="float-soft absolute -top-20 left-0 h-96 w-96 rounded-full bg-sky-500/8 blur-3xl" />
          <div className="float-soft absolute top-1/2 right-0 h-80 w-80 rounded-full bg-pink-500/6 blur-3xl" />
          <div className="float-soft absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-violet-500/6 blur-3xl" />
        </>
      )}
      <Navbar user={user} view={view} setView={setView} onLogout={logout} theme={theme} onToggleTheme={toggleTheme} />
      <div className="relative mx-auto flex max-w-7xl gap-4 px-4 py-4 mb-20 md:mb-0">
        <Sidebar view={view} setView={setView} user={user} />
        <main className="min-w-0 flex-1 space-y-4">
          {loading ? <div className="rounded-xl border border-slate-200/20 bg-surface-strong p-4 text-primary">Loading workspace...</div> : null}
          {error ? <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-rose-800">{error}</div> : null}
          {content}
        </main>
      </div>
      <BottomNav view={view} setView={setView} />

      {/* Welcome Overlay */}
      {showWelcome && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030712]/90 backdrop-blur-2xl animate-fade-in">
          <div className="text-center space-y-6 slide-up">
            <div className="relative mx-auto w-32 h-32 animate-bounce-soft">
              <div className="absolute inset-0 bg-sky-500 blur-3xl opacity-20 animate-pulse" />
              <div className="relative w-32 h-32 rounded-[2rem] bg-gradient-to-br from-sky-400 via-blue-600 to-violet-600 flex items-center justify-center shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                <span className="text-6xl font-black text-white group-hover:scale-110 transition-transform duration-500">S</span>
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                Welcome to <span className="gradient-text">Skill Enhance</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium">Hello, {user?.name}! Your journey to greatness continues.</p>
            </div>
            <div className="flex justify-center gap-4 pt-4">
              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-sky-400 uppercase tracking-widest animate-pulse">Level {user?.level || 1}</div>
              <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-violet-400 uppercase tracking-widest animate-pulse">Streak {user?.streak || 0}d</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppShell() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}
