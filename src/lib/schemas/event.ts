import { z } from "zod";
import { EventType } from "@/generated/prisma/enums";

const eventTypeValues = Object.values(EventType) as [EventType, ...EventType[]];

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  type: z.enum(eventTypeValues),
  eventDate: z
    .string()
    .min(1, "A date is required")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date"),
  description: z.string().max(2000).optional().or(z.literal("")),
  location: z.string().max(200).optional().or(z.literal("")),
  whatsappNumber: z.string().max(30).optional().or(z.literal("")),
  templateId: z.string().min(1, "Choose a template"),
});
export type CreateEventInput = z.infer<typeof createEventSchema>;
