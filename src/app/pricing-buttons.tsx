"use client";

import { useState } from "react";

export function PricingCheckoutButton({
  plan,
  label,
  highlight,
}: {
  plan: "solo" | "team";
  label: string;
  highlight?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function go() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await r.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? "失敗");
        setLoading(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "失敗");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={go}
        disabled={loading}
        className={`w-full rounded-xl px-5 py-3 text-sm font-bold transition-colors disabled:opacity-50 ${
          highlight
            ? "bg-emerald-400 text-black hover:bg-emerald-300"
            : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
        }`}
      >
        {loading ? "処理中..." : label}
      </button>
      {error && <div className="mt-2 text-xs text-red-400">{error}</div>}
    </div>
  );
}
