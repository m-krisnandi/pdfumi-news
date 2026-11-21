"use client";

import { useTranslations } from "next-intl";

interface AdSenseProps {
  slotId?: string;
  format?: "leaderboard" | "rectangle" | "in-article";
  className?: string;
}

export function AdSensePlaceholder({
  slotId = "default-slot",
  format = "rectangle",
  className = "",
}: AdSenseProps) {
  const t = useTranslations("adsense");

  // Dimension profiles to prevent Cumulative Layout Shift (CLS < 0.1)
  const formatClasses = {
    leaderboard: "min-h-[90px] max-w-[728px] my-6",
    rectangle: "min-h-[250px] max-w-[300px] my-4",
    "in-article": "min-h-[120px] max-w-full my-8",
  };

  return (
    <div
      className={`mx-auto flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/60 dark:bg-zinc-900/40 p-4 text-center transition ${formatClasses[format]} ${className}`}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
        <span>{t("sponsor")}</span>
        <span>•</span>
        <span>{t("advertisement")}</span>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {t("reservedArea")} ({format})
      </p>
      <span className="text-[10px] text-zinc-400/80 mt-0.5">
        Slot: {slotId} ({t("zeroCls")})
      </span>
    </div>
  );
}
