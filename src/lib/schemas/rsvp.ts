import { z } from "zod";
import { RsvpStatus } from "@/generated/prisma/enums";

const rsvpStatusValues = Object.values(RsvpStatus) as [RsvpStatus, ...RsvpStatus[]];

/** Fields the guest fills in — status is picked via the yes/maybe/no buttons. */
export const rsvpFormSchema = z.object({
  name: z.string().trim().min(1, "Your name is required").max(100),
  guestsCount: z.number().int().min(1).max(20),
});
export type RsvpFormInput = z.infer<typeof rsvpFormSchema>;

export const createRsvpSchema = rsvpFormSchema.extend({
  status: z.enum(rsvpStatusValues),
});
export type CreateRsvpInput = z.infer<typeof createRsvpSchema>;
