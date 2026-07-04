"use client";

import { useState } from "react";

export default function RsvpForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"yes" | "no" | "maybe">("yes");
  const [guestsCount, setGuestsCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/rsvp/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status, guestsCount }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-emerald-50 p-6 text-center text-emerald-800">
        <p className="text-lg font-medium">Thank you, {name}!</p>
        <p className="mt-1 text-sm">Your RSVP has been recorded.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700">Your name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Will you attend?</label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["yes", "maybe", "no"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setStatus(option)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                status === option
                  ? "border-rose-400 bg-rose-50 text-rose-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {status !== "no" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Number of guests</label>
          <input
            type="number"
            min={1}
            max={20}
            value={guestsCount}
            onChange={(e) => setGuestsCount(Number(e.target.value))}
            className="mt-1 w-24 rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-rose-500 px-4 py-2.5 font-medium text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Send RSVP"}
      </button>
    </form>
  );
}
