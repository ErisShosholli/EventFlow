"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const THEMES = [
  { value: "classic", label: "Classic" },
  { value: "romantic", label: "Romantic" },
  { value: "modern", label: "Modern" },
  { value: "festive", label: "Festive" },
];

export default function EventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [theme, setTheme] = useState("classic");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, location, theme }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const event = await res.json();
      router.push(`/dashboard/events/${event.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-5 p-6">
      <div>
        <label htmlFor="event-title" className="label">
          Event title <span aria-hidden className="text-primary">*</span>
        </label>
        <input
          id="event-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sara & Alex's Wedding"
          className="input"
        />
      </div>

      <div>
        <label htmlFor="event-description" className="label">
          Message / description
        </label>
        <textarea
          id="event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Join us as we celebrate..."
          className="input min-h-24"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="event-date" className="label">
            Date &amp; time <span aria-hidden className="text-primary">*</span>
          </label>
          <input
            id="event-date"
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label htmlFor="event-location" className="label">
            Location
          </label>
          <input
            id="event-location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Grand Hall, Lisbon"
            className="input"
          />
        </div>
      </div>

      <fieldset>
        <legend className="label">Theme</legend>
        <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              aria-pressed={theme === t.value}
              className={`chip ${theme === t.value ? "chip-selected" : "chip-unselected"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Creating…" : "Create event"}
      </button>
    </form>
  );
}
