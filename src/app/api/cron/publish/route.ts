import { NextResponse } from "next/server";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";
import { PublishSchedulerUseCase, PUBLISHING_SLOTS } from "@/application/use-cases/publish-scheduler.usecase";
import { NewsHarvesterService } from "@/application/services/news-harvester.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authKey = searchParams.get("key");
  const doHarvest = searchParams.get("harvest") === "true";
  const expectedKey = process.env.CRON_SECRET || "pdfumi-news-secure-cron-2026";

  if (authKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scheduler = new PublishSchedulerUseCase(articleRepository);
  const result = await scheduler.execute();

  let harvestedArticle = null;
  if (doHarvest) {
    const harvester = new NewsHarvesterService(articleRepository);
    harvestedArticle = await harvester.harvestAndSchedule({
      title: "Global Clean Energy Grid Integration Milestone",
      category: "earth-science",
      primaryPublisher: "Reuters Energy Wire",
      primaryUrl: "https://reuters.com",
      secondaryPublisher: "Nature Climate & Energy",
      secondaryUrl: "https://nature.com",
      researchCitation: {
        title: "Intercontinental HVDC Supergrids: Dynamic Resilience and Zero-Loss Feasibility",
        institutionOrJournal: "Nature Energy Journal",
        year: 2026,
        keyFinding: "Konektivitas transmisi arus searah tegangan ultra-tinggi antarbenua mampu menekan fluktuasi pasokan energi terbarukan hingga 88%.",
      },
    });
  }

  return NextResponse.json({
    success: true,
    message: `Scheduler executed successfully. ${result.publishedCount} article(s) published.`,
    timestamp: new Date().toISOString(),
    slots: PUBLISHING_SLOTS,
    result,
    harvestedArticle: harvestedArticle ? harvestedArticle.slug : null,
  });
}
