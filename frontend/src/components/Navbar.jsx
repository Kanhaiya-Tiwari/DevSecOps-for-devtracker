import NotificationCenter from "./NotificationCenter";

export default function Navbar({ user, view, setView, onLogout, theme }) {
  const tabs = [
    { id: "dashboard",   label: "Dashboard",   emoji: "🏠" },
    { id: "skill",       label: "Skills",       emoji: "🎯" },
    { id: "analytics",   label: "Analytics",    emoji: "📊" },
    { id: "chat",        label: "AI Coach",     emoji: "🤖" },
    { id: "blog",        label: "Community",   emoji: "📝" },
    { id: "rewards",     label: "Rewards",     emoji: "🎁" },
    { id: "leaderboard", label: "Leaderboard",  emoji: "🏆" },
    { id: "settings",    label: "Settings",     emoji: "⚙️" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#030712]/60 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        {/* Animated Brand Logo */}
        <div className="flex items-center gap-3 mr-6 shrink-0 group cursor-pointer" onClick={() => setView("dashboard")}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 via-blue-600 to-violet-600 flex items-center justify-center text-lg font-black text-white shadow-xl shadow-sky-500/20 group-hover:rotate-6 transition-transform duration-300">D</div>
          <span className="font-black text-white text-xl tracking-tighter">Dev<span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">Trackr</span></span>
        </div>

        {/* Colorful Animated Nav */}
        <nav className="hidden lg:flex gap-1.5 overflow-x-auto flex-1 h-12 items-center">
          {tabs.map((t) => (
            <button 
              key={t.id} 
              onClick={() => setView(t.id)}
              className={`relative rounded-xl px-4 py-2 text-sm font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-2 group ${
                view === t.id 
                  ? "bg-white/10 text-white shadow-lg" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={`text-lg transition-transform duration-300 group-hover:scale-125 ${view === t.id ? "scale-110" : ""}`}>{t.emoji}</span>
              <span className="tracking-wide">{t.label}</span>
              {view === t.id && (
                <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-sky-400 to-violet-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="lg:hidden flex-1" />

        <div className="flex items-center gap-3 shrink-0">
          {user && (
            <div className="flex items-center gap-3">
              <NotificationCenter />
              <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5">
                <span className="text-sm">🔥</span>
                <span className="text-xs font-black text-amber-400 uppercase tracking-tighter">{user.streak || 0} Days</span>
              </div>
              
              <div className="w-9 h-9 rounded-xl p-[1px] bg-gradient-to-br from-sky-400 via-blue-500 to-violet-600 hidden sm:block">
                <div className="w-full h-full rounded-[11px] bg-slate-900 flex items-center justify-center text-sm font-black text-white">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          )}

          <button 
            onClick={onLogout} 
            className="rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-4 py-2 text-xs font-black text-white hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-rose-900/20"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  );
}
