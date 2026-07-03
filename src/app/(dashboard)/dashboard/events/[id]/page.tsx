import { notFound } from "next/navigation";
import { auth } from "@/server/lib/auth";
import { getEventForUser } from "@/server/services/event.service";
import { getTemplate } from "@/templates/registry";
import { RsvpStatus } from "@/generated/prisma/enums";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const event = await getEventForUser(id, session.user.id);
  if (!event) {
    notFound();
  }

  const rsvpCounts = {
    yes: event.rsvps.filter((r) => r.status === RsvpStatus.YES).length,
    no: event.rsvps.filter((r) => r.status === RsvpStatus.NO).length,
    maybe: event.rsvps.filter((r) => r.status === RsvpStatus.MAYBE).length,
  };
  const guestsAttending = event.rsvps
    .filter((r) => r.status === RsvpStatus.YES)
    .reduce((sum, r) => sum + r.guestsCount, 0);

  const template = getTemplate(event.templateId);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {event.status} · {template?.name ?? event.templateId}
            {event.hasPremiumTemplate ? " (premium unlocked)" : ""}
          </p>
        </div>
        <button
          disabled
          title="Publishing (Stripe checkout) ships in a later step"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          Publish
        </button>
      </div>

      {event.status === "PUBLISHED" && (
        <p className="mt-4 text-sm">
          Invitation link:{" "}
          <span className="font-mono">/invite/{event.slug}</span>
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-medium">RSVP stats</h2>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <div className="rounded-md border border-gray-200 p-4 text-center">
            <p className="text-2xl font-semibold">{rsvpCounts.yes}</p>
            <p className="text-sm text-gray-500">Yes</p>
          </div>
          <div className="rounded-md border border-gray-200 p-4 text-center">
            <p className="text-2xl font-semibold">{rsvpCounts.maybe}</p>
            <p className="text-sm text-gray-500">Maybe</p>
          </div>
          <div className="rounded-md border border-gray-200 p-4 text-center">
            <p className="text-2xl font-semibold">{rsvpCounts.no}</p>
            <p className="text-sm text-gray-500">No</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {guestsAttending} guest{guestsAttending === 1 ? "" : "s"} attending
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-medium">Photo gallery</h2>
        {event.photos.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">
            No photos uploaded yet. Guests can upload once the event is
            published.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {event.photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.imageUrl}
                alt=""
                className="aspect-square w-full rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
