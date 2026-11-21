import { setRequestLocale } from "next-intl/server";
import { ShieldCheck, BookCheck } from "lucide-react";

export default async function EditorialGuidelinesPage({
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
          <BookCheck className="h-3.5 w-3.5" />
          <span>{isJa ? "報道倫理基準" : isId ? "Standar Jurnalistik" : "Editorial Code of Ethics"}</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          {isJa ? "編集方針とファクトチェック基準" : isId ? "Pedoman Editorial & Kode Etik Berita" : "Editorial Guidelines & Fact-Checking Standards"}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {isJa
            ? "Pdfumi Global Newsは、正確性、客観性、著作権遵守を最優先とし、読者に信頼できる国際報道を提供します。"
            : isId
            ? "Pdfumi Global News berpedoman pada asas jurnalisme berimbang, independen, dan anti-misinformasi dalam setiap pemberitaan."
            : "Pdfumi Global News adheres to strict journalistic standards prioritizing accuracy, transparency, and peer-reviewed corroboration."}
        </p>
      </header>

      <div className="space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "1. 二重ファクトチェックの義務化" : isId ? "1. Verifikasi Fakta Primer Wajib" : "1. Mandatory Multi-Source Corroboration"}
          </h2>
          <p>
            {isJa
              ? "単一の情報源に基づく報道は行いません。最低2〜3社の独立した国際通信社（ロイター、AP通信、ブルームバーグ、NHK等）によってクロス検証された情報のみを記事化します。"
              : isId
              ? "Kami tidak pernah menerbitkan berita berdasarkan klaim sepihak. Setiap artikel wajib diverifikasi silang dari minimal 2-3 kantor berita internasional terpercaya."
              : "We never publish based on single unverified claims. Every factual report is cross-referenced against 2-3 verified international press agencies."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "2. 学術的根拠の明記（E-E-A-T）" : isId ? "2. Penguatan Bukti Empiris (E-E-A-T)" : "2. Peer-Reviewed Empirical Evidence"}
          </h2>
          <p>
            {isJa
              ? "科学、健康、技術分野の報道では、査読済み学術誌（Nature、Science、The Lancet等）の論文データを明記し、読者が一次情報源を検証できるようにします。"
              : isId
              ? "Dalam liputan sains, teknologi, dan kesehatan, setiap laporan menyertakan kutipan resmi dari jurnal ilmiah peer-reviewed (Nature, The Lancet, IEEE) untuk menjamin transparansi data."
              : "For scientific and medical reports, we anchor claims to peer-reviewed literature with direct DOI or journal citations."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            {isJa ? "3. 訂正と透明性のポリシー" : isId ? "3. Kebijakan Koreksi & Hak Jawab" : "3. Corrections and Transparency Policy"}
          </h2>
          <p>
            {isJa
              ? "報道内容に誤りや最新の修正事項が発生した場合は、速やかに記事上部または末尾に訂正内容を明記し、読者への透明性を維持します。"
              : isId
              ? "Apabila ditemukan kekeliruan data atau ralat rilis, redaksi akan memperbarui artikel disertai catatan koreksi yang jelas dan transparan bagi publik."
              : "Prompt corrections will be transparently noted on updated articles whenever factual inaccuracies are identified."}
          </p>
        </section>
      </div>
    </article>
  );
}
