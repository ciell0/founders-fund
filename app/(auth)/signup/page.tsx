// app/(auth)/signup/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, isMockMode } from "@/lib/supabase";
import { TrendingUp, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      setLoading(false);
      return;
    }

    const { data, error: signupError } = await signUp(email, password);

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="w-full max-w-md space-y-8 relative">
        {/* Glow effect */}
        <div className="absolute -top-16 -left-16 h-72 w-72 rounded-full bg-violet-600/10 blur-[80px] animate-pulse-glow" />

        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            FoundersFund
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Daftar akun baru untuk rintisan startup-mu
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="mb-4 rounded-lg bg-rose-500/15 border border-rose-500/30 p-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-3 text-sm text-emerald-400">
              Registrasi sukses! Mengalihkan ke dashboard...
            </div>
          )}

          {isMockMode() && (
            <div className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-xs text-amber-300 text-center">
              ⚠️ Mode Demo Offline: Data disimpan di browser lokal (localStorage).
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Email
              </label>
              <div className="mt-1.5 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="name@startup.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="mt-1.5 relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-3 text-sm text-zinc-100 placeholder-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">Minimal 6 karakter</p>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mendaftarkan...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-zinc-500">Sudah punya akun? </span>
            <Link
              href="/login"
              className="font-medium text-violet-400 hover:text-violet-300 hover:underline"
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
