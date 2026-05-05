import { NextResponse } from "next/server";

const PRICE_BY_PLAN: Record<string, string | undefined> = {
  solo: process.env.STRIPE_PRICE_MINT_AGENT_SOLO,
  team: process.env.STRIPE_PRICE_MINT_AGENT_TEAM,
};

export async function POST(req: Request) {
  let body: { plan?: string; teamId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const planRaw = body.plan;
  const priceId = planRaw ? PRICE_BY_PLAN[planRaw] : undefined;
  if (!planRaw || !priceId) {
    return NextResponse.json(
      { error: "invalid plan", availablePlans: Object.keys(PRICE_BY_PLAN) },
      { status: 400 },
    );
  }
  const plan: string = planRaw;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "stripe not configured" }, { status: 500 });
  }

  const url = new URL(req.url);
  const origin = url.origin;

  const params = new URLSearchParams();
  params.set("line_items[0][price]", priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("mode", "subscription");
  params.set("success_url", `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`);
  params.set("cancel_url", `${origin}/?canceled=1`);
  params.set("subscription_data[metadata][plan]", plan);
  params.set("subscription_data[metadata][product]", "mint-agent");
  params.set("metadata[plan]", plan);
  params.set("metadata[product]", "mint-agent");
  params.set("allow_promotion_codes", "true");
  if (body.teamId) {
    params.append("metadata[slack_team_id]", body.teamId);
    params.append("subscription_data[metadata][slack_team_id]", body.teamId);
    params.append("client_reference_id", body.teamId);
  }

  const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${stripeKey}:`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!r.ok) {
    const t = await r.text();
    console.error("[stripe:checkout-fail]", r.status, t);
    return NextResponse.json(
      { error: "stripe error", status: r.status, detail: t.slice(0, 500) },
      { status: 500 },
    );
  }
  const session = (await r.json()) as { id: string; url: string };
  return NextResponse.json({ url: session.url });
}
