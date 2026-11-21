import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  prevText: string;
  nextText: string;
  pageText?: string;
  ofText?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath = "",
  prevText,
  nextText,
  pageText = "Page",
  ofText = "of",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const prefix = basePath ? basePath : "";
    return page === 1 ? (prefix ? prefix : "/") : `${prefix}?page=${page}`;
  };

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Pagination Navigation"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-zinc-200 dark:border-zinc-800"
    >
      <div className="text-xs text-zinc-500 font-medium order-2 sm:order-1">
        <span>{pageText} </span>
        <span className="font-bold text-zinc-900 dark:text-white">{currentPage}</span>
        <span> {ofText} </span>
        <span className="font-bold text-zinc-900 dark:text-white">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {/* Previous Button */}
        {currentPage > 1 ? (
          <Link
            href={getPageUrl(currentPage - 1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition shadow-2xs"
            aria-label={prevText}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{prevText}</span>
          </Link>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 dark:text-zinc-600 bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 cursor-not-allowed"
            aria-disabled="true"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{prevText}</span>
          </span>
        )}

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p) => {
            const isCurrent = p === currentPage;
            return isCurrent ? (
              <span
                key={p}
                aria-current="page"
                className="flex items-center justify-center min-w-9 h-9 px-3 rounded-xl text-xs font-bold text-white bg-teal-600 shadow-xs"
              >
                {p}
              </span>
            ) : (
              <Link
                key={p}
                href={getPageUrl(p)}
                className="flex items-center justify-center min-w-9 h-9 px-3 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-teal-500/40 hover:text-teal-600 dark:hover:text-teal-400 transition shadow-2xs"
              >
                {p}
              </Link>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages ? (
          <Link
            href={getPageUrl(currentPage + 1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 transition shadow-2xs"
            aria-label={nextText}
          >
            <span>{nextText}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 dark:text-zinc-600 bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/50 cursor-not-allowed"
            aria-disabled="true"
          >
            <span>{nextText}</span>
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </nav>
  );
}
