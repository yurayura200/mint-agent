import { NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/slack";
import { sbInsert } from "@/lib/supabase";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/install?error=${encodeURIComponent(error)}`, url),
    );
  }
  if (!code) {
    return NextResponse.redirect(new URL("/install?error=no_code", url));
  }

  try {
    const data = await exchangeCodeForToken(code);
    await sbInsert("mint_agent_workspaces", {
      team_id: data.team.id,
      team_name: data.team.name,
      bot_token: data.access_token,
      bot_user_id: data.bot_user_id,
      app_id: data.app_id,
      installed_user_id: data.authed_user.id,
    }, { onConflict: "team_id" });

    return NextResponse.redirect(new URL("/install/success", url));
  } catch (e) {
    console.error("[slack:callback]", e);
    return NextResponse.redirect(
      new URL(
        `/install?error=${encodeURIComponent(e instanceof Error ? e.message : "unknown")}`,
        url,
      ),
    );
  }
}
