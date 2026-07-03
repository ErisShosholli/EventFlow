"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UnlockTemplateButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/events/${eventId}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentType: "TEMPLATE" }),
    });
    const body = await res.json().catch(() => null);

    if (!res.ok) {
      setLoading(false);
      setError(body?.error ?? "Something went wrong");
      return;
    }

    if (body?.checkoutUrl) {
      window.location.href = body.checkoutUrl;
      return;
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium disabled:opacity-40"
      >
        {loading ? "Redirecting..." : "Unlock premium template"}
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
