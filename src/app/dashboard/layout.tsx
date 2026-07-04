import { auth } from "@/lib/auth";
import Brand from "@/components/Brand";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border-soft bg-surface/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Brand href="/dashboard" />
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-stone-500 sm:inline">
              {session?.user?.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
