"use client";

import { useState } from "react";
import PhotoUploader from "@/components/PhotoUploader";
import PhotoGallery from "@/components/PhotoGallery";

export default function PhotoWallClient({ slug }: { slug: string }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <div className="mt-6">
        <PhotoUploader slug={slug} onUploaded={() => setRefreshKey((k) => k + 1)} />
      </div>

      <div className="mt-8">
        <PhotoGallery slug={slug} refreshKey={refreshKey} />
      </div>
    </>
  );
}
