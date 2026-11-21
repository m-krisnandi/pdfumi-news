import { setRequestLocale } from "next-intl/server";
import { FileText } from "lucide-react";

export default async function TermsPage({
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
          <FileText className="h-3.5 w-3.5" />
          <span>{isJa ? "利用規約" : isId ? "Ketentuan Layanan" : "Terms of Service"}</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          {isJa ? "利用規約および免責事項" : isId ? "Syarat & Ketentuan Penggunaan" : "Terms of Service & Disclaimer"}
        </h1>
        <p className="text-sm text-zinc-500">
          {isJa ? "最終更新日: 2026年11月" : isId ? "Terakhir diperbarui: November 2026" : "Last updated: November 2026"}
        </p>
      </header>

      <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "1. 知的財産権と引用基準" : isId ? "1. Hak Cipta & Hak Kekayaan Intelektual" : "1. Intellectual Property & Fair Use"}
          </h2>
          <p>
            {isJa
              ? "当サイトに掲載されているすべての総合編集記事、分析レポート、独自解説の著作権はPdfumi Global Newsに帰属します。事実報道および学術引用は、公正な利用（Fair Use）および国際著作権条約に準拠しています。"
              : isId
              ? "Seluruh artikel sintesis transformatif, analisis, dan infografis di Pdfumi Global News dilindungi hak cipta. Pengutipan fakta dan data ilmiah berpedoman pada asas *fair use* dan atribusi rujukan asli."
              : "All transformative news syntheses and curated analyses are protected by copyright laws. Factual references adhere to international fair-use standards."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "2. 免責事項" : isId ? "2. Batasan Tanggung Jawab (Disclaimer)" : "2. General Disclaimer"}
          </h2>
          <p>
            {isJa
              ? "当ポータルで提供される情報は、一般的な知識・教育および啓発を目的としています。医療、投資、法的判断を行う際は、必ず有資格の専門家にご相談ください。"
              : isId
              ? "Pemberitaan di situs ini ditujukan untuk tujuan edukasi, literasi sains, dan informasi umum. Informasi medis, finansial, atau hukum tidak boleh dianggap sebagai nasihat profesional langsung."
              : "All information provided on this platform is for educational and news reporting purposes only and should not be construed as clinical or financial advice."}
          </p>
        </section>
      </div>
    </article>
  );
}
