"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PublishButton({
  eventId,
  disabled,
  disabledReason,
}: {
  eventId: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/events/${eventId}/publish`, { method: "POST" });
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
        disabled={disabled || loading}
        title={disabled ? disabledReason : undefined}
        className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        {loading ? "Redirecting..." : "Publish"}
      </button>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
