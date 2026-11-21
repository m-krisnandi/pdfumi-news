"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2, CheckCircle2, AlertCircle, LogOut, Zap } from "lucide-react";

export function DashboardOperations() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleHarvestAndPublish = async () => {
    setLoading("sync");
    setFeedback(null);

    try {
      const url = "/api/cron/publish?key=pdfumi-news-secure-cron-2026&harvest=true&publishNow=true";
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: "success",
          text: t("feedbackSuccess"),
        });
        router.refresh();
      } else {
        setFeedback({
          type: "error",
          text: `${t("feedbackError")}: ${data.error || ""}`,
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: `${t("feedbackError")}: ${String(err)}`,
      });
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
          onClick={handleHarvestAndPublish}
          disabled={loading !== null}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {loading === "sync" ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Zap className="h-3.5 w-3.5" />
          )}
          <span>{t("syncPublishBtn")}</span>
        </button>

        <button
          onClick={handleLogout}
          disabled={loading !== null}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-rose-500/10 hover:text-rose-600 text-zinc-500 font-semibold text-xs transition disabled:opacity-50 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{t("logoutBtn")}</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium animate-fadeIn max-w-2xl ${
            feedback.type === "success"
              ? "bg-teal-500/10 border-teal-500/20 text-teal-700 dark:text-teal-300"
              : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-500" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}
    </div>
  );
}
