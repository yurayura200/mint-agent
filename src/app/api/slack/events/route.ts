import { NextResponse } from "next/server";
import { verifySlackSignature, postSlackMessage } from "@/lib/slack";
import { sbSelect } from "@/lib/supabase";

type SlackEventCallback = {
  type: "event_callback";
  team_id: string;
  event: {
    type: string;
    text?: string;
    user?: string;
    channel?: string;
    ts?: string;
    thread_ts?: string;
    bot_id?: string;
  };
};
type SlackUrlVerification = {
  type: "url_verification";
  challenge: string;
};
type SlackPayload = SlackEventCallback | SlackUrlVerification;

type WorkspaceRow = {
  team_id: string;
  bot_token: string;
  bot_user_id: string;
};

export async function POST(req: Request) {
  const rawBody = await req.text();
  const ts = req.headers.get("x-slack-request-timestamp");
  const sig = req.headers.get("x-slack-signature");

  if (!ts || !sig || !verifySlackSignature(rawBody, ts, sig)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody) as SlackPayload;

  // URL verification handshake
  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  if (payload.type === "event_callback") {
    // Debug mode: ?debug=1 で同期実行し結果を返す
    const url = new URL(req.url);
    if (url.searchParams.get("debug") === "1") {
      try {
        const result = await handleEvent(payload);
        return NextResponse.json({ ok: true, debug: result });
      } catch (e) {
        return NextResponse.json({
          ok: true,
          debug_error: e instanceof Error ? e.message : String(e),
          stack: e instanceof Error ? e.stack?.slice(0, 800) : undefined,
        });
      }
    }
    // Production: ack fast, process async
    queueMicrotask(() => handleEvent(payload).catch((e) => console.error("[slack:event-error]", e)));
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

async function handleEvent(payload: SlackEventCallback): Promise<Record<string, unknown>> {
  const { team_id, event } = payload;
  const debug: Record<string, unknown> = {
    event_type: event.type,
    channel_type: (event as { channel_type?: string }).channel_type,
    team_id,
  };

  const isMention = event.type === "app_mention";
  const isDM = event.type === "message" && (event as { channel_type?: string }).channel_type === "im";
  debug.isMention = isMention;
  debug.isDM = isDM;

  if (!isMention && !isDM) {
    debug.skipped = "not_mention_or_dm";
    return debug;
  }
  if (event.bot_id) {
    debug.skipped = "from_bot";
    return debug;
  }
  if (!event.text || !event.channel) {
    debug.skipped = "no_text_or_channel";
    return debug;
  }

  const rows = await sbSelect<WorkspaceRow>("mint_agent_workspaces", {
    team_id: `eq.${team_id}`,
  });
  debug.ws_lookup_count = rows.length;
  const ws = rows[0];
  if (!ws) {
    debug.skipped = "workspace_not_found";
    console.error("[slack] workspace not found", team_id);
    return debug;
  }
  debug.ws_team = ws.team_id;
  debug.bot_token_prefix = ws.bot_token.slice(0, 20);

  const prompt = event.text.replace(/<@[A-Z0-9]+>\s*/g, "").trim();
  debug.prompt = prompt;

  if (!prompt) {
    const r = await postSlackMessage(
      ws.bot_token,
      event.channel,
      "話しかけてくれてありがとう。何やればいい？",
      event.thread_ts ?? event.ts,
    );
    debug.empty_post_result = r;
    return debug;
  }

  const reply = await generateReply(prompt);
  debug.reply_length = reply.length;
  debug.reply_preview = reply.slice(0, 200);

  const postResult = await postSlackMessage(
    ws.bot_token,
    event.channel,
    reply,
    event.thread_ts ?? event.ts,
  );
  debug.post_result = postResult;
  return debug;
}

async function generateReply(prompt: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return `(beta) "${prompt}" を受け取った。フル機能は近日リリース。`;
  }

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system:
          "You are Mint Agent, a Slack-resident AI assistant for solo founders and small teams. Reply in Japanese unless user writes in English. Be concise (under 5 lines). When the user requests an action (e.g. 議事録投稿, メール返信, データ集計), explain what you would do step-by-step. Currently in beta — implementation coming soon for actual integrations.",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      console.error("[claude:error]", r.status, t);
      return `(beta エラー) ${prompt} の処理に失敗。原因調査中。`;
    }
    const data = (await r.json()) as { content: { type: string; text: string }[] };
    const text = data.content.find((c) => c.type === "text")?.text ?? "";
    return text || "（応答なし）";
  } catch (e) {
    console.error("[claude:exception]", e);
    return "(beta 一時エラー) もう一度試して";
  }
}
