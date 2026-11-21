import { MetadataRoute } from "next";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";
import { locales } from "@/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await articleRepository.getPublishedArticles();
  const baseUrl = "https://news.pdfumi.com";

  const entries: MetadataRoute.Sitemap = [];

  // Homepages
  for (const loc of locales) {
    entries.push({
      url: `${baseUrl}/${loc}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    });
  }

  // Articles across all locales
  for (const art of articles) {
    for (const loc of locales) {
      entries.push({
        url: `${baseUrl}/${loc}/article/${art.slug}`,
        lastModified: new Date(art.updatedAt || art.publishedAt || art.createdAt),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  return entries;
}
