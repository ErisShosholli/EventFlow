import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PhotoWallClient from "@/components/PhotoWallClient";
import { IconCamera } from "@/components/icons";

export default async function PhotoWallPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await prisma.event.findUnique({ where: { slug } });

  if (!event) notFound();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-105 w-105 -translate-x-1/2 rounded-full bg-secondary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary shadow-soft">
          <IconCamera className="h-6 w-6" />
        </span>
        <h1 className="mt-4 text-center font-display text-3xl font-semibold text-foreground sm:text-4xl">
          {event.title}
        </h1>
        <p className="mt-2 text-center text-sm text-stone-500">
          Share your favorite moments — they&apos;ll appear here instantly.
        </p>

        <PhotoWallClient slug={event.slug} />
      </div>
    </div>
  );
}
