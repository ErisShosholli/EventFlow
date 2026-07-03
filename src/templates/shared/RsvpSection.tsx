"use client";

import { useState } from "react";
import { RsvpStatus } from "@/generated/prisma/enums";

function buildWhatsappHref(whatsappNumber: string, eventTitle: string) {
  const digits = whatsappNumber.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(`Hi! I'd like to RSVP for ${eventTitle}.`);
  return `https://wa.me/${digits}?text=${message}`;
}

export function RsvpSection({
  eventTitle,
  whatsappNumber,
  buttonClassName,
  activeButtonClassName,
}: {
  eventTitle: string;
  whatsappNumber?: string | null;
  buttonClassName: string;
  activeButtonClassName: string;
}) {
  const [selected, setSelected] = useState<RsvpStatus | null>(null);

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
            onClick={() => setSelected(option)}
            className={selected === option ? activeButtonClassName : buttonClassName}
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <p className="text-xs opacity-70">
          RSVP form submission ships in a later build step.
        </p>
      )}
    </div>
  );
}
