import { setRequestLocale } from "next-intl/server";
import { ShieldCheck, Newspaper, Globe, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isJa = locale === "ja";
  const isId = locale === "id";

  const title = isJa ? "当サイトについて" : isId ? "Tentang Pdfumi Global News" : "About Pdfumi Global News";
  const subtitle = isJa
    ? "厳格なファクトチェックと査読論文に裏付けられた、次世代の国際科学・経済報道ネットワーク"
    : isId
    ? "Jaringan jurnalisme sains, ekonomi global, dan teknologi masa depan berbasis bukti empiris dan verifikasi fakta independen."
    : "An independent global journalism network synthesizing verified international reporting and peer-reviewed empirical science.";

  return (
    <article className="max-w-4xl mx-auto space-y-10 py-6 sm:py-10">
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-8 space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-600 dark:text-teal-400">
          <Newspaper className="h-3.5 w-3.5" />
          <span>{isJa ? "報道理念" : isId ? "Integritas Berita" : "Editorial Mission"}</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
          {title}
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      </header>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "多角的ファクト検証" : isId ? "Verifikasi Multi-Sumber Ketat" : "Multi-Source Verification"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {isJa
              ? "すべての報道は、ロイター、AP通信、NHK等の主要通信社から事実を抽出し、著作権法に準拠した変革的総合編集を行っています。"
              : isId
              ? "Setiap artikel disintesis secara legal dari 2-3 kantor berita primer dunia untuk menjamin akurasi mutlak dan integritas hak cipta."
              : "Every report is cross-verified across 2-3 verified international press wires to eliminate misinformation and uphold journalistic rigor."}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "査読論文エビデンス" : isId ? "Rujukan Studi Ilmiah Empiris" : "Peer-Reviewed Substantiation"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {isJa
              ? "Nature、The Lancet、IEEEなどの査読済み学術誌に掲載された研究データを直接引用し、憶測を排した客観的インサイトを提供します。"
              : isId
              ? "Klaim ilmiah diperkuat oleh rujukan jurnal bereputasi tinggi (Nature, Lancet, IEEE) untuk memberikan edukasi objektif bagi publik."
              : "All scientific assertions are anchored to peer-reviewed trials from Nature, The Lancet, and IEEE to deliver transparent insights."}
          </p>
        </div>
      </div>

      <section className="space-y-4 pt-4 text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          {isJa ? "運営体制と連絡先" : isId ? "Struktur Redaksi & Hubungi Kami" : "Editorial Bureau & Contact"}
        </h2>
        <p>
          {isJa
            ? "Pdfumi Global Newsは、PDFumiテクノロジーネットワークの独立報道部門として運営されています。記事の修正要望や情報提供は、下記のお問い合わせ窓口までご連絡ください。"
            : isId
            ? "Pdfumi Global News dikelola sebagai divisi editorial independen di bawah jaringan teknologi PDFumi. Untuk klarifikasi dan kemitraan, silakan hubungi tim kami."
            : "Pdfumi Global News operates as the editorial arm of the PDFumi Network. For corrections, tips, or inquiries, please contact our editorial desk."}
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs"
          >
            <Globe className="h-4 w-4" />
            <span>{isJa ? "お問い合わせフォームへ" : isId ? "Hubungi Meja Redaksi" : "Contact Editorial Desk"}</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
