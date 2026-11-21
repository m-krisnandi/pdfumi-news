import { NextResponse } from "next/server";
import { articleRepository } from "@/infrastructure/repositories/json-article.repository";

export async function POST(request: Request) {
  try {
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
