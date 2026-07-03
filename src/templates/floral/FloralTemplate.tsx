"use client";

import type { TemplateProps } from "@/templates/types";
import { EnvelopeReveal } from "@/templates/shared/EnvelopeReveal";
import { EventDetails } from "@/templates/shared/EventDetails";
import { RsvpSection } from "@/templates/shared/RsvpSection";
import { PhotoGallery } from "@/templates/shared/PhotoGallery";

export function FloralTemplate({ event }: TemplateProps) {
  return (
    <EnvelopeReveal
      eventTitle={event.title}
      wrapperClassName="relative overflow-hidden bg-gradient-to-b from-pink-50 via-rose-50 to-orange-50 font-sans text-rose-900"
      sealClassName="bg-transparent"
      buttonClassName="rounded-full bg-rose-400/90 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-500 transition-colors"
    >
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-rose-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-pink-200/50 blur-3xl" />

      <div className="relative mx-auto flex max-w-xl flex-col items-center gap-12 px-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-rose-300 bg-white/60">
          <div className="h-10 w-10 rounded-full bg-rose-300" />
        </div>

        <h1 className="text-4xl font-semibold text-rose-800">{event.title}</h1>

        {event.description && (
          <p className="max-w-md text-rose-700/80">{event.description}</p>
        )}

        <div className="w-full rounded-3xl bg-white/50 p-8 backdrop-blur-sm">
          <EventDetails
            eventDate={event.eventDate}
            location={event.location}
            accentClassName="text-rose-600"
          />
        </div>

        <section className="w-full">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-rose-500">
            Will you join us?
          </h2>
          <RsvpSection
            eventTitle={event.title}
            whatsappNumber={event.whatsappNumber}
            buttonClassName="rounded-full border border-rose-300 bg-white/70 px-4 py-2 text-sm text-rose-700 hover:bg-rose-100 transition-colors"
            activeButtonClassName="rounded-full bg-rose-400 px-4 py-2 text-sm text-white"
          />
        </section>

        <section className="w-full">
          <h2 className="mb-6 text-sm font-medium uppercase tracking-widest text-rose-500">
            Gallery
          </h2>
          <PhotoGallery photos={event.photos} />
        </section>
      </div>
    </EnvelopeReveal>
  );
}
