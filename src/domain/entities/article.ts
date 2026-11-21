export type ArticleCategory =
  | "tech-ai"
  | "health-wellness"
  | "global-economy"
  | "earth-science"
  | "deep-dive";

export type PublicationStatus = "draft" | "scheduled" | "published";

export interface SourceReference {
  name: string;
  url: string;
  publisher: string;
  publishedAt?: string;
  isPrimary: boolean;
  credibilityScore: number; // 1-100
}

export interface ResearchCitation {
  title: string;
  authors?: string;
  institutionOrJournal: string; // e.g. "Nature Medicine", "Lancet", "MIT Media Lab"
  year: number;
  url?: string;
  keyFinding: string;
  contextualWisdom?: {
    text: string;
    source: string; // e.g. "QS. An-Nahl: 69" or "Hippocrates Aphorisms"
    reflection: string;
  };
}

export interface LocalizedArticleContent {
  title: string;
  summary: string;
  content: string; // Markdown or rich HTML
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  readingTimeMinutes: number;
}

export interface Article {
  id: string;
  slug: string;
  category: ArticleCategory;
  status: PublicationStatus;
  featured: boolean;
  coverImage: {
    url: string;
    alt: string;
    caption?: string;
    credit?: string;
  };
  sources: SourceReference[];
  researchStudy?: ResearchCitation;
  translations: {
    id: LocalizedArticleContent;
    en: LocalizedArticleContent;
    ja: LocalizedArticleContent;
  };
  scheduledAt: string; // ISO 8601
  publishedAt?: string; // ISO 8601
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORIES_META: Record<
  ArticleCategory,
  {
    slug: ArticleCategory;
    icon: string;
    name: { id: string; en: string; ja: string };
    description: { id: string; en: string; ja: string };
  }
> = {
  "tech-ai": {
    slug: "tech-ai",
    icon: "Cpu",
    name: {
      id: "Teknologi & AI",
      en: "Tech & AI",
      ja: "テクノロジー＆AI",
    },
    description: {
      id: "Kabar terobosan kecerdasan buatan, komputasi, dan inovasi masa depan.",
      en: "Breakthroughs in artificial intelligence, quantum computing, and future tech.",
      ja: "人工知能、量子コンピューティング、次世代技術の最新動向。",
    },
  },
  "health-wellness": {
    slug: "health-wellness",
    icon: "HeartPulse",
    name: {
      id: "Kesehatan & Riset",
      en: "Health & Research",
      ja: "健康＆医学研究",
    },
    description: {
      id: "Kajian medis berbasis studi ilmiah, nutrisi, dan gaya hidup sehat berkelanjutan.",
      en: "Evidence-based wellness, clinical studies, and sustainable longevity.",
      ja: "科学的エビデンスに基づく健康・医療研究およびライフサイエンス。",
    },
  },
  "global-economy": {
    slug: "global-economy",
    icon: "TrendingUp",
    name: {
      id: "Ekonomi Global",
      en: "Global Economy",
      ja: "世界経済・ビジネス",
    },
    description: {
      id: "Dinamika pasar finansial, ekosistem startup, dan disrupsi bisnis dunia.",
      en: "Market dynamics, fintech evolutions, and global business shifts.",
      ja: "世界金融市場、スタートアップ、新興産業の動向分析。",
    },
  },
  "earth-science": {
    slug: "earth-science",
    icon: "Globe2",
    name: {
      id: "Sains & Lingkungan",
      en: "Earth & Science",
      ja: "地球科学＆環境",
    },
    description: {
      id: "Eksplorasi antariksa, transisi energi hijau, dan fenomena keplanetan.",
      en: "Space exploration, green energy transition, and planetary phenomena.",
      ja: "宇宙探査、グリーンエネルギートランジション、地球科学の深層。",
    },
  },
  "deep-dive": {
    slug: "deep-dive",
    icon: "BookOpenCheck",
    name: {
      id: "Wawasan & Edukasi",
      en: "Insights & Deep Dive",
      ja: "インサイト＆教養",
    },
    description: {
      id: "Analisis komparatif, panduan mendalam, dan pembedahan konsep rumit.",
      en: "Comprehensive analytical breakdowns and simplified technical guides.",
      ja: "複雑な概念を分かりやすく紐解く徹底解説・教養シリーズ。",
    },
  },
};
