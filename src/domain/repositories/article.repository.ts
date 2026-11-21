import { Article, ArticleCategory } from "../entities/article";
import { Locale } from "@/i18n/config";

export interface IArticleRepository {
  getAllArticles(): Promise<Article[]>;

  getPublishedArticles(options?: {
    category?: ArticleCategory;
    limit?: number;
    offset?: number;
    featuredOnly?: boolean;
    locale?: Locale;
  }): Promise<Article[]>;

  getArticleBySlug(slug: string): Promise<Article | null>;

  getRelatedArticles(currentId: string, category: ArticleCategory, limit?: number): Promise<Article[]>;

  getScheduledArticlesDue(now: Date): Promise<Article[]>;

  saveArticle(article: Article): Promise<Article>;

  incrementViewCount(id: string): Promise<void>;
}
