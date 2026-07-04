import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Infant, Great_Vibes } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Infant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "EventFlow — Invitations, RSVPs & Photo Sharing",
  description: "Digital event invitations, RSVP tracking, and live QR photo sharing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-stone-700">{children}</body>
    </html>
  );
}
