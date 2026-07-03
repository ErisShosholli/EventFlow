import type { EventType } from "@/generated/prisma/enums";

export interface EventPhoto {
  id: string;
  imageUrl: string;
}

/**
 * The single data contract every template renderer reads from. Content is
 * fully host-authored (CLAUDE.md §1), so nothing here is hardcoded copy —
 * templates render whatever the host typed.
 */
export interface EventData {
  slug: string;
  title: string;
  type: EventType;
  description?: string | null;
  eventDate: Date;
  location?: string | null;
  whatsappNumber?: string | null;
  photos: EventPhoto[];
}

export interface TemplateProps {
  event: EventData;
}
