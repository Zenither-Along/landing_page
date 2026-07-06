"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    router.push(`/${process.env.NEXT_PUBLIC_ADMIN_PATH ?? "mrizo-studio-x7"}/dashboard`);
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-[340px] flex flex-col items-center gap-6">
        {/* Logo area */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <span className="text-white font-black text-xl tracking-[0.35em]">MRIZO</span>
          <span className="text-white/40 text-[10px] tracking-[0.5em]">STUDIO</span>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 text-white text-[13px] px-4 py-3 rounded-[6px] outline-none focus:border-white/30 placeholder:text-white/20 transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/5 border border-white/10 text-white text-[13px] px-4 py-3 rounded-[6px] outline-none focus:border-white/30 placeholder:text-white/20 transition-colors"
          />
          {error && (
            <p className="text-red-400 text-[11px] text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold text-[12px] tracking-[0.2em] py-3 rounded-[6px] mt-1 hover:bg-white/90 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </main>
  );
}
