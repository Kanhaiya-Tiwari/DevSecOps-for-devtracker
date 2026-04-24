import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Globe, ShieldCheck, Sparkles, Zap } from "lucide-react";

export default function LoginPage({ onSubmit, onSwitch, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [lang, setLang] = useState("en");

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-[#030712] text-primary overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-violet-600/10 blur-[120px] orb-move" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-sky-500/10 blur-[120px] orb-move" style={{ animationDelay: '-4s' }} />
      <div className="absolute top-[30%] left-[20%] h-[30%] w-[30%] rounded-full bg-pink-500/5 blur-[100px] animate-pulse" />

      <div className="glass-card relative w-full max-w-lg rounded-[2rem] p-8 shadow-2xl border border-white/5 overflow-hidden slide-up">
        {/* Subtle Gradient Line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-violet-500 opacity-50" />
        
        <div className="flex justify-between items-start mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 cursor-pointer hover:bg-white/10 transition">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-[11px] font-bold uppercase tracking-widest text-slate-300 outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900">English</option>
              <option value="hi" className="bg-slate-900">Hindi</option>
              <option value="es" className="bg-slate-900">Spanish</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {lang === 'hi' ? 'नमस्ते वापस' : lang === 'es' ? 'Bienvenido de nuevo' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 font-medium">Continue your journey to mastery.</p>
        </div>

        <form
          className="mt-8 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ email, password });
          }}
        >
          <div className="space-y-4">
            <Input 
              label="Professional Email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="name@company.com"
              className="bg-white/5 border-white/10"
            />
            <Input 
              label="Security Key" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className="bg-white/5 border-white/10"
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition">
              <input type="checkbox" className="rounded border-white/10 bg-white/5 accent-sky-500" />
              Remember device
            </label>
            <button type="button" className="text-sky-400 hover:text-sky-300 transition">Forgot Key?</button>
          </div>

          <Button 
            className="w-full py-4 text-base font-bold bg-gradient-to-r from-sky-600 to-violet-600 border-none shadow-xl shadow-sky-900/20 group relative overflow-hidden" 
            disabled={loading}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 transition-transform group-hover:scale-110" />
                  <span>Authorize Session</span>
                </>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 animate-slide-in">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <p className="text-sm text-rose-300 font-medium">{error}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
          <p className="text-center text-sm text-slate-500">
            Don't have an asset yet?
          </p>
          <button 
            type="button" 
            onClick={onSwitch} 
            className="group flex items-center justify-center gap-2 text-white font-bold transition-all hover:gap-3"
          >
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              Create New Identity
            </span>
            <Zap className="w-4 h-4 text-violet-400 group-hover:text-sky-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 text-center text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.4em]">
        &copy; 2026 Skill Enhance • Security-First Architecture
      </div>
    </div>
  );
}

