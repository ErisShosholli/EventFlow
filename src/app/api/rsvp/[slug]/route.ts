import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["yes", "no", "maybe"] as const;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { name, status, guestsCount } = await req.json();

  if (!name || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: "Name and a valid status (yes/no/maybe) are required" },
      { status: 400 }
    );
  }

  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const rsvp = await prisma.rsvp.create({
    data: {
      eventId: event.id,
      name,
      status,
      guestsCount: Number.isFinite(guestsCount) && guestsCount > 0 ? guestsCount : 1,
    },
  });

  return NextResponse.json(rsvp, { status: 201 });
}
