import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Supabase 設定なし → fallback で notification email だけ送る（暫定）
  if (!supabaseUrl || !serviceKey) {
    console.log("[waitlist:fallback]", {
      email,
      ts: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, mode: "fallback" });
  }

  // Supabase に保存（waitlist テーブル）
  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        email,
        product: "mint-agent",
        signed_up_at: new Date().toISOString(),
        source: "agent.komugi-ai.jp",
      }),
    });

    if (!r.ok && r.status !== 409) {
      const t = await r.text();
      console.error("[waitlist:supabase-fail]", r.status, t);
      return NextResponse.json(
        { error: "save failed" },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist:exception]", err);
    return NextResponse.json({ error: "save failed" }, { status: 500 });
  }
}
