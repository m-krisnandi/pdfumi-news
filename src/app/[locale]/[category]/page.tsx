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

export const dynamic = "force-dynamic";

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

  const catMeta = CATEGORIES_META[category as ArticleCategory];
  if (!catMeta) {
    notFound();
  }

  const tHome = await getTranslations({ locale, namespace: "home" });
  const catName = catMeta.name[locale as Locale] || catMeta.name.en;
  const catDesc = catMeta.description[locale as Locale] || catMeta.description.en;

  const newsUseCase = new GetNewsUseCase(articleRepository);
  const articles = await newsUseCase.executeFeed({
    category: category as ArticleCategory,
    locale: locale as Locale,
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{tHome("viewAll")}</span>
        </Link>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {catName}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          {catDesc}
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center text-sm text-zinc-500">
          Belum ada laporan terverifikasi pada kategori ini untuk wilayah bahasa yang dipilih.
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

      {/* In-category AdSense placement */}
      <AdSensePlaceholder slotId={`category-${category}-bottom`} format="in-article" />
    </div>
  );
}
