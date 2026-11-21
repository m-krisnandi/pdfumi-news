import { IArticleRepository } from "@/domain/repositories/article.repository";
import { Article, ArticleCategory } from "@/domain/entities/article";
import { Locale } from "@/i18n/config";

export class GetNewsUseCase {
  constructor(private readonly articleRepo: IArticleRepository) {}

  async executeFeed(params?: {
    category?: ArticleCategory;
    limit?: number;
    featuredOnly?: boolean;
    locale?: Locale;
  }): Promise<Article[]> {
    return this.articleRepo.getPublishedArticles(params);
  }

  async executeDetail(slug: string): Promise<{
    article: Article | null;
    related: Article[];
  }> {
    const article = await this.articleRepo.getArticleBySlug(slug);
    if (!article) {
      return { article: null, related: [] };
    }

    const related = await this.articleRepo.getRelatedArticles(article.id, article.category, 3);
    await this.articleRepo.incrementViewCount(article.id);

    return { article, related };
  }
}
