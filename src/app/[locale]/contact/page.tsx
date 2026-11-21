import { setRequestLocale } from "next-intl/server";
import { Mail, MessageSquare, Send } from "lucide-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isJa = locale === "ja";
  const isId = locale === "id";

  return (
    <article className="max-w-2xl mx-auto space-y-8 py-6 sm:py-10">
      <header className="border-b border-zinc-200 dark:border-zinc-800 pb-6 space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-600 dark:text-teal-400">
          <Mail className="h-3.5 w-3.5" />
          <span>{isJa ? "お問い合わせ窓口" : isId ? "Layanan Kontak" : "Contact Desk"}</span>
        </div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
          {isJa ? "編集部へのお問い合わせ" : isId ? "Hubungi Redaksi Pdfumi News" : "Contact the Editorial Team"}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {isJa
            ? "記事に関する事実確認、修正リクエスト、プレスリリース、広告掲載のご相談を受け付けております。"
            : isId
            ? "Kami menyambut baik tanggapan pembaca, hak jawab, koreksi data, serta penawaran kerja sama editorial."
            : "Reach out to our journalists and editors for factual inquiries, correction requests, or press distribution."}
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 space-y-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {isJa ? "公式メールアドレス" : isId ? "Email Resmi Redaksi" : "Direct Email Desk"}
          </span>
          <p className="text-base font-bold text-teal-600 dark:text-teal-400">
            editorial@pdfumi.com
          </p>
        </div>
        <div className="space-y-1 pt-3 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            {isJa ? "運営本社" : isId ? "Alamat Kantor / Jaringan" : "Network Office"}
          </span>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            PDFumi Network Media & Technology Bureau
            <br />
            Jakarta & Global Remote Editorial Nodes
          </p>
        </div>
      </div>
    </article>
  );
}
