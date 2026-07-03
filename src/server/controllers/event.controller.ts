import { NextResponse } from "next/server";
import { auth } from "@/server/lib/auth";
import { createEvent, InvalidTemplateError } from "@/server/services/event.service";
import { createEventSchema } from "@/lib/schemas/event";

export async function handleCreateEvent(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createEventSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const event = await createEvent(session.user.id, parsed.data);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof InvalidTemplateError) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }
    throw error;
  }
}
