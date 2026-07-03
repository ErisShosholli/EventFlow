"use client";

import type { TemplateProps } from "@/templates/types";
import { EnvelopeReveal } from "@/templates/shared/EnvelopeReveal";
import { EventDetails } from "@/templates/shared/EventDetails";
import { RsvpSection } from "@/templates/shared/RsvpSection";
import { PhotoGallery } from "@/templates/shared/PhotoGallery";

export function ModernTemplate({ event }: TemplateProps) {
  return (
    <EnvelopeReveal
      eventTitle={event.title}
      wrapperClassName="bg-neutral-950 font-sans text-white"
      sealClassName="bg-neutral-950"
      buttonClassName="rounded-none border border-white px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] hover:bg-white hover:text-neutral-950 transition-colors"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-14 px-4 py-24 text-center">
        <h1 className="text-5xl font-black uppercase tracking-tight">
          {event.title}
        </h1>

        {event.description && (
          <p className="max-w-md text-neutral-400">{event.description}</p>
        )}

        <div className="w-full border-t border-neutral-800 pt-10">
          <EventDetails
            eventDate={event.eventDate}
            location={event.location}
            accentClassName="text-neutral-300"
          />
        </div>

        <section className="w-full border-t border-neutral-800 pt-10">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            RSVP
          </h2>
          <RsvpSection
            eventTitle={event.title}
            whatsappNumber={event.whatsappNumber}
            buttonClassName="rounded-none border border-neutral-600 px-4 py-2 text-xs uppercase tracking-wider hover:border-white transition-colors"
            activeButtonClassName="rounded-none border border-white bg-white px-4 py-2 text-xs uppercase tracking-wider text-neutral-950"
          />
        </section>

        <section className="w-full border-t border-neutral-800 pt-10">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
            Gallery
          </h2>
          <PhotoGallery photos={event.photos} />
        </section>
      </div>
    </EnvelopeReveal>
  );
}
