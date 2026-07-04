import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RsvpForm from "@/components/RsvpForm";
import CountdownTimer from "@/components/CountdownTimer";
import { IconCalendar, IconMapPin, IconCamera, IconHeartSolid } from "@/components/icons";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event) notFound();

  const formattedDate = new Intl.DateTimeFormat("en", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(event.date);

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background px-4 py-12">
      {/* decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-40 h-80 w-80 rounded-full bg-accent-soft/50 blur-3xl"
      />

      <main className="relative mx-auto max-w-lg">
        <div className="card animate-fade-up rounded-3xl p-8 text-center sm:p-10">
          <p className="font-script text-3xl text-primary sm:text-4xl">You&apos;re invited</p>

          <div aria-hidden className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-border" />
            <IconHeartSolid className="h-4 w-4 text-secondary" />
            <span className="h-px w-16 bg-border" />
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold text-foreground sm:text-5xl">
            {event.title}
          </h1>

          {event.description && (
            <p className="mt-5 whitespace-pre-line leading-relaxed text-stone-600">
              {event.description}
            </p>
          )}

          <div className="mt-7 space-y-1.5">
            <p className="inline-flex items-center justify-center gap-2 text-sm font-medium text-stone-700">
              <IconCalendar className="h-4 w-4 text-primary" />
              {formattedDate}
            </p>
            {event.location && (
              <p className="flex items-center justify-center gap-2 text-sm text-stone-500">
                <IconMapPin className="h-4 w-4 text-primary" />
                {event.location}
              </p>
            )}
          </div>

          <div className="mt-7">
            <CountdownTimer date={event.date.toISOString()} />
          </div>

          {event.location && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border-soft shadow-soft">
              <iframe
                title="Event location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                width="100%"
                height="220"
                loading="lazy"
                className="border-0"
              />
            </div>
          )}

          <div className="mt-8">
            <RsvpForm slug={event.slug} />
          </div>

          <p className="mt-8 text-sm text-stone-500">
            <a
              href={`/event/${event.slug}/photos`}
              className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <IconCamera className="h-4 w-4" />
              Share photos during the event — open the photo wall
            </a>
          </p>
        </div>

        {!event.isPremium && (
          <p className="mt-6 text-center text-xs tracking-wide text-stone-400">
            Made with{" "}
            <span className="font-script text-base text-secondary">EventFlow</span>
          </p>
        )}
      </main>
    </div>
  );
}
