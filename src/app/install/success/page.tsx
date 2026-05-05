import Link from "next/link";

export default function InstallSuccess() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-32 text-center text-white">
      <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl text-emerald-400">
        ✓
      </div>
      <h1 className="mb-4 text-4xl font-bold">Slack に追加できた</h1>
      <p className="mb-8 text-lg text-white/70">
        任意の channel で <code className="rounded bg-white/10 px-2 py-0.5">@Mint</code> を呼び出して話しかけてみて。
      </p>
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left">
        <div className="mb-3 text-sm text-white/50">試してみるコマンド例</div>
        <div className="space-y-2 font-mono text-sm">
          <div className="text-emerald-400">
            @Mint 今日の MTG の議事録テンプレ作って
          </div>
          <div className="text-emerald-400">
            @Mint この問い合わせ、過去履歴見て返信 draft
          </div>
          <div className="text-emerald-400">
            @Mint 今月の数字まとめて
          </div>
        </div>
      </div>
      <p className="mt-8 text-sm text-white/40">
        ベータ期間中は Free（月20タスクまで）。
        プランアップグレードは <Link href="/" className="text-emerald-400 hover:underline">ホーム</Link> から。
      </p>
    </main>
  );
}
