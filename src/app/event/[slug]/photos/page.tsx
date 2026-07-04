import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PhotoWallClient from "@/components/PhotoWallClient";

export default async function PhotoWallPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-center text-2xl font-semibold text-gray-900">📸 {event.title}</h1>
        <p className="mt-1 text-center text-sm text-gray-500">
          Share your favorite moments — they&apos;ll appear here instantly.
        </p>

        <PhotoWallClient slug={event.slug} />
      </div>
    </div>
  );
}
