import Link from "next/link";
import { auth, signOut } from "@/server/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <Link href="/dashboard" className="font-semibold">
          EventFlow
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500">{session?.user?.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button className="rounded-md border border-gray-300 px-3 py-1.5">
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}
