import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/config";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";
import { GetNewsUseCase } from "@/application/use-cases/get-news.usecase";
import { CATEGORIES_META, ArticleCategory } from "@/domain/entities/article";
import { ArticleCard } from "@/components/ArticleCard";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  const meta = CATEGORIES_META[category as ArticleCategory];
  if (!meta) return {};

  const name = meta.name[locale as Locale] || meta.name.en;
  const desc = meta.description[locale as Locale] || meta.description.en;

  return {
    title: `${name} — Pdfumi News`,
    description: desc,
    alternates: {
      canonical: `https://news.pdfumi.com/${locale}/${category}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const meta = CATEGORIES_META[category as ArticleCategory];
  if (!meta) {
    notFound();
  }

  const tHome = await getTranslations({ locale, namespace: "home" });
  const tArticle = await getTranslations({ locale, namespace: "article" });
  const newsUseCase = new GetNewsUseCase(articleRepository);
  const articles = await newsUseCase.executeFeed({
    category: category as ArticleCategory,
    locale: locale as Locale,
  });

  const catName = meta.name[locale as Locale] || meta.name.en;
  const catDesc = meta.description[locale as Locale] || meta.description.en;

  const emptyText =
    locale === "id"
      ? "Belum ada artikel dalam kategori ini."
      : locale === "ja"
      ? "このカテゴリーにはまだ記事がありません。"
      : "No articles found in this category for the selected language.";

  return (
    <div className="space-y-10">
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-teal-600 mb-4 transition font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{tArticle("backToFeed")}</span>
        </Link>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {catName}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          {catDesc}
        </p>
      </header>

      <AdSensePlaceholder slotId={`cat-top-${category}`} format="leaderboard" />

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center text-zinc-500 text-sm">
          {emptyText}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              locale={locale as Locale}
              readText={tHome("readArticle")}
              minReadText={tHome("minRead")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
