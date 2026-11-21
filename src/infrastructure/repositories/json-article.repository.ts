import { Article, ArticleCategory } from "@/domain/entities/article";
import { IArticleRepository } from "@/domain/repositories/article.repository";
import { Locale } from "@/i18n/config";
import rawArticles from "../data/articles.json";
import fs from "fs";
import path from "path";

export class JsonArticleRepository implements IArticleRepository {
  private articles: Article[] = [];
  private filePath: string;

  constructor() {
    this.articles = rawArticles as Article[];
    this.filePath = path.join(process.cwd(), "src/infrastructure/data/articles.json");
    this.loadFromFile();
  }

  private loadFromFile(): void {
    try {
      if (typeof window === "undefined" && fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, "utf8");
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.articles = parsed;
        }
      }
    } catch (err) {
      console.warn("[JsonArticleRepository] loadFromFile fallback:", err);
    }
  }

  async getAllArticles(): Promise<Article[]> {
    this.loadFromFile();
    return [...this.articles].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });
  }

  async getPublishedArticles(options?: {
    category?: ArticleCategory;
    limit?: number;
    offset?: number;
    featuredOnly?: boolean;
    locale?: Locale;
  }): Promise<Article[]> {
    this.loadFromFile();
    let result = this.articles.filter((a) => a.status === "published");

    if (options?.category) {
      result = result.filter((a) => a.category === options.category);
    }

    if (options?.featuredOnly) {
      result = result.filter((a) => a.featured);
    }

    // Sort by publishedAt descending
    result.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime();
      const dateB = new Date(b.publishedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    const offset = options?.offset || 0;
    const limit = options?.limit || result.length;

    return result.slice(offset, offset + limit);
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    this.loadFromFile();
    const found = this.articles.find((a) => a.slug === slug);
    return found || null;
  }

  async getRelatedArticles(
    currentId: string,
    category: ArticleCategory,
    limit: number = 3
  ): Promise<Article[]> {
    this.loadFromFile();
    return this.articles
      .filter((a) => a.id !== currentId && a.category === category && a.status === "published")
      .slice(0, limit);
  }

  async getScheduledArticlesDue(now: Date): Promise<Article[]> {
    this.loadFromFile();
    const nowTime = now.getTime();
    return this.articles.filter(
      (a) => a.status === "scheduled" && new Date(a.scheduledAt).getTime() <= nowTime
    );
  }

  async saveArticle(article: Article): Promise<Article> {
    this.loadFromFile();
    const idx = this.articles.findIndex((a) => a.id === article.id || a.slug === article.slug);
    if (idx >= 0) {
      this.articles[idx] = article;
    } else {
      this.articles.unshift(article);
    }

    await this.persistToFile();
    return article;
  }

  async incrementViewCount(id: string): Promise<void> {
    this.loadFromFile();
    const article = this.articles.find((a) => a.id === id);
    if (article) {
      article.viewCount = (article.viewCount || 0) + 1;
      await this.persistToFile();
    }
  }

  private async persistToFile(): Promise<void> {
    try {
      if (typeof window === "undefined") {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(this.filePath, JSON.stringify(this.articles, null, 2), "utf8");
      }
    } catch (err) {
      console.error("[JsonArticleRepository] Failed to persistToFile:", err);
    }
  }
}

// Singleton repository for Dependency Injection
export const articleRepository = new JsonArticleRepository();
