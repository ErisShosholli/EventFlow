"use client";

import type { TemplateProps } from "@/templates/types";
import { EnvelopeReveal } from "@/templates/shared/EnvelopeReveal";
import { EventDetails } from "@/templates/shared/EventDetails";
import { RsvpSection } from "@/templates/shared/RsvpSection";
import { PhotoGallery } from "@/templates/shared/PhotoGallery";

export function ClassicTemplate({ event }: TemplateProps) {
  return (
    <EnvelopeReveal
      eventTitle={event.title}
      wrapperClassName="bg-amber-50 font-serif text-stone-800"
      sealClassName="bg-amber-50"
      buttonClassName="rounded-full border border-stone-400 px-6 py-2 text-sm tracking-wide hover:bg-stone-800 hover:text-amber-50 transition-colors"
    >
      <div className="mx-auto flex max-w-xl flex-col items-center gap-12 px-4 py-20 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-px w-16 bg-stone-400" />
          <h1 className="text-4xl font-medium">{event.title}</h1>
          <div className="h-px w-16 bg-stone-400" />
        </div>

        {event.description && (
          <p className="max-w-md text-stone-600 italic">{event.description}</p>
        )}

        <EventDetails eventDate={event.eventDate} location={event.location} />

        <section className="w-full">
          <h2 className="mb-6 text-sm uppercase tracking-[0.3em] text-stone-500">
            Will you join us?
          </h2>
          <RsvpSection
            eventId={event.id}
            eventTitle={event.title}
            whatsappNumber={event.whatsappNumber}
            buttonClassName="rounded-full border border-stone-400 px-4 py-2 text-sm hover:bg-stone-800 hover:text-amber-50 transition-colors"
            activeButtonClassName="rounded-full border border-stone-800 bg-stone-800 px-4 py-2 text-sm text-amber-50"
          />
        </section>

        <section className="w-full">
          <h2 className="mb-6 text-sm uppercase tracking-[0.3em] text-stone-500">
            Gallery
          </h2>
          <PhotoGallery photos={event.photos} />
        </section>
      </div>
    </EnvelopeReveal>
  );
}
