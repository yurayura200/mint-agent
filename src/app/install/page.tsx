import Link from "next/link";

const SCOPES = [
  "app_mentions:read",
  "channels:history",
  "channels:read",
  "chat:write",
  "groups:history",
  "groups:read",
  "im:history",
  "im:read",
  "im:write",
  "users:read",
].join(",");

export default function InstallPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return <InstallPageInner searchParams={searchParams} />;
}

async function InstallPageInner({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const clientId = process.env.SLACK_CLIENT_ID;
  const oauthUrl = clientId
    ? `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${SCOPES}&redirect_uri=${encodeURIComponent("https://agent.komugi-ai.jp/api/slack/callback")}`
    : null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 text-white">
      <Link href="/" className="text-sm text-white/40 hover:text-white">
        ← back
      </Link>
      <h1 className="mt-8 mb-6 text-4xl font-bold">Install Mint Agent</h1>

      {sp.error && (
        <div className="mb-6 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          エラー：{sp.error}
        </div>
      )}

      <p className="mb-10 text-lg text-white/70">
        Slack ワークスペースに Mint Agent を追加します。
        <br />
        追加後、任意の channel で <code className="rounded bg-white/10 px-2 py-0.5">@Mint</code> に話しかけて使えます。
      </p>

      {oauthUrl ? (
        <a
          href={oauthUrl}
          className="inline-flex items-center gap-3 rounded-xl bg-emerald-400 px-6 py-4 text-base font-bold text-black transition-colors hover:bg-emerald-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 122.8 122.8"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zM32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
              fill="#E01E5A"
            />
            <path
              d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zM45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
              fill="#36C5F0"
            />
            <path
              d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zM90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
              fill="#2EB67D"
            />
            <path
              d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zM77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
              fill="#ECB22E"
            />
          </svg>
          Add to Slack
        </a>
      ) : (
        <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-6 py-5 text-amber-300">
          <div className="font-bold">Slack 連携セットアップ中</div>
          <p className="mt-2 text-sm">
            Slack App 作成後、SLACK_CLIENT_ID 環境変数を設定すると "Add to Slack" ボタンが有効化されます。
          </p>
        </div>
      )}

      <div className="mt-12 space-y-2 text-sm text-white/50">
        <div>含まれる権限スコープ：</div>
        <ul className="ml-6 list-disc space-y-1">
          <li>app_mentions:read — @Mint の呼び出しを受信</li>
          <li>chat:write — channel への返信</li>
          <li>channels:read / groups:read — channel 情報取得</li>
          <li>im:history / im:write — DM 対応</li>
          <li>users:read — メンバー情報取得</li>
        </ul>
      </div>
    </main>
  );
}
