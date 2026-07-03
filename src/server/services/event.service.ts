import { prisma } from "@/server/lib/prisma";
import { isValidTemplateId } from "@/templates/registry";
import { EventStatus } from "@/generated/prisma/enums";
import type { CreateEventInput } from "@/lib/schemas/event";

export class InvalidTemplateError extends Error {}

const DIACRITICS_REGEX = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(DIACRITICS_REGEX, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "event"
  );
}

async function generateUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  let slug = base;
  let attempt = 0;

  while (await prisma.event.findUnique({ where: { slug } })) {
    attempt += 1;
    slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    if (attempt > 10) {
      slug = `${base}-${Date.now().toString(36)}`;
      break;
    }
  }

  return slug;
}

export async function createEvent(userId: string, input: CreateEventInput) {
  if (!isValidTemplateId(input.templateId)) {
    throw new InvalidTemplateError("Unknown templateId");
  }

  const slug = await generateUniqueSlug(input.title);

  return prisma.event.create({
    data: {
      userId,
      slug,
      type: input.type,
      title: input.title,
      description: input.description || undefined,
      eventDate: new Date(input.eventDate),
      location: input.location || undefined,
      whatsappNumber: input.whatsappNumber || undefined,
      templateId: input.templateId,
    },
  });
}

export async function listEventsForUser(userId: string) {
  return prisma.event.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEventForUser(eventId: string, userId: string) {
  return prisma.event.findFirst({
    where: { id: eventId, userId },
    include: {
      rsvps: { orderBy: { createdAt: "desc" } },
      photos: true,
    },
  });
}

// CLAUDE.md §3.1: the public guest link 404s until the event is paid and
// published — filtering on status here is what enforces that.
export async function getPublishedEventBySlug(slug: string) {
  return prisma.event.findFirst({
    where: { slug, status: EventStatus.PUBLISHED },
    include: {
      photos: { orderBy: { uploadedAt: "desc" } },
    },
  });
}
