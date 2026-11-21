import { Link } from "@/i18n/navigation";
import { Locale } from "@/i18n/config";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { CATEGORIES_META, ArticleCategory } from "@/domain/entities/article";
import {
  Newspaper,
  ArrowLeft,
  TrendingUp,
  Cpu,
  HeartPulse,
  Globe2,
  BookOpenCheck,
} from "lucide-react";

const CATEGORY_ICONS: Record<ArticleCategory, typeof Cpu> = {
  "tech-ai": Cpu,
  "health-wellness": HeartPulse,
  "global-economy": TrendingUp,
  "earth-science": Globe2,
  "deep-dive": BookOpenCheck,
};

const CATEGORY_SLUGS: ArticleCategory[] = [
  "tech-ai",
  "health-wellness",
  "global-economy",
  "earth-science",
  "deep-dive",
];

export function Header({
  locale,
  tagline,
  backText,
}: {
  locale: Locale;
  tagline: string;
  backText: string;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm group-hover:bg-teal-700 transition">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">
                  PDF<span className="text-teal-600">umi</span>
                </span>
                <span className="rounded-md bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                  NEWS
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 hidden sm:block">{tagline}</p>
            </div>
          </Link>
        </div>

        {/* Center Categories */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          {CATEGORY_SLUGS.map((slug) => {
            const Icon = CATEGORY_ICONS[slug];
            const meta = CATEGORIES_META[slug];
            const label = meta ? meta.name[locale] || meta.name.en : slug;
            return (
              <Link
                key={slug}
                href={`/${slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-teal-600 dark:hover:text-teal-400 transition"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Language, Theme & Tools Link */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          <LanguageSelector currentLocale={locale} />
          <a
            href={`https://pdfumi.com/${locale}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-500/30 transition shadow-2xs"
          >
            <ArrowLeft className="h-3 w-3 text-zinc-400" />
            <span>{backText}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
