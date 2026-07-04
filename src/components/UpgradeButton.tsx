"use client";

import { useState } from "react";
import { IconSparkles } from "@/components/icons";

export default function UpgradeButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upgrade unavailable right now");

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upgrade unavailable right now");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleUpgrade}
        disabled={loading}
        className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-yellow-800 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
      >
        <IconSparkles className="h-4 w-4" />
        {loading ? "Redirecting…" : "Upgrade to Pro"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
