import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold text-gray-900">💍 EventFlow</span>
        <nav className="flex gap-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Invitations, RSVPs, and live photos — all in one link
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-gray-600">
          Replace paper invitations, WhatsApp chaos, and scattered photo sharing with one
          beautiful digital event page for weddings, birthdays, and celebrations.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-rose-500 px-6 py-3 font-medium text-white hover:bg-rose-600"
          >
            Create your event
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:border-gray-400"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 text-left sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-2xl">🎟️</p>
            <h3 className="mt-2 font-semibold text-gray-900">Beautiful invitations</h3>
            <p className="mt-1 text-sm text-gray-600">
              A shareable page with countdown, map, and your theme — live in minutes.
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-2xl">📊</p>
            <h3 className="mt-2 font-semibold text-gray-900">Real-time RSVPs</h3>
            <p className="mt-1 text-sm text-gray-600">
              Guests respond in seconds. You get a live dashboard of who&apos;s coming.
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-2xl">📸</p>
            <h3 className="mt-2 font-semibold text-gray-900">QR photo wall</h3>
            <p className="mt-1 text-sm text-gray-600">
              Guests scan a QR code and upload photos live — no app or login required.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
