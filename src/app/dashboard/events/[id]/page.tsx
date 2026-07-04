import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QrCodeCard from "@/components/QrCodeCard";
import UpgradeButton from "@/components/UpgradeButton";
import {
  IconCalendar,
  IconMapPin,
  IconUsers,
  IconCheck,
  IconQuestion,
  IconX,
} from "@/components/icons";

const STATUS_BADGES = {
  yes: { label: "Yes", icon: IconCheck, classes: "bg-emerald-50 text-emerald-700" },
  maybe: { label: "Maybe", icon: IconQuestion, classes: "bg-amber-50 text-amber-700" },
  no: { label: "No", icon: IconX, classes: "bg-rose-50 text-rose-700" },
} as const;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      rsvps: { orderBy: { createdAt: "desc" } },
      photos: { orderBy: { uploadedAt: "desc" }, take: 12 },
    },
  });

  if (!event || event.userId !== session!.user.id) notFound();

  const yes = event.rsvps.filter((r) => r.status === "yes");
  const no = event.rsvps.filter((r) => r.status === "no");
  const maybe = event.rsvps.filter((r) => r.status === "maybe");
  const totalGuests = yes.reduce((sum, r) => sum + r.guestsCount, 0);

  const origin = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const inviteUrl = `${origin}/invite/${event.slug}`;
  const photoWallUrl = `${origin}/event/${event.slug}/photos`;

  const stats = [
    { label: "Total responses", value: event.rsvps.length, valueClass: "text-foreground" },
    { label: "Yes", value: yes.length, valueClass: "text-emerald-600" },
    { label: "Maybe", value: maybe.length, valueClass: "text-amber-600" },
    { label: "No", value: no.length, valueClass: "text-rose-600" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">
            {event.title}
          </h1>
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-stone-500">
            <IconCalendar className="h-4 w-4 text-secondary" />
            {new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" }).format(
              event.date
            )}
          </p>
          {event.location && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-stone-500">
              <IconMapPin className="h-4 w-4 text-secondary" />
              {event.location}
            </p>
          )}
        </div>
        {!event.isPremium && <UpgradeButton eventId={event.id} />}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5 text-center">
            <p className={`text-3xl font-semibold tabular-nums ${stat.valueClass}`}>
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-stone-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-stone-500">
        <IconUsers className="h-4 w-4 text-secondary" />
        Total guests attending: <span className="font-semibold text-foreground">{totalGuests}</span>
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <QrCodeCard url={inviteUrl} label="Invitation link" />
        <QrCodeCard url={photoWallUrl} label="Photo wall (print for the event!)" />
      </div>

      <section aria-labelledby="guest-list" className="mt-10">
        <h2 id="guest-list" className="font-display text-2xl font-semibold text-foreground">
          Guest list
        </h2>
        {event.rsvps.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">No responses yet.</p>
        ) : (
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border-soft text-stone-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Guests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {event.rsvps.map((rsvp) => {
                  const badge = STATUS_BADGES[rsvp.status];
                  const BadgeIcon = badge.icon;
                  return (
                    <tr key={rsvp.id}>
                      <td className="px-5 py-3 font-medium text-stone-800">{rsvp.name}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${badge.classes}`}
                        >
                          <BadgeIcon className="h-3.5 w-3.5" />
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 tabular-nums text-stone-600">
                        {rsvp.guestsCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="recent-photos" className="mt-10">
        <h2 id="recent-photos" className="font-display text-2xl font-semibold text-foreground">
          Recent photos
        </h2>
        {event.photos.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">No photos uploaded yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {event.photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.imageUrl}
                alt="Guest upload"
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover shadow-soft"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
