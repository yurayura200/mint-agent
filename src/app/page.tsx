import Link from "next/link";
import { WaitlistForm } from "./waitlist-form";
import { PricingCheckoutButton } from "./pricing-buttons";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-20 sm:px-8 sm:pt-32 sm:pb-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Closed Beta — Waitlist Open
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-6xl sm:leading-[1.05]">
            Slack で <span className="text-emerald-400">@AI</span> に話しかけて
            <br />
            業務代行する。
          </h1>
          <p className="mb-10 max-w-2xl text-lg text-white/70 sm:text-xl">
            議事録投稿・メール返信・データ集計・競合 watch。
            <br />
            毎日繰り返してる定型業務を、Slack 内で AI が全部やる。
          </p>
          <WaitlistForm />
          <p className="mt-4 text-xs text-white/40">
            ベータ案内のみメールでお送りします。スパム送りません。
          </p>
        </div>
      </section>

      {/* Problem */}
      <section className="border-b border-white/5 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-3xl font-bold sm:text-4xl">
            こんな <span className="text-emerald-400">"地味に重い作業"</span>{" "}
            に時間使ってない？
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "議事録",
                body: "毎週の MTG → 議事録 → Slack 投稿 → CRM 入力。1MTG あたり 30分かかる。",
              },
              {
                title: "メール返信",
                body: "問い合わせメール → 過去履歴調べ → draft 書く。1件 10分。月100件で 17時間。",
              },
              {
                title: "データ集計",
                body: "Stripe / GA / Slack / Notion から数字集めて Excel。週1で 2時間。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <div className="mb-2 text-xl font-bold text-emerald-400">
                  {item.title}
                </div>
                <p className="text-sm leading-relaxed text-white/70">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-b border-white/5 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Slack で <span className="text-emerald-400">@Mint</span> に話しかけるだけ。
          </h2>
          <p className="mb-12 max-w-2xl text-lg text-white/60">
            CRM・カレンダー・Notion・Excel・GA を切り替える時代は終わり。
          </p>
          <div className="space-y-4">
            {[
              {
                cmd: "@Mint 今日の MTG 録音 → 議事録 → 担当割り振り → CRM",
                action: "Whisper で文字起こし → Claude で議事録整形 → 担当者を判定 → Salesforce/HubSpot に行追加",
              },
              {
                cmd: "@Mint この問い合わせメール、過去履歴見て返信 draft",
                action: "顧客の過去会話を Gmail/CS ツールから取得 → 文脈考慮した返信 draft → CS channel に投稿",
              },
              {
                cmd: "@Mint 今月の数字まとめて月曜朝に投稿",
                action: "Stripe/GA/PostHog から数字取得 → 表とインサイトで自動投稿 → 月初の朝1で",
              },
              {
                cmd: "@Mint 競合 X 社の最新ニュース、毎週月曜にまとめて",
                action: "Web 検索 + プレスリリース watch → 動向まとめ → #competitor channel",
              },
              {
                cmd: "@Mint 領収書写真 → 仕訳 → 経理 channel",
                action: "OCR → 勘定科目判定 → freee/MF 連携 or Excel 行追加",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="border-b border-white/10 bg-black/40 px-6 py-3 font-mono text-sm text-emerald-400">
                  {item.cmd}
                </div>
                <div className="px-6 py-4 text-sm text-white/70">
                  → {item.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who */}
      <section className="border-b border-white/5 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-3xl font-bold sm:text-4xl">こんな人向け</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <div className="mb-3 text-xl font-bold">個人開発・SaaS 創業者</div>
              <p className="text-sm leading-relaxed text-white/70">
                プロダクト作るのに集中したい。MTG 議事録・問い合わせ対応・営業準備の "事務" は
                AI に任せたい。月¥9,800 で 1人雇うより安い。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <div className="mb-3 text-xl font-bold">5-30人規模のチーム</div>
              <p className="text-sm leading-relaxed text-white/70">
                CS・営業・経理・採用 の業務を Slack 内で完結したい。各部署の Slack channel に
                @Mint を呼んでもらえば、その場で全部処理。SaaS の hop が消える。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b border-white/5 px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-3xl font-bold sm:text-4xl">料金</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                name: "Free",
                price: "¥0",
                cta: { type: "link" as const, label: "Slack に追加", href: "/install" },
                features: [
                  "月20タスクまで",
                  "Slack 連携",
                  "コミュニティサポート",
                ],
              },
              {
                name: "Solo",
                price: "¥9,800",
                priceUnit: "/月",
                highlight: true,
                cta: { type: "checkout" as const, plan: "solo" as const, label: "Solo を始める" },
                features: [
                  "月500タスク",
                  "Slack + Notion + Gmail",
                  "カスタムワークフロー",
                  "優先サポート",
                ],
              },
              {
                name: "Team",
                price: "¥29,800",
                priceUnit: "/月",
                cta: { type: "checkout" as const, plan: "team" as const, label: "Team を始める" },
                features: [
                  "月3,000タスク",
                  "5メンバーまで",
                  "全 SaaS 連携",
                  "Salesforce / HubSpot",
                  "個別オンボーディング",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 ${
                  plan.highlight
                    ? "border-2 border-emerald-400 bg-emerald-500/5"
                    : "border border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="mb-2 text-lg font-bold">{plan.name}</div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.priceUnit && (
                    <span className="text-sm text-white/50">
                      {plan.priceUnit}
                    </span>
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
          <p className="mt-8 text-sm text-white/40">
            Enterprise / SSO / 専用ホスティング が必要な場合は X DM @mintnekoneko0
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
            ベータ案内を受け取る
          </h2>
          <p className="mb-10 text-lg text-white/60">
            β版リリース時にメールでお知らせします。
            <br />
            Free tier 開放時の優先招待つき。
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-white/40">
          <div className="mb-4">
            Mint Agent · A product by{" "}
            <a
              href="https://komugi-ai.jp"
              className="text-white/60 hover:text-white"
            >
              komugi-ai
            </a>
          </div>
          <div className="flex justify-center gap-6 text-xs">
            <a
              href="https://x.com/mintnekoneko0"
              className="hover:text-white/80"
            >
              X / @mintnekoneko0
            </a>
            <a
              href="https://note.com/mintototo1"
              className="hover:text-white/80"
            >
              note / Build Log
            </a>
            <a
              href="https://komugi-ai.jp/realestate"
              className="hover:text-white/80"
            >
              VideoTracker
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
