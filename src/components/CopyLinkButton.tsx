"use client";

import { useState } from "react";
import { IconCheck, IconLink } from "@/components/icons";

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="btn-outline px-4 py-2 text-sm"
      aria-live="polite"
    >
      {copied ? (
        <>
          <IconCheck className="h-4 w-4 text-emerald-600" />
          Copied!
        </>
      ) : (
        <>
          <IconLink className="h-4 w-4" />
          Copy link
        </>
      )}
    </button>
  );
}
