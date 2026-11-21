import { SourceReference } from "@/domain/entities/article";
import { ShieldCheck, ExternalLink, Award } from "lucide-react";

export function SourceVerificationBox({
  sources,
  titleText,
  descText,
  badgeText = "100% Fact-Checked & Attributed",
}: {
  sources: SourceReference[];
  titleText: string;
  descText: string;
  badgeText?: string;
}) {
  return (
    <div className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5 sm:p-6 my-8">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
            {titleText}
          </h3>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold tracking-wide uppercase">
            {badgeText}
          </span>
        </div>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
        {descText}
      </p>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((src, index) => (
          <a
            key={index}
            href={src.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-3 hover:border-teal-500/40 hover:bg-white dark:hover:bg-zinc-800 transition group"
          >
            <div className="min-w-0">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
                {src.name}
              </p>
              <p className="text-[10px] text-zinc-500 truncate">{src.publisher}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <Award className="h-3 w-3" />
                {src.credibilityScore}%
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-zinc-400 group-hover:text-teal-500 transition" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
