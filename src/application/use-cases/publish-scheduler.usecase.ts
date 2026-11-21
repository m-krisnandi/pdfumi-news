import { IArticleRepository } from "@/domain/repositories/article.repository";
import { Article } from "@/domain/entities/article";

export interface ScheduledSlot {
  name: string;
  hourUTC: number; // e.g. 0 UTC = 07:00 WIB / 09:00 JST
  description: string;
}

export const PUBLISHING_SLOTS: ScheduledSlot[] = [
  { name: "Morning Briefing", hourUTC: 0, description: "07:00 WIB / 09:00 JST" },
  { name: "Lunchtime Digest", hourUTC: 5, description: "12:00 WIB / 14:00 JST" },
  { name: "Evening Deep Dive", hourUTC: 12, description: "19:00 WIB / 21:00 JST" },
];

export class PublishSchedulerUseCase {
  constructor(private readonly articleRepo: IArticleRepository) {}

  async execute(options?: { force?: boolean }): Promise<{
    publishedCount: number;
    publishedArticles: Article[];
  }> {
    const now = new Date();
    let dueArticles: Article[];

    if (options?.force) {
      const all = await this.articleRepo.getAllArticles();
      dueArticles = all.filter((a) => a.status === "scheduled");
    } else {
      dueArticles = await this.articleRepo.getScheduledArticlesDue(now);
    }

    const published: Article[] = [];
    for (const article of dueArticles) {
      article.status = "published";
      article.publishedAt = now.toISOString();
      article.updatedAt = now.toISOString();
      await this.articleRepo.saveArticle(article);
      published.push(article);
    }

    return {
      publishedCount: published.length,
      publishedArticles: published,
    };
  }
}
