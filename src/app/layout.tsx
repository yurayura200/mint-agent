import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mint Agent — Slack で @AI に話しかけて業務代行",
  description:
    "議事録投稿・メール返信・データ集計が Slack 内で完結。@AI に話しかけるだけで業務が回る AI Agent。Free tier あり。",
  openGraph: {
    title: "Mint Agent — Slack 業務代行 AI",
    description:
      "@AI 議事録投稿して。@AI 返信 draft 作って。@AI 競合の最新ニュースまとめて。— Slack で全部完結。",
    url: "https://agent.komugi-ai.jp",
    siteName: "Mint Agent",
    locale: "ja_JP",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full bg-[#0d0d0d] text-white">{children}</body>
    </html>
  );
}
