import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QrCodeCard from "@/components/QrCodeCard";
import UpgradeButton from "@/components/UpgradeButton";

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

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{event.title}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Intl.DateTimeFormat("en", { dateStyle: "full", timeStyle: "short" }).format(
              event.date
            )}
          </p>
        </div>
        {!event.isPremium && <UpgradeButton eventId={event.id} />}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-semibold text-gray-900">{event.rsvps.length}</p>
          <p className="text-sm text-gray-500">Total responses</p>
        </div>
        <div className="rounded-xl bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-semibold text-emerald-600">{yes.length}</p>
          <p className="text-sm text-gray-500">Yes</p>
        </div>
        <div className="rounded-xl bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-semibold text-amber-600">{maybe.length}</p>
          <p className="text-sm text-gray-500">Maybe</p>
        </div>
        <div className="rounded-xl bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-semibold text-red-500">{no.length}</p>
          <p className="text-sm text-gray-500">No</p>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-500">Total guests attending: {totalGuests}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <QrCodeCard url={inviteUrl} label="Invitation link" />
        <QrCodeCard url={photoWallUrl} label="Photo wall (print for the event!)" />
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Guest list</h2>
        {event.rsvps.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No responses yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Guests</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {event.rsvps.map((rsvp) => (
                  <tr key={rsvp.id}>
                    <td className="px-4 py-2 text-gray-900">{rsvp.name}</td>
                    <td className="px-4 py-2 capitalize text-gray-600">{rsvp.status}</td>
                    <td className="px-4 py-2 text-gray-600">{rsvp.guestsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Recent photos</h2>
        {event.photos.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">No photos uploaded yet.</p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {event.photos.map((photo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photo.imageUrl}
                alt="Guest upload"
                className="aspect-square w-full rounded-lg object-cover shadow-sm"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
