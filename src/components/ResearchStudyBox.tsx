import { ResearchCitation } from "@/domain/entities/article";
import { Locale } from "@/i18n/config";
import { BookOpen, Sparkles } from "lucide-react";

export function ResearchStudyBox({
  study,
  locale,
  titleText,
  descText,
  wisdomTitle,
  keyFindingLabel,
}: {
  study: ResearchCitation;
  locale: Locale;
  titleText: string;
  descText: string;
  wisdomTitle: string;
  keyFindingLabel?: string;
}) {
  const resolveField = (
    field: string | { id: string; en: string; ja: string } | undefined
  ): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field.en || "";
  };

  const titleTextResolved = resolveField(study.title as unknown as string | { id: string; en: string; ja: string } | undefined);
  const keyFindingText = resolveField(study.keyFinding);
  const wisdomText = resolveField(study.contextualWisdom?.text);
  const wisdomSource = resolveField(study.contextualWisdom?.source);
  const wisdomReflection = resolveField(study.contextualWisdom?.reflection);

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-6 my-8 space-y-5">
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
              {titleText}
            </h3>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
              {study.institutionOrJournal} • {study.year}
            </span>
          </div>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">{descText}</p>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-4">
          <p className="text-xs font-bold text-zinc-900 dark:text-white mb-1.5">
            &quot;{titleTextResolved || study.title}&quot;
          </p>
          {study.authors && (
            <p className="text-[11px] text-zinc-500 mb-2">{study.authors}</p>
          )}
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{keyFindingLabel || "Key Finding:"} </span>
            {keyFindingText}
          </div>
        </div>
      </div>

      {study.contextualWisdom && wisdomText && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs mb-1.5">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>{wisdomTitle}</span>
          </div>
          <blockquote className="text-xs italic text-zinc-800 dark:text-zinc-200 pl-3 border-l-2 border-amber-500/60 my-2">
            &quot;{wisdomText}&quot;
            {wisdomSource && (
              <span className="block text-[11px] font-semibold text-amber-700 dark:text-amber-400 not-italic mt-1">
                — {wisdomSource}
              </span>
            )}
          </blockquote>
          {wisdomReflection && (
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2">
              {wisdomReflection}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
