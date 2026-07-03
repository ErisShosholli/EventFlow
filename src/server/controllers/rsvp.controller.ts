import { NextResponse } from "next/server";
import { createRsvp, EventNotPublishedError } from "@/server/services/rsvp.service";
import { createRsvpSchema } from "@/lib/schemas/rsvp";

// Guest route — intentionally no auth (CLAUDE.md §2: guests RSVP without login).
export async function handleCreateRsvp(request: Request, eventId: string) {
  const body = await request.json().catch(() => null);
  const parsed = createRsvpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const rsvp = await createRsvp(eventId, parsed.data);
    return NextResponse.json({ rsvp: { id: rsvp.id } }, { status: 201 });
  } catch (error) {
    if (error instanceof EventNotPublishedError) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    throw error;
  }
}
