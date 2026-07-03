import type { EventData } from "@/templates/types";
import type { EventType } from "@/generated/prisma/enums";

interface EventLike {
  slug: string;
  title: string;
  type: EventType;
  description: string | null;
  eventDate: Date;
  location: string | null;
  whatsappNumber: string | null;
  photos: { id: string; imageUrl: string }[];
}

export function toEventData(event: EventLike): EventData {
  return {
    slug: event.slug,
    title: event.title,
    type: event.type,
    description: event.description,
    eventDate: event.eventDate,
    location: event.location,
    whatsappNumber: event.whatsappNumber,
    photos: event.photos.map((photo) => ({ id: photo.id, imageUrl: photo.imageUrl })),
  };
}
