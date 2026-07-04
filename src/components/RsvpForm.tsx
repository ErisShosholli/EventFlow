"use client";

import { useState } from "react";
import { IconCheck, IconQuestion, IconX } from "@/components/icons";

const STATUS_OPTIONS = [
  { value: "yes", label: "Yes", icon: IconCheck },
  { value: "maybe", label: "Maybe", icon: IconQuestion },
  { value: "no", label: "No", icon: IconX },
] as const;

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
      <div
        role="status"
        className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center text-emerald-800"
      >
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <IconCheck className="h-5 w-5 text-emerald-700" />
        </span>
        <p className="mt-3 font-display text-xl font-semibold">Thank you, {name}!</p>
        <p className="mt-1 text-sm">Your RSVP has been recorded.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6 text-left">
      <div>
        <label htmlFor="rsvp-name" className="label">
          Your name <span aria-hidden className="text-primary">*</span>
        </label>
        <input
          id="rsvp-name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="Jane Doe"
        />
      </div>

      <fieldset>
        <legend className="label">Will you attend?</legend>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              aria-pressed={status === option.value}
              className={`chip ${
                status === option.value ? "chip-selected" : "chip-unselected"
              }`}
            >
              <option.icon className="mr-1.5 h-4 w-4" />
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>

      {status !== "no" && (
        <div>
          <label htmlFor="rsvp-guests" className="label">
            Number of guests
          </label>
          <input
            id="rsvp-guests"
            type="number"
            min={1}
            max={20}
            value={guestsCount}
            onChange={(e) => setGuestsCount(Number(e.target.value))}
            className="input w-28 tabular-nums"
          />
          <p className="mt-1.5 text-xs text-stone-500">Including yourself.</p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Submitting…" : "Send RSVP"}
      </button>
    </form>
  );
}
