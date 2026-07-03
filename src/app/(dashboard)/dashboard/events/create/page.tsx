"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createEventSchema, type CreateEventInput } from "@/lib/schemas/event";
import { TEMPLATES } from "@/templates/registry";
import { EventType } from "@/generated/prisma/enums";

const EVENT_TYPE_LABELS: Record<string, string> = {
  [EventType.WEDDING]: "Wedding",
  [EventType.ENGAGEMENT]: "Engagement",
  [EventType.BIRTHDAY]: "Birthday",
  [EventType.PARTY]: "Party",
  [EventType.OTHER]: "Other",
};

export default function CreateEventPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: { type: EventType.WEDDING, templateId: TEMPLATES[0].id },
  });

  const onSubmit = async (data: CreateEventInput) => {
    setFormError(null);

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setFormError(body?.error ?? "Something went wrong");
      return;
    }

    const { event } = await res.json();
    router.push(`/dashboard/events/${event.id}`);
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-semibold">Create an event</h1>
      <p className="mt-1 text-sm text-gray-500">
        Your event stays private until you publish it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            placeholder="Anna & Bledi's Wedding"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            {...register("title")}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium">
            Event type
          </label>
          <select
            id="type"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            {...register("type")}
          >
            {Object.values(EventType).map((value) => (
              <option key={value} value={value}>
                {EVENT_TYPE_LABELS[value]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="eventDate" className="block text-sm font-medium">
            Date &amp; time
          </label>
          <input
            id="eventDate"
            type="datetime-local"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            {...register("eventDate")}
          />
          {errors.eventDate && (
            <p className="mt-1 text-sm text-red-600">
              {errors.eventDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium">
            Location
          </label>
          <input
            id="location"
            type="text"
            placeholder="Tirana, Albania"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            {...register("location")}
          />
        </div>

        <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium">
            WhatsApp number (for RSVP)
          </label>
          <input
            id="whatsappNumber"
            type="text"
            placeholder="+355 6 9123 4567"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            {...register("whatsappNumber")}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            {...register("description")}
          />
        </div>

        <div>
          <label htmlFor="templateId" className="block text-sm font-medium">
            Template
          </label>
          <select
            id="templateId"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
            {...register("templateId")}
          >
            {TEMPLATES.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
                {template.isPremium ? " (Premium)" : ""}
              </option>
            ))}
          </select>
          {errors.templateId && (
            <p className="mt-1 text-sm text-red-600">
              {errors.templateId.message}
            </p>
          )}
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create event"}
        </button>
      </form>
    </div>
  );
}
