import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { locales, Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "@/app/globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex flex-col justify-between antialiased selection:bg-teal-500 selection:text-white">
        <NextIntlClientProvider messages={messages}>
          <Header
            locale={locale as Locale}
            tagline={tMeta("tagline")}
            backText={tNav("backToPdfumi")}
          />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
          <Footer
            locale={locale as Locale}
            copyrightText={tFooter("copyright")}
            disclaimerText={tFooter("disclaimer")}
            mainToolsText={tFooter("mainTools")}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
