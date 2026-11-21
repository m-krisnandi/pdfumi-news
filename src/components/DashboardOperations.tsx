"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send, Loader2, CheckCircle2, LogOut, Zap } from "lucide-react";

export function DashboardOperations({
  runHarvestText,
  publishDueText,
}: {
  runHarvestText: string;
  publishDueText: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAction = async (action: "harvest" | "publish" | "instant") => {
    setLoading(action);
    setFeedback(null);

    try {
      let url = "/api/cron/publish?key=pdfumi-news-secure-cron-2026";
      if (action === "harvest") {
        url += "&harvest=true";
      } else if (action === "publish") {
        url += "&force=true";
      } else if (action === "instant") {
        url += "&harvest=true&publishNow=true";
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        if (action === "harvest") {
          setFeedback(
            `Berhasil: Topik riset baru disintesis dan masuk antrean: ${data.harvestedArticle || "Queue updated"} (Total antrean: ${data.scheduledCount})`
          );
        } else if (action === "publish") {
          setFeedback(
            data.result?.publishedCount > 0
              ? `Berhasil: ${data.result.publishedCount} artikel antrean berhasil diterbitkan dan langsung tayang publik!`
              : "Semua artikel sudah dalam status terbit (tidak ada antrean tertunda)."
          );
        } else if (action === "instant") {
          setFeedback(
            `Berhasil: Berita baru (${data.harvestedArticle}) langsung diriset, diverifikasi, dan diterbitkan!`
          );
        }
        router.refresh();
      } else {
        setFeedback(`Gagal: ${data.error || "Gagal menghubungi API"}`);
      }
    } catch (err) {
      setFeedback(`Koneksi terputus: ${String(err)}`);
    } finally {
      setLoading(null);
    }
  };

  const handleLogout = async () => {
    setLoading("logout");
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      router.refresh();
    } catch {
      // Ignore
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => handleAction("instant")}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          title="Riset berita baru dan langsung terbitkan ke publik seketika"
        >
          {loading === "instant" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Zap className="h-3.5 w-3.5" />
          )}
          <span>Auto-Harvest & Terbitkan Langsung</span>
        </button>

        <button
          onClick={() => handleAction("harvest")}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          title="Riset berita baru dan jadwalkan ke antrean slot rilis"
        >
          {loading === "harvest" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          <span>{runHarvestText}</span>
        </button>

        <button
          onClick={() => handleAction("publish")}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
          title="Rilis paksa semua artikel yang ada di antrean rilis sekarang juga"
        >
          {loading === "publish" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span>{publishDueText} (Paksa Terbit)</span>
        </button>

        <button
          onClick={handleLogout}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-rose-500/10 hover:text-rose-600 text-zinc-500 font-semibold text-xs transition disabled:opacity-50 cursor-pointer"
          title="Keluar dari sesi Admin"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {feedback && (
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-medium animate-fadeIn max-w-2xl">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-500" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
}
