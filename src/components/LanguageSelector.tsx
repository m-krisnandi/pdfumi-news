"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Locale, locales, localeNames } from "@/i18n/config";
import { Globe } from "lucide-react";

export function LanguageSelector({ currentLocale }: { currentLocale: Locale }) {
  const router = useRouter();
  const pathname = usePathname();

  function onSelectChange(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
      <Globe className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
      <select
        value={currentLocale}
        onChange={(e) => onSelectChange(e.target.value as Locale)}
        className="bg-transparent border-none outline-none cursor-pointer pr-1 text-xs font-semibold"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
            {localeNames[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
