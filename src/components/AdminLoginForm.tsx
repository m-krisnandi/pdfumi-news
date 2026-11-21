"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, KeyRound, Loader2, AlertCircle, ShieldAlert } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.refresh();
      } else {
        setError(data.error || "Kata sandi admin tidak valid");
      }
    } catch {
      setError("Gagal menghubungi server verifikasi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold text-zinc-600 dark:text-zinc-400">
            <ShieldAlert className="h-3 w-3 text-amber-500" />
            <span>Akses Terbatas Redaksi</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Admin Intelligence Hub
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Masukkan kunci autentikasi editorial untuk membuka analitik tayangan dan kontrol harvester otomatis.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="admin-passphrase"
              className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Kunci Rahasia Redaksi
            </label>
            <div className="relative">
              <input
                id="admin-passphrase"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500 transition pl-10"
              />
              <KeyRound className="h-4 w-4 text-zinc-400 absolute left-3.5 top-3" />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <span>Buka Dashboard Admin</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-zinc-400">
          Area ini dienkripsi dan hanya dapat diakses oleh administrator sistem.
        </p>
      </div>
    </div>
  );
}
