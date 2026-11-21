import { ResearchCitation } from "@/domain/entities/article";
import { Locale } from "@/i18n/config";
import { BookOpen, Sparkles } from "lucide-react";

const PAPER_TITLE_TRANSLATIONS: Record<string, { id: string; ja: string }> = {
  "Room-Temperature Coherent Spin Modulation in Monolithic Quantum Silicon": {
    ja: "モノリシック量子シリコンにおける室温コヒーレント・スピン変調の実現",
    id: "Modulasi Spin Koheren Suhu Ruang pada Silikon Kuantum Monolitik",
  },
  "Time-Restricted Feeding and Intermittent Autophagic Renewal: A 5-Year Multi-Cohort Trial": {
    ja: "時間制限給餌と断続的オートファジー再生：5年間にわたる多施設コホート臨床試験",
    id: "Pola Makan Terbatas Waktu dan Pembaruan Autofagi Intermiten: Uji Klinis Multi-Kohort 5 Tahun",
  },
  "Asynchronous Spiking Silicon Architecture: Sub-Milliwatt Deep Reasoning Trials": {
    ja: "非同期スパイキング・シリコン構造：サブミリワット級深層推論の実証実験",
    id: "Arsitektur Silikon Spiking Asinkronus: Uji Coba Penalaran Mendalam Sub-Miliwatt",
  },
  "Transient Yamanaka Factor Delivery in Human Endothelial Microvasculature": {
    ja: "ヒト微小血管内皮細胞における一過性山中因子導入の治療効果検証",
    id: "Penyaluran Faktor Yamanaka Transien pada Mikrovaskular Endotel Manusia",
  },
  "Intercontinental HVDC Supergrids: Dynamic Resilience and Zero-Loss Feasibility": {
    ja: "大陸間超高圧直流（HVDC）スーパーグリッド：動的耐性と低損失送電の実証",
    id: "Supergrid Arus Searah Tegangan Ekstra Tinggi Lintas Benua: Ketahanan Dinamis dan Transmisi Minim Rugi",
  },
  "Sovereign Payment Interoperability: Bilateral Liquidity Pooling Efficiencies": {
    ja: "国家間決済相互接続性：二国間流動性プーリングによる効率性分析",
    id: "Interoperabilitas Pembayaran Antarnegara: Efisiensi Pengumpulan Likuiditas Bilateral",
  },
  "Infrared Transmission Spectroscopy of a Habitable Zone Sub-Neptune Exoplanet": {
    ja: "ハビタブルゾーンに位置するサブ・ネプチューン型系外惑星の赤外線透過分光観測",
    id: "Spektroskopi Transmisi Inframerah pada Eksoplanet Sub-Neptunus di Zona Laik Huni",
  },
  "Coherent Optical Matrix Computing for Ultra-Low Latency Transformers": {
    ja: "超低遅延トランスフォーマー演算のためのコヒーレント光行列コンピューティング",
    id: "Komputasi Matriks Optik Koheren untuk Akselerasi Transformer Latensi Ultra-Rendah",
  },
};

export function ResearchStudyBox({
  study,
  locale,
  titleText,
  descText,
  wisdomTitle,
  keyFindingLabel,
}: {
  study: ResearchCitation;
  locale: Locale;
  titleText: string;
  descText: string;
  wisdomTitle: string;
  keyFindingLabel?: string;
}) {
  const resolveField = (
    field: string | { id: string; en: string; ja: string } | undefined
  ): string => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[locale] || field.en || "";
  };

  const resolveTitle = (): { main: string; original?: string } => {
    if (typeof study.title === "object" && study.title !== null) {
      const loc = (study.title as { id: string; en: string; ja: string })[locale] || (study.title as { en: string }).en;
      const orig = locale !== "en" && (study.title as { en: string }).en !== loc ? (study.title as { en: string }).en : undefined;
      return { main: loc, original: orig };
    }
    const rawTitle = typeof study.title === "string" ? study.title : "";
    if (locale !== "en" && (locale === "ja" || locale === "id") && PAPER_TITLE_TRANSLATIONS[rawTitle]) {
      const loc = PAPER_TITLE_TRANSLATIONS[rawTitle][locale] || rawTitle;
      return { main: loc, original: rawTitle };
    }
    return { main: rawTitle };
  };

  const titleInfo = resolveTitle();
  const keyFindingText = resolveField(study.keyFinding);
  const wisdomText = resolveField(study.contextualWisdom?.text);
  const wisdomSource = resolveField(study.contextualWisdom?.source);
  const wisdomReflection = resolveField(study.contextualWisdom?.reflection);

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-6 my-8 space-y-5">
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
              {titleText}
            </h3>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">
              {study.institutionOrJournal} • {study.year}
            </span>
          </div>
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">{descText}</p>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 p-4">
          <p className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white mb-1">
            &quot;{titleInfo.main}&quot;
          </p>
          {titleInfo.original && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="font-semibold text-zinc-600 dark:text-zinc-300">
                {locale === "ja" ? "原題: " : locale === "id" ? "Judul Publikasi Asli: " : "Original Title: "}
              </span>
              <span className="italic">&quot;{titleInfo.original}&quot;</span>
            </p>
          )}
          {study.authors && (
            <p className="text-[11px] text-zinc-500 mb-2">{study.authors}</p>
          )}
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-2 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{keyFindingLabel || "Key Finding:"} </span>
            {keyFindingText}
          </div>
        </div>
      </div>

      {study.contextualWisdom && wisdomText && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 relative overflow-hidden">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs mb-1.5">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>{wisdomTitle}</span>
          </div>
          <blockquote className="text-xs italic text-zinc-800 dark:text-zinc-200 pl-3 border-l-2 border-amber-500/60 my-2">
            &quot;{wisdomText}&quot;
            {wisdomSource && (
              <span className="block text-[11px] font-semibold text-amber-700 dark:text-amber-400 not-italic mt-1">
                — {wisdomSource}
              </span>
            )}
          </blockquote>
          {wisdomReflection && (
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-2">
              {wisdomReflection}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
