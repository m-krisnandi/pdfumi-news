import { Article, ArticleCategory } from "@/domain/entities/article";
import { IArticleRepository } from "@/domain/repositories/article.repository";
import { Locale } from "@/i18n/config";
import rawArticles from "../data/articles.json";

export class JsonArticleRepository implements IArticleRepository {
  private articles: Article[] = [];

  constructor() {
    this.articles = rawArticles as Article[];
  }

  async getPublishedArticles(options?: {
    category?: ArticleCategory;
    limit?: number;
    offset?: number;
    featuredOnly?: boolean;
    locale?: Locale;
  }): Promise<Article[]> {
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
    const found = this.articles.find((a) => a.slug === slug);
    return found || null;
  }

  async getRelatedArticles(
    currentId: string,
    category: ArticleCategory,
    limit: number = 3
  ): Promise<Article[]> {
    return this.articles
      .filter((a) => a.id !== currentId && a.category === category && a.status === "published")
      .slice(0, limit);
  }

  async getScheduledArticlesDue(now: Date): Promise<Article[]> {
    const nowTime = now.getTime();
    return this.articles.filter(
      (a) => a.status === "scheduled" && new Date(a.scheduledAt).getTime() <= nowTime
    );
  }

  async saveArticle(article: Article): Promise<Article> {
    const idx = this.articles.findIndex((a) => a.id === article.id);
    if (idx >= 0) {
      this.articles[idx] = article;
    } else {
      this.articles.unshift(article);
    }

    try {
      if (typeof window === "undefined") {
        const fs = await import("fs");
        const path = await import("path");
        const filePath = path.join(process.cwd(), "src/infrastructure/data/articles.json");
        if (fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify(this.articles, null, 2), "utf8");
        }
      }
    } catch {
      // In standalone container, filesystem write is optional
    }

    return article;
  }

  async incrementViewCount(id: string): Promise<void> {
    const article = this.articles.find((a) => a.id === id);
    if (article) {
      article.viewCount = (article.viewCount || 0) + 1;
    }
  }
}

// Singleton repository for Dependency Injection
export const articleRepository = new JsonArticleRepository();
