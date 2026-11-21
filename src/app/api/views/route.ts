import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";

export async function POST(request: Request) {
  try {
    // 1. Check if the viewer is an authenticated admin — do NOT count admin views
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("pdfumi_admin_session");
    if (adminSession?.value === "authenticated") {
      return NextResponse.json({ success: true, message: "Admin view ignored" });
    }

    // 2. Check User-Agent — exclude bots, crawlers, and automated indexers
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const isBot = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|headless|chrome-lighthouse/i.test(
      userAgent
    );
    if (isBot) {
      return NextResponse.json({ success: true, message: "Bot view ignored" });
    }

    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing or invalid article ID" }, { status: 400 });
    }

    await articleRepository.incrementViewCount(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to record view", details: String(err) }, { status: 500 });
  }
}
