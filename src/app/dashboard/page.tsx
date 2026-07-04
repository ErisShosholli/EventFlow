import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  IconPlus,
  IconCalendar,
  IconUsers,
  IconPhoto,
  IconSparkles,
  IconTicket,
} from "@/components/icons";

export default async function DashboardPage() {
  const session = await auth();
  const events = await prisma.event.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { rsvps: true, photos: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold text-foreground">Your events</h1>
        <Link href="/dashboard/events/create" className="btn-primary px-4 py-2 text-sm">
          <IconPlus className="h-4 w-4" />
          New event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="card mt-10 p-12 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-background text-primary">
            <IconTicket className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
            No events yet
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-stone-600">
            Create your first event to get a shareable invitation link, RSVP tracking, and a
            live photo wall.
          </p>
          <Link
            href="/dashboard/events/create"
            className="btn-primary mt-6 px-5 py-2.5 text-sm"
          >
            <IconPlus className="h-4 w-4" />
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/dashboard/events/${event.id}`}
              className="card group p-5 transition-all duration-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-xl font-semibold text-foreground group-hover:text-primary">
                  {event.title}
                </h2>
                {event.isPremium && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
                    <IconSparkles className="h-3.5 w-3.5" />
                    Pro
                  </span>
                )}
              </div>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-stone-500">
                <IconCalendar className="h-4 w-4 text-secondary" />
                {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(event.date)}
              </p>
              <div className="mt-4 flex gap-5 text-sm text-stone-500">
                <span className="inline-flex items-center gap-1.5">
                  <IconUsers className="h-4 w-4 text-secondary" />
                  {event._count.rsvps} RSVPs
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <IconPhoto className="h-4 w-4 text-secondary" />
                  {event._count.photos} photos
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
