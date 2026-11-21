export const locales = ["id", "en", "ja"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const localeNames: Record<Locale, string> = {
  id: "Bahasa Indonesia",
  en: "English (Global)",
  ja: "日本語 (Japan)",
};
