"use client";

import { useEffect, useState, useCallback } from "react";

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
    return <p className="text-center text-sm text-gray-500">Loading photos…</p>;
  }

  if (photos.length === 0) {
    return <p className="text-center text-sm text-gray-500">No photos yet — be the first to share one!</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {photos.map((photo) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.id}
          src={photo.imageUrl}
          alt="Event guest upload"
          className="aspect-square w-full rounded-lg object-cover shadow-sm"
          loading="lazy"
        />
      ))}
    </div>
  );
}
