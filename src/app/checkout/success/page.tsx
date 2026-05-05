import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-32 text-center text-white">
      <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-3xl text-emerald-400">
        ✓
      </div>
      <h1 className="mb-4 text-4xl font-bold">課金開始ありがとう</h1>
      <p className="mb-8 text-lg text-white/70">
        Mint Agent の有料プランがアクティブになった。
        Slack で <code className="rounded bg-white/10 px-2 py-0.5">@Mint</code> を呼んで話しかけてみて。
      </p>
      <Link
        href="/install"
        className="inline-flex rounded-xl bg-emerald-400 px-6 py-4 font-bold text-black hover:bg-emerald-300"
      >
        Slack に追加する →
      </Link>
    </main>
  );
}
