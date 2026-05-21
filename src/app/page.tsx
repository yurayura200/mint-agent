import Link from "next/link";
import { WaitlistForm } from "./waitlist-form";
import { PricingCheckoutButton } from "./pricing-buttons";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Hero — Yura 一人称、3 行で簡潔 */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="mx-auto max-w-3xl px-6 pt-24 pb-16 sm:px-8 sm:pt-32 sm:pb-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Closed Beta
          </div>
          <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-5xl sm:leading-[1.1]">
            Slack で頼める
            <br />
            業務代行 AI。
          </h1>
          <p className="mb-10 text-base text-white/65 sm:text-lg">
            議事録・問い合わせ返信・数字集計。<br />
            Slack の中で <span className="text-emerald-400">@Mint</span> に頼めば、そのまま返ってくる。
          </p>
          <WaitlistForm />
          <p className="mt-4 text-xs text-white/40">
            ベータ案内のみ送ります。
          </p>
        </div>
      </section>

      {/* できること — 3 つに絞る */}
      <section className="border-b border-white/5 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-2xl font-bold sm:text-3xl">できること</h2>
          <div className="space-y-6">
            {[
              {
                cmd: "@Mint 今日の MTG 録音 → 議事録 → CRM",
                action: "文字起こし → 議事録整形 → 担当者判定 → Salesforce / HubSpot に追加。",
              },
              {
                cmd: "@Mint この問い合わせ、過去履歴見て返信 draft",
                action: "Gmail / CS ツールから過去会話取得 → 文脈を踏まえた返信 draft を CS チャンネルに投稿。",
              },
              {
                cmd: "@Mint 今月の数字まとめて月曜朝に投稿",
                action: "Stripe / GA / PostHog から数字取得 → 表とインサイトを自動投稿。",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="border-b border-white/10 bg-black/40 px-5 py-3 font-mono text-sm text-emerald-400">
                  {item.cmd}
                </div>
                <div className="px-5 py-4 text-sm text-white/70">
                  → {item.action}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/50">
            他にも領収書 OCR、競合 watch、Notion 投稿などを Slack 内で完結できます。
          </p>
        </div>
      </section>

      {/* 料金 */}
      <section className="border-b border-white/5 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-2xl font-bold sm:text-3xl">料金</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                name: "Free",
                price: "¥0",
                cta: { type: "link" as const, label: "Slack に追加", href: "/install" },
                features: [
                  "月 20 タスク",
                  "Slack 連携",
                ],
              },
              {
                name: "Solo",
                price: "¥9,800",
                priceUnit: "/月",
                highlight: true,
                cta: { type: "checkout" as const, plan: "solo" as const, label: "Solo を始める" },
                features: [
                  "月 500 タスク",
                  "Notion + Gmail 連携",
                  "優先サポート",
                ],
              },
              {
                name: "Team",
                price: "¥29,800",
                priceUnit: "/月",
                cta: { type: "checkout" as const, plan: "team" as const, label: "Team を始める" },
                features: [
                  "月 3,000 タスク",
                  "5 メンバー",
                  "Salesforce / HubSpot",
                  "個別オンボーディング",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 sm:p-7 ${
                  plan.highlight
                    ? "border-2 border-emerald-400 bg-emerald-500/5"
                    : "border border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="mb-2 text-base font-bold">{plan.name}</div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold sm:text-4xl">{plan.price}</span>
                  {plan.priceUnit && (
                    <span className="text-sm text-white/50">{plan.priceUnit}</span>
                  )}
                </div>
                <ul className="mb-6 space-y-2 text-sm text-white/70">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1 text-emerald-400">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.cta.type === "link" ? (
                  <Link
                    href={plan.cta.href}
                    className="block w-full rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-bold text-white transition-colors hover:bg-white/10"
                  >
                    {plan.cta.label}
                  </Link>
                ) : (
                  <PricingCheckoutButton
                    plan={plan.cta.plan}
                    label={plan.cta.label}
                    highlight={plan.highlight}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* セキュリティ — 1 段落で簡潔 */}
      <section className="border-b border-white/5 px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">データとセキュリティ</h2>
          <p className="text-sm leading-loose text-white/70 sm:text-base">
            決済は Stripe（PCI DSS 準拠）。カード情報は保存されません。
            Slack で読むのは <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs">@Mint</code> をメンションされたチャンネルだけで、プライベート DM は読みません。
            処理に必要な要旨のみ Supabase に保存し、AI 学習用には使用しません。解約後 30 日で完全削除します。
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
            ベータ案内を受け取る
          </h2>
          <p className="mb-10 text-base text-white/60">
            正式リリース時にメールでお知らせします。
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12 sm:px-8">
        <div className="mx-auto max-w-3xl text-center text-sm text-white/40">
          <div className="mb-4">Mint Agent</div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            <a
              href="https://x.com/komugilab00"
              className="hover:text-white/80"
            >
              X / @komugilab00
            </a>
            <a
              href="https://note.com/komugilab"
              className="hover:text-white/80"
            >
              note
            </a>
            <a
              href="mailto:info@komugi-ai.jp"
              className="hover:text-white/80"
            >
              お問い合わせ
            </a>
            <a
              href="/legal/privacy"
              className="hover:text-white/80"
            >
              プライバシーポリシー
            </a>
            <a
              href="/legal/tokushoho"
              className="hover:text-white/80"
            >
              特定商取引法に基づく表記
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
