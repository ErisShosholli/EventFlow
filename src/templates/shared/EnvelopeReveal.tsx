"use client";

import { useState } from "react";

export function EnvelopeReveal({
  eventTitle,
  wrapperClassName,
  sealClassName,
  buttonClassName,
  buttonLabel = "Open Invitation",
  children,
}: {
  eventTitle: string;
  wrapperClassName?: string;
  sealClassName: string;
  buttonClassName: string;
  buttonLabel?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative min-h-screen ${wrapperClassName ?? ""}`}>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-6 px-4 text-center transition-opacity duration-700 ${
          open ? "pointer-events-none opacity-0" : "opacity-100"
        } ${sealClassName}`}
      >
        <p className="text-xs uppercase tracking-[0.4em] opacity-70">
          You&apos;re invited
        </p>
        <h1 className="max-w-sm text-3xl font-semibold">{eventTitle}</h1>
        <button type="button" onClick={() => setOpen(true)} className={buttonClassName}>
          {buttonLabel}
        </button>
      </div>

      <div
        className={`transition-opacity duration-700 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
