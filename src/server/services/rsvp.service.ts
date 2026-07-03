import { prisma } from "@/server/lib/prisma";
import { EventStatus } from "@/generated/prisma/enums";
import type { CreateRsvpInput } from "@/lib/schemas/rsvp";

export class EventNotPublishedError extends Error {}

export async function createRsvp(eventId: string, input: CreateRsvpInput) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, status: true },
  });

  // CLAUDE.md §13: guard the API, not just the page — drafts must not accept
  // RSVPs, and their existence must not leak to guests.
  if (!event || event.status !== EventStatus.PUBLISHED) {
    throw new EventNotPublishedError("Event not found or not published");
  }

  return prisma.rsvp.create({
    data: {
      eventId: event.id,
      name: input.name,
      status: input.status,
      guestsCount: input.guestsCount,
    },
  });
}
