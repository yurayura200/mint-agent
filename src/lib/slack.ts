import crypto from "node:crypto";

const SLACK_SIGNING_SECRET = () => {
  const s = process.env.SLACK_SIGNING_SECRET;
  if (!s) throw new Error("SLACK_SIGNING_SECRET missing");
  return s;
};

/**
 * Verify Slack request signature.
 * Slack signs all requests with HMAC-SHA256 using SLACK_SIGNING_SECRET.
 */
export function verifySlackSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
): boolean {
  // Timestamp guard (5min window)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > 60 * 5) {
    return false;
  }
  const baseString = `v0:${timestamp}:${rawBody}`;
  const hmac = crypto.createHmac("sha256", SLACK_SIGNING_SECRET());
  hmac.update(baseString);
  const expected = `v0=${hmac.digest("hex")}`;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature),
    );
  } catch {
    return false;
  }
}

export type SlackOAuthV2Response = {
  ok: boolean;
  error?: string;
  access_token: string;
  token_type: string;
  scope: string;
  bot_user_id: string;
  app_id: string;
  team: { id: string; name: string };
  enterprise?: { id: string; name: string };
  authed_user: { id: string };
};

/** Exchange OAuth code for bot token */
export async function exchangeCodeForToken(code: string): Promise<SlackOAuthV2Response> {
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("SLACK_CLIENT_ID / SLACK_CLIENT_SECRET missing");
  }
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
  });
  const r = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = (await r.json()) as SlackOAuthV2Response;
  if (!data.ok) {
    throw new Error(`Slack OAuth failed: ${data.error}`);
  }
  return data;
}

/** Send a message to a Slack channel */
export async function postSlackMessage(
  botToken: string,
  channel: string,
  text: string,
  thread_ts?: string,
): Promise<{ ok: boolean; ts?: string; error?: string }> {
  const r = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${botToken}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, text, thread_ts }),
  });
  return r.json();
}
