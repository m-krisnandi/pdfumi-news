import { NextResponse } from "next/server";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";
import { PublishSchedulerUseCase, PUBLISHING_SLOTS } from "@/application/use-cases/publish-scheduler.usecase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authKey = searchParams.get("key");
  const expectedKey = process.env.CRON_SECRET || "pdfumi-news-secure-cron-2026";

  if (authKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scheduler = new PublishSchedulerUseCase(articleRepository);
  const result = await scheduler.execute();

  return NextResponse.json({
    success: true,
    message: `Scheduler executed successfully. ${result.publishedCount} article(s) published.`,
    timestamp: new Date().toISOString(),
    slots: PUBLISHING_SLOTS,
    result,
  });
}
