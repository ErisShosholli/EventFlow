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
    <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 text-center shadow-sm">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={qrDataUrl} alt={`QR code for ${label}`} width={180} height={180} />
      <p className="max-w-[240px] break-all text-xs text-gray-400">{url}</p>
      <div className="flex gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
        >
          Share on WhatsApp
        </a>
        <CopyLinkButton url={url} />
      </div>
    </div>
  );
}
