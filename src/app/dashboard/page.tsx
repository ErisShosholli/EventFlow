import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  const events = await prisma.event.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { rsvps: true, photos: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Your events</h1>
        <Link
          href="/dashboard/events/create"
          className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          + New event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="mt-10 rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-gray-600">You haven&apos;t created any events yet.</p>
          <Link
            href="/dashboard/events/create"
            className="mt-4 inline-block rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/dashboard/events/${event.id}`}
              className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold text-gray-900">{event.title}</h2>
                {event.isPremium && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Pro
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(event.date)}
              </p>
              <div className="mt-4 flex gap-4 text-sm text-gray-500">
                <span>{event._count.rsvps} RSVPs</span>
                <span>{event._count.photos} photos</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
