import { Home, Target, BarChart2, MessageSquare, Award, Settings } from "lucide-react";

export default function BottomNav({ view, setView }) {
  const tabs = [
    { id: "dashboard",   label: "Home",      icon: <Home className="w-5 h-5" /> },
    { id: "skill",       label: "Skills",    icon: <Target className="w-5 h-5" /> },
    { id: "blog",        label: "Community", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "leaderboard", label: "Ranking",   icon: <Award className="w-5 h-5" /> },
    { id: "chat",        label: "AI",        icon: <Sparkles className="w-5 h-5" /> },
    { id: "analytics",   label: "Stats",     icon: <BarChart2 className="w-5 h-5" /> },
    { id: "rewards",     label: "XP",        icon: <Zap className="w-5 h-5" /> },
    { id: "settings",    label: "User",      icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-900/90 backdrop-blur-2xl border-t border-white/10 px-4 py-2 pb-safe">
      <div className="flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 shrink-0 transition-all duration-200 ${
              view === tab.id ? "text-sky-400 scale-110" : "text-slate-500"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${view === tab.id ? "bg-sky-500/20 shadow-lg shadow-sky-500/20" : ""}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
