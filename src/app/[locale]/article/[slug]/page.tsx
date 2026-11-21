import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/config";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";
import { GetNewsUseCase } from "@/application/use-cases/get-news.usecase";
import { CATEGORIES_META } from "@/domain/entities/article";
import { SourceVerificationBox } from "@/components/SourceVerificationBox";
import { ResearchStudyBox } from "@/components/ResearchStudyBox";
import { AdSensePlaceholder } from "@/components/AdSensePlaceholder";
import { ArticleCard } from "@/components/ArticleCard";
import { ShareButton } from "@/components/ShareButton";
import { ViewTracker } from "@/components/ViewTracker";
import { Clock, Calendar, ArrowLeft, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const newsUseCase = new GetNewsUseCase(articleRepository);
  const { article } = await newsUseCase.executeDetail(slug);

  if (!article) return {};

  const content = article.translations[locale as Locale] || article.translations.en;

  return {
    title: `${content.seoTitle} — Pdfumi News`,
    description: content.seoDescription,
    alternates: {
      canonical: `https://news.pdfumi.com/${locale}/article/${article.slug}`,
      languages: {
        id: `https://news.pdfumi.com/id/article/${article.slug}`,
        en: `https://news.pdfumi.com/en/article/${article.slug}`,
        ja: `https://news.pdfumi.com/ja/article/${article.slug}`,
        "x-default": `https://news.pdfumi.com/en/article/${article.slug}`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.summary,
      url: `https://news.pdfumi.com/${locale}/article/${article.slug}`,
      images: [
        {
          url: article.coverImage.url,
          width: 1200,
          height: 675,
          alt: article.coverImage.alt,
        },
      ],
      type: "article",
      publishedTime: article.publishedAt || article.createdAt,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.summary,
      images: [article.coverImage.url],
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "article" });
  const tHome = await getTranslations({ locale, namespace: "home" });

  const newsUseCase = new GetNewsUseCase(articleRepository);
  const { article, related } = await newsUseCase.executeDetail(slug);

  if (!article) {
    notFound();
  }

  const content = article.translations[locale as Locale] || article.translations.en;
  const categoryMeta = CATEGORIES_META[article.category];
  const catName = categoryMeta ? (categoryMeta.name[locale as Locale] || categoryMeta.name.en) : article.category;
  const copiedNotification = locale === "id" ? "Tautan berhasil disalin!" : locale === "ja" ? "リンクをコピーしました" : "Link copied to clipboard!";

  // Resolve caption based on locale or fallback to string
  const captionText =
    typeof article.coverImage.caption === "object"
      ? article.coverImage.caption[locale as Locale] || article.coverImage.caption.en
      : article.coverImage.caption;

  // JSON-LD NewsArticle structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: content.title,
    description: content.summary,
    image: [article.coverImage.url],
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "Pdfumi News Editorial Bureau",
      url: "https://news.pdfumi.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Pdfumi Global News",
      logo: {
        "@type": "ImageObject",
        url: "https://news.pdfumi.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://news.pdfumi.com/${locale}/article/${article.slug}`,
    },
  };

  return (
    <>
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Real View Tracker */}
      <ViewTracker articleId={article.id} />

      <article className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb / Back Link */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-teal-600 dark:hover:text-teal-400 transition font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{t("backToFeed")}</span>
          </Link>
          <span className="rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold px-2 py-0.5 uppercase tracking-wider text-[10px]">
            {catName}
          </span>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.18]">
            {content.title}
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
            {content.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-y border-zinc-200 dark:border-zinc-800 py-3 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>
                  {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                    locale === "id" ? "id-ID" : locale === "ja" ? "ja-JP" : "en-US",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                <span>{content.readingTimeMinutes} {tHome("minRead")}</span>
              </span>
              <span className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-medium">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{article.sources.length} {tHome("sourcesUnit")}</span>
              </span>
            </div>

            <ShareButton
              title={content.title}
              shareText={t("share")}
              copiedText={copiedNotification}
            />
          </div>
        </header>

        {/* Featured Image */}
        <figure className="space-y-2">
          <div className="relative aspect-16/9 w-full rounded-3xl overflow-hidden shadow-xs bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={article.coverImage.url}
              alt={article.coverImage.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
          {captionText && (
            <figcaption className="text-center text-xs text-zinc-500">
              {captionText}{" "}
              {article.coverImage.credit && (
                <span className="text-zinc-400">({article.coverImage.credit})</span>
              )}
            </figcaption>
          )}
        </figure>

        {/* Main Body Content */}
        <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-sm sm:text-base leading-relaxed space-y-6">
          {content.content.split("\n\n").map((para, i) => {
            if (para.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-3"
                >
                  {para.replace("### ", "")}
                </h3>
              );
            }
            return (
              <p key={i} className="leading-relaxed">
                {para}
              </p>
            );
          })}
        </div>

        {/* Research Study Citation & Universal Wisdom Box */}
        {article.researchStudy && (
          <ResearchStudyBox
            study={article.researchStudy}
            locale={locale as Locale}
            titleText={t("scientificStudy")}
            descText={t("scientificStudyDesc")}
            wisdomTitle={t("wisdomTitle")}
            keyFindingLabel={t("keyFinding")}
          />
        )}

        {/* Multi-Source Attribution & Verification Box */}
        <SourceVerificationBox
          sources={article.sources}
          titleText={t("verifiedSources")}
          descText={t("verifiedSourcesDesc")}
        />

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-bold text-zinc-500">Tags:</span>
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Bottom In-Article AdSense Banner (Non-Intrusive) */}
        <AdSensePlaceholder slotId="article-bottom-banner" format="in-article" />

        {/* Related Stories */}
        {related.length > 0 && (
          <section className="pt-10 border-t border-zinc-200 dark:border-zinc-800 space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {t("relatedArticles")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <ArticleCard
                  key={rel.id}
                  article={rel}
                  locale={locale as Locale}
                  readText={tHome("readArticle")}
                  minReadText={tHome("minRead")}
                />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
