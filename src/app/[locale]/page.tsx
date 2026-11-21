import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/config";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";
import { GetNewsUseCase } from "@/application/use-cases/get-news.usecase";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { Flame, BookOpen, Clock } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: `${t("siteName")} — ${t("tagline")}`,
    description: t("description"),
    alternates: {
      canonical: `https://news.pdfumi.com/${locale}`,
      languages: {
        id: "https://news.pdfumi.com/id",
        en: "https://news.pdfumi.com/en",
        ja: "https://news.pdfumi.com/ja",
        "x-default": "https://news.pdfumi.com/id",
      },
    },
    openGraph: {
      title: t("siteName"),
      description: t("description"),
      url: `https://news.pdfumi.com/${locale}`,
      siteName: t("siteName"),
      locale,
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const newsUseCase = new GetNewsUseCase(articleRepository);
  const articles = await newsUseCase.executeFeed({ locale: locale as Locale });

  const leadArticle = articles[0];
  const sideArticles = articles.slice(1);
  const leadContent = leadArticle?.translations[locale as Locale] || leadArticle?.translations.en;

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Top Banner AdSense Slot */}
      <AdSensePlaceholder slotId="home-top-leaderboard" format="leaderboard" />

      {/* Lead Story Hero Layout */}
      {leadArticle && (
        <section className="grid gap-8 lg:grid-cols-12 items-center rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 sm:p-8 overflow-hidden shadow-xs">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs font-bold text-red-600 dark:text-red-400">
                <Flame className="h-3.5 w-3.5" />
                {t("breaking")}
              </span>
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                {leadArticle.sources.length} {t("sourcesCount")}
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
              <Link href={`/article/${leadArticle.slug}`} className="hover:text-teal-600 dark:hover:text-teal-400 transition">
                {leadContent.title}
              </Link>
            </h1>

            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {leadContent.summary}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                <span>{leadContent.readingTimeMinutes} {t("minRead")}</span>
              </span>
              {leadArticle.researchStudy && (
                <span className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{t("studyIncluded")}</span>
                </span>
              )}
              <Link
                href={`/article/${leadArticle.slug}`}
                className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 text-xs font-bold transition shadow-xs"
              >
                <span>{t("readArticle")}</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-16/10 rounded-2xl overflow-hidden shadow-inner bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={leadArticle.coverImage.url}
              alt={leadArticle.coverImage.alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </section>
      )}

      {/* Latest Stories Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {t("latestTitle")}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Liputan terverifikasi dari berbagai belahan dunia
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sideArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              locale={locale as Locale}
              readText={t("readArticle")}
              minReadText={t("minRead")}
            />
          ))}
        </div>
      </section>

      {/* Mid Feed In-Article AdSense Slot */}
      <AdSensePlaceholder slotId="home-mid-inarticle" format="in-article" />
    </div>
  );
}
