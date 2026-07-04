import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

const FREE_TIER_PHOTO_LIMIT = 30;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const photos = await prisma.photo.findMany({
    where: { eventId: event.id },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json(photos);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (!event.isPremium) {
    const count = await prisma.photo.count({ where: { eventId: event.id } });
    if (count >= FREE_TIER_PHOTO_LIMIT) {
      return NextResponse.json(
        { error: "This event has reached its free photo limit. Upgrade to Pro for unlimited photos." },
        { status: 403 }
      );
    }
  }

  const { image } = await req.json();
  if (!image || typeof image !== "string" || !image.startsWith("data:")) {
    return NextResponse.json(
      { error: "A base64 image data URI is required" },
      { status: 400 }
    );
  }

  const imageUrl = await uploadImage(image, `eventflow/${event.slug}`);

  const photo = await prisma.photo.create({
    data: { eventId: event.id, imageUrl },
  });

  return NextResponse.json(photo, { status: 201 });
}
