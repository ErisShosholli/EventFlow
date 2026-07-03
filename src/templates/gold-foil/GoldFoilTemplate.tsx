"use client";

import type { TemplateProps } from "@/templates/types";
import { EnvelopeReveal } from "@/templates/shared/EnvelopeReveal";
import { EventDetails } from "@/templates/shared/EventDetails";
import { RsvpSection } from "@/templates/shared/RsvpSection";
import { PhotoGallery } from "@/templates/shared/PhotoGallery";

export function GoldFoilTemplate({ event }: TemplateProps) {
  return (
    <EnvelopeReveal
      eventTitle={event.title}
      wrapperClassName="bg-black font-serif text-amber-100"
      sealClassName="bg-black"
      buttonClassName="rounded-none border border-amber-400 px-8 py-3 text-xs uppercase tracking-[0.4em] text-amber-300 hover:bg-amber-400 hover:text-black transition-colors"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-12 px-4 py-24 text-center">
        <div className="rounded-sm border border-amber-500/60 px-10 py-8">
          <p className="mb-3 text-xs uppercase tracking-[0.5em] text-amber-500">
            Together with joy
          </p>
          <h1 className="text-4xl italic text-amber-200">{event.title}</h1>
        </div>

        {event.description && (
          <p className="max-w-md text-amber-100/70 italic">
            {event.description}
          </p>
        )}

        <EventDetails
          eventDate={event.eventDate}
          location={event.location}
          accentClassName="text-amber-400"
        />

        <section className="w-full">
          <h2 className="mb-6 text-xs uppercase tracking-[0.4em] text-amber-500">
            Will you join us?
          </h2>
          <RsvpSection
            eventTitle={event.title}
            whatsappNumber={event.whatsappNumber}
            buttonClassName="rounded-none border border-amber-500/60 px-4 py-2 text-xs uppercase tracking-widest text-amber-300 hover:border-amber-400 transition-colors"
            activeButtonClassName="rounded-none border border-amber-400 bg-amber-400 px-4 py-2 text-xs uppercase tracking-widest text-black"
          />
        </section>

        <section className="w-full">
          <h2 className="mb-6 text-xs uppercase tracking-[0.4em] text-amber-500">
            Gallery
          </h2>
          <PhotoGallery photos={event.photos} />
        </section>
      </div>
    </EnvelopeReveal>
  );
}
