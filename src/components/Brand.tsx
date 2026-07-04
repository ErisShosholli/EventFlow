import Link from "next/link";
import { IconHeartSolid } from "@/components/icons";

export default function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-on-primary shadow-soft">
        <IconHeartSolid className="h-4 w-4" />
      </span>
      <span className="font-display text-2xl font-semibold tracking-wide text-foreground">
        EventFlow
      </span>
    </Link>
  );
}
