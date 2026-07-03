import Link from "next/link";
import { auth } from "@/server/lib/auth";
import { prisma } from "@/server/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  const events = session?.user?.id
    ? await prisma.event.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your events</h1>
        <Link
          href="/dashboard/events/create"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          New event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">
          No events yet. Create your first event to get started.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-gray-200">
          {events.map((event) => (
            <li key={event.id} className="py-4">
              <Link
                href={`/dashboard/events/${event.id}`}
                className="font-medium hover:underline"
              >
                {event.title}
              </Link>
              <p className="text-sm text-gray-500">
                {event.status} · {event.eventDate.toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
