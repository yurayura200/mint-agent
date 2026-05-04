"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const r = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      setStatus("ok");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "送信失敗");
    }
  }

  if (status === "ok") {
    return (
      <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-4 text-emerald-300">
        <span>✓</span>
        <span>登録完了。ベータ開始時にメールします。</span>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-lg flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-base text-white outline-none placeholder:text-white/30 focus:border-emerald-400 focus:bg-white/10"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-emerald-400 px-6 py-4 text-base font-bold text-black transition-colors hover:bg-emerald-300 disabled:opacity-50"
      >
        {status === "loading" ? "登録中..." : "Waitlist 登録"}
      </button>
      {status === "error" && (
        <div className="text-sm text-red-400">{errorMsg}</div>
      )}
    </form>
  );
}
