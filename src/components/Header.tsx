import { Link } from "@/i18n/navigation";
import { Locale } from "@/i18n/config";
import { LanguageSelector } from "./LanguageSelector";
import { Newspaper, ArrowLeft, TrendingUp, Cpu, HeartPulse, Globe2, BookOpenCheck } from "lucide-react";

export function Header({
  locale,
  tagline,
  backText,
}: {
  locale: Locale;
  tagline: string;
  backText: string;
}) {
  const categoryLinks = [
    { slug: "tech-ai", label: "Tech & AI", icon: Cpu },
    { slug: "health-wellness", label: "Health & Riset", icon: HeartPulse },
    { slug: "global-economy", label: "Ekonomi", icon: TrendingUp },
    { slug: "earth-science", label: "Sains", icon: Globe2 },
    { slug: "deep-dive", label: "Deep Dive", icon: BookOpenCheck },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-zinc-900 text-white text-[11px] py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold uppercase tracking-wider text-emerald-400">Live Network:</span>
            <span className="hidden sm:inline text-zinc-300">
              Sintesis Berita Multi-Sumber • Bebas Hoaks • Terverifikasi Internasional
            </span>
          </div>
          <a
            href="https://pdfumi.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-zinc-400 hover:text-teal-400 transition"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>{backText}</span>
          </a>
        </div>
      </div>

      {/* Main Nav */}
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
          {categoryLinks.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-teal-600 dark:hover:text-teal-400 transition"
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Language & Actions */}
        <div className="flex items-center gap-3">
          <LanguageSelector currentLocale={locale} />
        </div>
      </div>
    </header>
  );
}
