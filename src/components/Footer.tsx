import { Link } from "@/i18n/navigation";
import { Newspaper, ExternalLink } from "lucide-react";

export function Footer({
  copyrightText,
  disclaimerText,
  mainToolsText,
}: {
  copyrightText: string;
  disclaimerText: string;
  mainToolsText: string;
}) {
  return (
    <footer className="mt-20 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-zinc-900 dark:text-white">
                PDFumi Global News
              </span>
              <p className="text-xs text-zinc-500">
                Ethical Multi-Source Journalism & Verified Scientific Insights
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <a
              href="https://pdfumi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
            >
              <span>{mainToolsText}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a href="https://pdfumi.com/about" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600">
              About
            </a>
            <a href="https://pdfumi.com/contact" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600">
              Contact
            </a>
            <a href="https://pdfumi.com/editorial-guidelines" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600">
              Editorial Guidelines
            </a>
            <a href="https://pdfumi.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-teal-600">
              Privacy
            </a>
          </div>
        </div>

        <div className="text-xs text-zinc-500 space-y-2">
          <p>{disclaimerText}</p>
          <p>© {new Date().getFullYear()} {copyrightText}</p>
        </div>
      </div>
    </footer>
  );
}
