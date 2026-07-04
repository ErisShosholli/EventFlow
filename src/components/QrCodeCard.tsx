import QRCode from "qrcode";
import CopyLinkButton from "@/components/CopyLinkButton";

export default async function QrCodeCard({
  url,
  label,
}: {
  url: string;
  label: string;
}) {
  const qrDataUrl = await QRCode.toDataURL(url, { margin: 1, width: 220 });
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${label}: ${url}`)}`;

  return (
    <div className="card flex flex-col items-center gap-3 p-6 text-center">
      <p className="font-display text-lg font-semibold text-foreground">{label}</p>
      <div className="rounded-xl border border-border-soft bg-surface p-2 shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qrDataUrl} alt={`QR code for ${label}`} width={180} height={180} />
      </div>
      <p className="max-w-60 break-all text-xs text-stone-400">{url}</p>
      <div className="flex flex-wrap justify-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
        >
          Share on WhatsApp
        </a>
        <CopyLinkButton url={url} />
      </div>
    </div>
  );
}
