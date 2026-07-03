import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/server/lib/auth";
import { getEventForUser } from "@/server/services/event.service";
import { getUserPlan } from "@/server/services/user.service";
import { getTemplate } from "@/templates/registry";
import { RsvpStatus, EventStatus, Plan } from "@/generated/prisma/enums";
import { PublishButton } from "./PublishButton";
import { UnlockTemplateButton } from "./UnlockTemplateButton";

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { id } = await params;
  const { checkout } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const event = await getEventForUser(id, session.user.id);
  if (!event) {
    notFound();
  }

  const plan = await getUserPlan(session.user.id);

  const rsvpCounts = {
    yes: event.rsvps.filter((r) => r.status === RsvpStatus.YES).length,
    no: event.rsvps.filter((r) => r.status === RsvpStatus.NO).length,
    maybe: event.rsvps.filter((r) => r.status === RsvpStatus.MAYBE).length,
  };
  const guestsAttending = event.rsvps
    .filter((r) => r.status === RsvpStatus.YES)
    .reduce((sum, r) => sum + r.guestsCount, 0);

  const template = getTemplate(event.templateId);
  const templateLocked =
    template?.isPremium && !event.hasPremiumTemplate && plan !== Plan.PRO;
  const isPublished = event.status === EventStatus.PUBLISHED;

  return (
    <div className="mx-auto max-w-3xl">
      {checkout === "success" && (
        <p className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-800">
          Payment received. This confirmation is just for you — the event
          status above reflects what Stripe actually confirmed.
        </p>
      )}
      {checkout === "cancelled" && (
        <p className="mb-4 rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Checkout was cancelled. No charge was made.
        </p>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{event.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {event.status} · {template?.name ?? event.templateId}
            {event.hasPremiumTemplate ? " (premium unlocked)" : ""}
            {plan === Plan.PRO ? " · Pro plan" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/events/${event.id}/preview`}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
          >
            Preview
          </Link>
          {!isPublished && (
            <PublishButton
              eventId={event.id}
              disabled={templateLocked}
              disabledReason="Unlock the premium template before publishing"
            />
          )}
        </div>
      </div>

      {templateLocked && !isPublished && (
        <div className="mt-4 flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <p>This template is premium — unlock it to publish with it.</p>
          <UnlockTemplateButton eventId={event.id} />
        </div>
      )}

      {isPublished && (
        <p className="mt-4 text-sm">
          Invitation link:{" "}
          <a
            href={`/invite/${event.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono underline"
          >
            /invite/{event.slug}
          </a>
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

        {event.rsvps.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">
            No responses yet. Guests can RSVP once the event is published.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Response</th>
                  <th className="px-4 py-2 font-medium">Guests</th>
                  <th className="px-4 py-2 font-medium">Received</th>
                </tr>
              </thead>
              <tbody>
                {event.rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-t border-gray-100">
                    <td className="px-4 py-2">{rsvp.name}</td>
                    <td className="px-4 py-2">{rsvp.status}</td>
                    <td className="px-4 py-2">
                      {rsvp.status === RsvpStatus.NO ? "—" : rsvp.guestsCount}
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {rsvp.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
