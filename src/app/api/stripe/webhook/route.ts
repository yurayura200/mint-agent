import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { sbInsert, sbUpdate } from "@/lib/supabase";

/** Verify Stripe signature (raw body required) */
function verifyStripeSignature(
  rawBody: string,
  sig: string,
  secret: string,
): boolean {
  // Stripe header: t=...,v1=...,v0=...
  const parts = sig.split(",").reduce<Record<string, string>>((acc, p) => {
    const [k, v] = p.split("=");
    acc[k] = v;
    return acc;
  }, {});
  const ts = parts["t"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const signedPayload = `${ts}.${rawBody}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
  } catch {
    return false;
  }
}

type StripeSubscription = {
  id: string;
  customer: string;
  status: string;
  current_period_end: number;
  metadata: { plan?: string; slack_team_id?: string };
  items: { data: { price: { id: string } }[] };
};

type StripeEvent = {
  id: string;
  type: string;
  data: { object: StripeSubscription | { customer?: string; subscription?: string; metadata?: Record<string, string>; client_reference_id?: string } };
};

export async function POST(req: Request) {
  const rawBody = await req.text(); // raw body required for signature
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "config" }, { status: 500 });
  }
  if (!verifyStripeSignature(rawBody, sig, secret)) {
    return new NextResponse("invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody) as StripeEvent;

  try {
    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
      const sub = event.data.object as StripeSubscription;
      const teamId = sub.metadata.slack_team_id ?? null;
      await sbInsert(
        "mint_agent_subscriptions",
        {
          stripe_subscription_id: sub.id,
          stripe_customer_id: sub.customer,
          team_id: teamId,
          plan: sub.metadata.plan ?? null,
          status: sub.status,
          current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        },
        { onConflict: "stripe_subscription_id", returning: false },
      );
    } else if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as StripeSubscription;
      await sbUpdate("mint_agent_subscriptions", {
        stripe_subscription_id: `eq.${sub.id}`,
      }, { status: "canceled" });
    }
  } catch (e) {
    console.error("[stripe:webhook-handler]", e);
    return NextResponse.json({ error: "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
