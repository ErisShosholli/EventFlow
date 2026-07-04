"use client";

import { useEffect, useState, useCallback } from "react";
import { IconPhoto } from "@/components/icons";

type Photo = {
  id: string;
  imageUrl: string;
  uploadedAt: string;
};

export default function PhotoGallery({ slug, refreshKey }: { slug: string; refreshKey?: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/photos/${slug}`);
    if (res.ok) {
      setPhotos(await res.json());
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load, refreshKey]);

  useEffect(() => {
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) {
    return (
      <div
        aria-label="Loading photos"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square w-full animate-pulse rounded-xl bg-border-soft"
          />
        ))}
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="card p-10 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background text-secondary">
          <IconPhoto className="h-6 w-6" />
        </span>
        <p className="mt-3 text-sm text-stone-500">
          No photos yet — be the first to share one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.id}
          src={photo.imageUrl}
          alt="Event guest upload"
          className="aspect-square w-full rounded-xl object-cover shadow-soft"
          loading="lazy"
        />
      ))}
    </div>
  );
}
