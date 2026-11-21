import { getTranslations, setRequestLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { Locale } from "@/i18n/config";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";
import { CATEGORIES_META } from "@/domain/entities/article";
import { PUBLISHING_SLOTS } from "@/application/use-cases/publish-scheduler.usecase";
import { DashboardOperations } from "@/components/DashboardOperations";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { Link } from "@/i18n/navigation";
import {
  Eye,
  FileCheck2,
  Clock,
  Timer,
  ExternalLink,
  ShieldCheck,
  BookOpenCheck,
  Layers,
  Sparkles,
  ShieldAlert,
  Bot,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return {
    title: "Admin Operations & Analytics Hub — Pdfumi News",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Authentication Check
  const cookieStore = await cookies();
  const session = cookieStore.get("pdfumi_admin_session");
  const isAuthenticated = session?.value === "authenticated";

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const t = await getTranslations({ locale, namespace: "dashboard" });
  const articles = await articleRepository.getAllArticles();

  const published = articles.filter((a) => a.status === "published");
  const scheduled = articles.filter((a) => a.status === "scheduled");

  const totalViews = articles.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const totalReadingTime = published.reduce((acc, curr) => {
    const tr = curr.translations[locale as Locale] || curr.translations.en;
    return acc + (tr.readingTimeMinutes || 3);
  }, 0);
  const avgReadingTime = published.length > 0 ? (totalReadingTime / published.length).toFixed(1) : "3.5";

  // Calculate next scheduled slot today/tomorrow
  const now = new Date();
  const currentUTC = now.getUTCHours();
  const nextSlot =
    PUBLISHING_SLOTS.find((s) => s.hourUTC > currentUTC) || PUBLISHING_SLOTS[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Top Header & Operational Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>{t("restrictedAccessBadge")}</span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <DashboardOperations locale={locale} />
      </div>

      {/* Auto-Pilot Cron Status Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 text-xs text-zinc-700 dark:text-zinc-300">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <span>{t("autoCronTitle")}</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 text-[10px] font-extrabold">
                {t("autoCronStatus")}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              {t("autoCronDesc")}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">{t("totalViews")}</span>
            <div className="h-8 w-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {totalViews.toLocaleString()}
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-500 leading-normal">{t("totalViewsSub")}</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">{t("totalArticles")}</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {published.length}
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-500 leading-normal">{t("totalArticlesSub")}</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">{t("scheduledQueue")}</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Timer className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {scheduled.length}
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-500 leading-normal">{t("scheduledQueueSub")}</p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs">
          <div className="flex items-center justify-between text-zinc-500 mb-3">
            <span className="text-xs font-medium uppercase tracking-wider">{t("avgReadingTime")}</span>
            <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            {avgReadingTime} <span className="text-base font-normal text-zinc-500">min</span>
          </div>
          <p className="mt-1.5 text-[11px] text-zinc-500 leading-normal">{t("avgReadingTimeSub")}</p>
        </div>
      </div>

      {/* Automated Publishing Pipeline & Schedule Status */}
      <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-600" />
              <span>{t("pipelineTitle")}</span>
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl">
              {t("pipelineDesc")}
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-300 text-xs font-semibold self-start sm:self-auto">
            {t("nextSlotLabel")}: <span className="underline font-bold">{nextSlot.name} ({nextSlot.description})</span>
          </div>
        </div>

        {/* 5-Stage Transformation Architecture Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">Stage 1</span>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white mt-1">{t("stage1Title")}</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{t("stage1Desc")}</p>
          </div>

          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">Stage 2</span>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white mt-1">{t("stage2Title")}</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{t("stage2Desc")}</p>
          </div>

          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">Stage 3</span>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white mt-1">{t("stage3Title")}</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{t("stage3Desc")}</p>
          </div>

          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">Stage 4</span>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white mt-1">{t("stage4Title")}</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{t("stage4Desc")}</p>
          </div>

          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">Stage 5</span>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white mt-1">{t("stage5Title")}</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-snug">{t("stage5Desc")}</p>
          </div>
        </div>
      </div>

      {/* Content Performance & Verification Table */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-teal-600" />
            <span>{t("tableTitle")}</span>
          </h2>
          <span className="text-xs text-zinc-500 font-medium">
            {articles.length} {t("totalEntries")}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 font-semibold border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">{t("tableArticle")}</th>
                <th className="py-3 px-4">{t("tableCategory")}</th>
                <th className="py-3 px-4">{t("tableStatus")}</th>
                <th className="py-3 px-4 text-right">{t("tableViews")}</th>
                <th className="py-3 px-4">{t("tableSources")}</th>
                <th className="py-3 px-4 text-right">{t("tableActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {articles.map((art) => {
                const tr = art.translations[locale as Locale] || art.translations.en;
                const catMeta = CATEGORIES_META[art.category];
                const catName = catMeta ? catMeta.name[locale as Locale] || catMeta.name.en : art.category;
                const views = art.viewCount || 0;
                const sharePercent = totalViews > 0 ? ((views / totalViews) * 100).toFixed(0) : "0";

                return (
                  <tr key={art.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3.5 px-4 font-medium text-zinc-900 dark:text-white max-w-sm">
                      <div className="font-semibold line-clamp-1">{tr.title}</div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5">/{art.slug}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        {catName}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {art.status === "published" ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          <span>{t("publishedBadge")}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          <span>{t("scheduledBadge")}</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono font-bold text-xs">
                          <Eye className="h-3 w-3" />
                          <span>{views.toLocaleString()}</span>
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {sharePercent}% {t("ofTotal")}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-400 text-[11px]">
                          <ShieldCheck className="h-3 w-3 text-teal-600" />
                          <span>{art.sources.length} {t("sourcesCount")}</span>
                        </span>
                        {art.researchStudy && (
                          <span className="inline-flex items-center gap-0.5 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                            <BookOpenCheck className="h-3 w-3" />
                            <span>{t("citedBadge")}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {art.status === "published" ? (
                        <Link
                          href={`/article/${art.slug}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 font-semibold text-[11px] transition"
                        >
                          <span>{t("viewArticle")}</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-zinc-400 text-[11px] italic font-medium">{t("releaseQueue")}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
