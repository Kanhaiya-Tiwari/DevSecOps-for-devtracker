import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

export default function RegisterPage({ onSubmit, onSwitch, loading, error, theme }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={`relative min-h-screen grid place-items-center px-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-[#030712]' : 'bg-slate-50'}`}>
      <div className="glass-card relative w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-white/5 overflow-hidden slide-up">
        <h1 className="text-3xl font-black text-white tracking-tight">Create Identity</h1>
        <p className="mt-1 text-slate-400 font-medium">Join the elite performance network.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ name, email, password });
          }}
        >
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button className="w-full" disabled={loading}>{loading ? "Creating..." : "Create Account"}</Button>
        </form>

        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}

        <button type="button" onClick={onSwitch} className="mt-4 text-sm text-violet-300 hover:text-violet-200">
          Already have account? Login
        </button>
      </div>
    </div>
  );
}
