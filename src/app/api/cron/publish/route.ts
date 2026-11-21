import { NextResponse } from "next/server";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";
import { PublishSchedulerUseCase, PUBLISHING_SLOTS } from "@/application/use-cases/publish-scheduler.usecase";
import { NewsHarvesterService } from "@/application/services/news-harvester.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authKey = searchParams.get("key");
  const doHarvest = searchParams.get("harvest") === "true";
  const doForce = searchParams.get("force") === "true";
  const publishImmediately = searchParams.get("publishNow") === "true";
  const expectedKey = process.env.CRON_SECRET || "pdfumi-news-secure-cron-2026";

  if (authKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let harvestedArticle = null;
  if (doHarvest) {
    const harvester = new NewsHarvesterService(articleRepository);
    harvestedArticle = await harvester.harvestNextAvailableTopic({
      publishImmediately,
    });
  }

  const scheduler = new PublishSchedulerUseCase(articleRepository);
  const result = await scheduler.execute({ force: doForce });

  const allArticles = await articleRepository.getAllArticles();
  const scheduledCount = allArticles.filter((a) => a.status === "scheduled").length;

  return NextResponse.json({
    success: true,
    message: `Scheduler executed successfully. ${result.publishedCount} article(s) published.`,
    timestamp: new Date().toISOString(),
    slots: PUBLISHING_SLOTS,
    result,
    harvestedArticle: harvestedArticle ? harvestedArticle.slug : null,
    totalArticles: allArticles.length,
    scheduledCount,
  });
}
