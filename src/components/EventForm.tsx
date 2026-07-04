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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700">Event title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sara & Alex's Wedding"
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Message / description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Join us as we celebrate..."
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date & time</label>
          <input
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Grand Hall, Lisbon"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Theme</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                theme === t.value
                  ? "border-rose-400 bg-rose-50 text-rose-700"
                  : "border-gray-300 text-gray-600 hover:border-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-rose-500 px-4 py-2.5 font-medium text-white transition hover:bg-rose-600 disabled:opacity-60"
      >
        {submitting ? "Creating…" : "Create event"}
      </button>
    </form>
  );
}
