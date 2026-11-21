export const locales = ["en", "id", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English (Global)",
  id: "Bahasa Indonesia",
  ja: "日本語 (Japan)",
};
