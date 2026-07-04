import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RsvpForm from "@/components/RsvpForm";
import CountdownTimer from "@/components/CountdownTimer";

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
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-12">
      <div className="mx-auto max-w-lg text-center">
        {!event.isPremium && (
          <p className="mb-4 text-xs uppercase tracking-wide text-gray-400">
            Made with EventFlow
          </p>
        )}

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{event.title}</h1>

        {event.description && (
          <p className="mt-4 whitespace-pre-line text-gray-600">{event.description}</p>
        )}

        <p className="mt-6 text-sm font-medium text-gray-700">{formattedDate}</p>
        {event.location && <p className="mt-1 text-sm text-gray-500">{event.location}</p>}

        <div className="mt-6">
          <CountdownTimer date={event.date.toISOString()} />
        </div>

        {event.location && (
          <div className="mt-8 overflow-hidden rounded-xl shadow-sm">
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

        <p className="mt-8 text-sm text-gray-500">
          Want to share photos during the event?{" "}
          <a href={`/event/${event.slug}/photos`} className="font-medium text-rose-600 hover:underline">
            Open the photo wall
          </a>
        </p>
      </div>
    </div>
  );
}
