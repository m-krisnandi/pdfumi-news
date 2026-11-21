import { setRequestLocale } from "next-intl/server";
import { Lock, Cookie } from "lucide-react";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isJa = locale === "ja";
  const isId = locale === "id";

  return (
    <article className="max-w-3xl mx-auto space-y-8 py-6 sm:py-10">
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-600 dark:text-teal-400">
          <Lock className="h-3.5 w-3.5" />
          <span>{isJa ? "プライバシー保護" : isId ? "Privasi & Perlindungan Data" : "Privacy & Data Protection"}</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          {isJa ? "プライバシーポリシー" : isId ? "Kebijakan Privasi" : "Privacy Policy"}
        </h1>
        <p className="text-sm text-zinc-500">
          {isJa ? "最終更新日: 2026年11月" : isId ? "Terakhir diperbarui: November 2026" : "Last updated: November 2026"}
        </p>
      </header>

      <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "1. 収集する情報" : isId ? "1. Informasi yang Kami Kumpulkan" : "1. Information We Collect"}
          </h2>
          <p>
            {isJa
              ? "当ポータルは、読者の個人情報を過剰に収集しません。匿名のアクセスログ、デバイス種別、閲覧ページ情報のみをサービス品質向上のために記録します。"
              : isId
              ? "Pdfumi Global News tidak mengumpulkan data pribadi yang tidak perlu. Kami hanya memproses data analitik tayangan anonim dan preferensi bahasa perangkat untuk optimalisasi pembaca."
              : "We only collect standard anonymous telemetry (pages visited, referral headers, device type) to deliver localized content."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Cookie className="h-4 w-4 text-teal-600" />
            <span>{isJa ? "2. Google AdSenseおよび第三者配信事業者によるCookie" : isId ? "2. Google AdSense & Cookie Pihak Ketiga" : "2. Google AdSense & Third-Party Cookies"}</span>
          </h2>
          <p>
            {isJa
              ? "当サイトでは、第三者配信事業者（Googleを含む）がCookie（DoubleClick Cookie等）を使用して、ユーザーが当サイトや他のウェブサイトに過去にアクセスした情報に基づいて広告を配信します。ユーザーは、Googleの広告設定（https://adssettings.google.com）でパーソナライズ広告を無効にできます。"
              : isId
              ? "Situs ini menggunakan vendor pihak ketiga termasuk Google yang memanfaatkan cookie (seperti DoubleClick cookie) untuk menayangkan iklan relevan berdasarkan riwayat kunjungan pengguna. Pengguna dapat menonaktifkan personalisasi iklan melalui Pengaturan Iklan Google (https://adssettings.google.com)."
              : "Third-party vendors, including Google, use cookies (including the DoubleClick cookie) to serve ads based on prior user visits. Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com) or www.aboutads.info."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "3. お問い合わせ" : isId ? "3. Pertanyaan Mengenai Privasi" : "3. Privacy Contact"}
          </h2>
          <p>
            {isJa
              ? "プライバシーに関するお問い合わせは、privacy@pdfumi.com までご連絡ください。"
              : isId
              ? "Jika Anda memiliki pertanyaan mengenai kebijakan privasi ini, silakan hubungi kami melalui privacy@pdfumi.com."
              : "For any inquiries regarding data protection, please contact privacy@pdfumi.com."}
          </p>
        </section>
      </div>
    </article>
  );
}
