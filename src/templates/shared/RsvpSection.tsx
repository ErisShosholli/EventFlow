"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RsvpStatus } from "@/generated/prisma/enums";
import { rsvpFormSchema, type RsvpFormInput } from "@/lib/schemas/rsvp";

const STATUS_LABELS: Record<RsvpStatus, string> = {
  [RsvpStatus.YES]: "Yes",
  [RsvpStatus.MAYBE]: "Maybe",
  [RsvpStatus.NO]: "No",
};

const GUEST_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);

// Inherits the template's text color so the form fits every renderer without
// per-template styling props.
const inputClassName =
  "w-full rounded-md border border-current/30 bg-transparent px-3 py-2 text-sm focus:border-current focus:outline-none";

function buildWhatsappHref(whatsappNumber: string, eventTitle: string) {
  const digits = whatsappNumber.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(`Hi! I'd like to RSVP for ${eventTitle}.`);
  return `https://wa.me/${digits}?text=${message}`;
}

export function RsvpSection({
  eventId,
  eventTitle,
  whatsappNumber,
  buttonClassName,
  activeButtonClassName,
}: {
  eventId: string;
  eventTitle: string;
  whatsappNumber?: string | null;
  buttonClassName: string;
  activeButtonClassName: string;
}) {
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormInput>({
    resolver: zodResolver(rsvpFormSchema),
    defaultValues: { guestsCount: 1 },
  });

  const onSubmit = async (data: RsvpFormInput) => {
    if (!status) return;
    setFormError(null);

    const res = await fetch(`/api/events/${eventId}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        status,
        guestsCount: status === RsvpStatus.NO ? 1 : data.guestsCount,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setFormError(body?.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="mx-auto max-w-xs text-sm opacity-80">
        Thank you! Your RSVP has been recorded.
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-xs flex-col items-center gap-4">
      {whatsappNumber && (
        <a
          href={buildWhatsappHref(whatsappNumber, eventTitle)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClassName}
        >
          RSVP via WhatsApp
        </a>
      )}

      <div className="flex gap-2">
        {([RsvpStatus.YES, RsvpStatus.MAYBE, RsvpStatus.NO] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setStatus(option)}
            className={status === option ? activeButtonClassName : buttonClassName}
          >
            {STATUS_LABELS[option]}
          </button>
        ))}
      </div>

      {status && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-3 text-left"
          noValidate
        >
          <div>
            <label
              htmlFor="rsvp-name"
              className="mb-1 block text-xs uppercase tracking-wider opacity-70"
            >
              Your name
            </label>
            <input
              id="rsvp-name"
              type="text"
              autoComplete="name"
              className={inputClassName}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {status !== RsvpStatus.NO && (
            <div>
              <label
                htmlFor="rsvp-guests"
                className="mb-1 block text-xs uppercase tracking-wider opacity-70"
              >
                Number of guests
              </label>
              <select
                id="rsvp-guests"
                className={inputClassName}
                {...register("guestsCount", { valueAsNumber: true })}
              >
                {GUEST_OPTIONS.map((count) => (
                  <option key={count} value={count} className="text-black">
                    {count}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formError && <p className="text-xs text-red-500">{formError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${activeButtonClassName} disabled:opacity-50`}
          >
            {isSubmitting ? "Sending..." : "Send RSVP"}
          </button>
        </form>
      )}
    </div>
  );
}
