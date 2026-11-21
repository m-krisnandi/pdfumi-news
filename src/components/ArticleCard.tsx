import { Link } from "@/i18n/navigation";
import { Article, CATEGORIES_META } from "@/domain/entities/article";
import { Locale } from "@/i18n/config";
import { Clock, ShieldCheck, BookOpenCheck } from "lucide-react";
import Image from "next/image";

export function ArticleCard({
  article,
  locale,
  readText,
  minReadText,
}: {
  article: Article;
  locale: Locale;
  readText: string;
  minReadText: string;
}) {
  const content = article.translations[locale] || article.translations.en;
  const categoryMeta = CATEGORIES_META[article.category];
  const catName = categoryMeta.name[locale] || categoryMeta.name.en;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-md hover:border-teal-500/30 transition-all">
      <Link href={`/article/${article.slug}`} className="relative aspect-16/9 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={article.coverImage.url}
          alt={article.coverImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-zinc-900/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
            {catName}
          </span>
          {article.researchStudy && (
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
              <BookOpenCheck className="h-3 w-3" />
              <span>Riset</span>
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2.5">
            <span className="inline-flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{article.sources.length} Sumber</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{content.readingTimeMinutes} {minReadText}</span>
            </span>
          </div>

          <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-2">
            <Link href={`/article/${article.slug}`}>{content.title}</Link>
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {content.summary}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
          <span className="text-zinc-400 text-[11px]">
            {new Date(article.publishedAt || article.createdAt).toLocaleDateString(locale === "id" ? "id-ID" : locale === "ja" ? "ja-JP" : "en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Link
            href={`/article/${article.slug}`}
            className="text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
          >
            <span>{readText}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
