"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send, Loader2, CheckCircle2 } from "lucide-react";

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

  const handleAction = async (action: "harvest" | "publish") => {
    setLoading(action);
    setFeedback(null);

    try {
      const url =
        action === "harvest"
          ? "/api/cron/publish?key=pdfumi-news-secure-cron-2026&harvest=true"
          : "/api/cron/publish?key=pdfumi-news-secure-cron-2026";

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setFeedback(
          action === "harvest"
            ? `Berhasil: Siklus riset & sintesis selesai. Artikel dijadwalkan: ${data.harvestedArticle || "Queue updated"}`
            : `Berhasil: ${data.result?.publishedCount || 0} artikel jatuh tempo diterbitkan.`
        );
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

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handleAction("harvest")}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {loading === "publish" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span>{publishDueText}</span>
        </button>
      </div>

      {feedback && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-300 text-xs font-medium animate-fadeIn">
          <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
          <span>{feedback}</span>
        </div>
      )}
    </div>
  );
}
