import type { EventPhoto } from "@/templates/types";

export function PhotoGallery({ photos }: { photos: EventPhoto[] }) {
  if (photos.length === 0) {
    return (
      <p className="text-center text-sm opacity-70">
        Photos from the event will appear here once guests start uploading.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {photos.map((photo) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.id}
          src={photo.imageUrl}
          alt=""
          className="aspect-square w-full rounded-md object-cover"
        />
      ))}
    </div>
  );
}
