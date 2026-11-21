import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, password } = body;

    const cookieStore = await cookies();

    if (action === "logout") {
      cookieStore.delete("pdfumi_admin_session");
      return NextResponse.json({ success: true, message: "Logged out" });
    }

    if (action === "login") {
      const expectedPassword = process.env.ADMIN_PASSWORD || "pdfumi-admin-2026";
      if (!password || password !== expectedPassword) {
        return NextResponse.json({ error: "Invalid admin passphrase" }, { status: 401 });
      }

      cookieStore.set("pdfumi_admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({ success: true, message: "Authenticated successfully" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Authentication failed", details: String(err) }, { status: 500 });
  }
}
