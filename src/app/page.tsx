import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">EventFlow</h1>
      <p className="mt-4 max-w-md text-gray-500">
        Digital invitations, RSVP tracking, and live QR photo sharing — all in
        one place for your wedding, engagement, birthday, or party.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
