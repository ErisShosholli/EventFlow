import Link from "next/link";
import Brand from "@/components/Brand";
import {
  IconTicket,
  IconChartBar,
  IconCamera,
  IconArrowRight,
  IconHeartSolid,
} from "@/components/icons";

const FEATURES = [
  {
    icon: IconTicket,
    title: "Beautiful invitations",
    body: "A shareable page with countdown, map, and your theme — live in minutes.",
  },
  {
    icon: IconChartBar,
    title: "Real-time RSVPs",
    body: "Guests respond in seconds. You get a live dashboard of who's coming.",
  },
  {
    icon: IconCamera,
    title: "QR photo wall",
    body: "Guests scan a QR code and upload photos live — no app or login required.",
  },
];

const STEPS = [
  { n: "1", title: "Create your event", body: "Title, date, place, theme — done in two minutes." },
  { n: "2", title: "Share one link", body: "Send it on WhatsApp or print the QR code for the tables." },
  { n: "3", title: "Enjoy the day", body: "RSVPs and guest photos flow in live, all in one place." },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-secondary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 -right-40 h-105 w-105 rounded-full bg-accent-soft/60 blur-3xl"
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Brand />
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Log in
          </Link>
          <Link href="/signup" className="btn-primary px-4 py-2 text-sm">
            Get started
          </Link>
        </nav>
      </header>

      <main className="relative">
        <section className="mx-auto max-w-3xl px-6 pt-16 pb-20 text-center sm:pt-24">
          <p className="animate-fade-up font-script text-3xl text-primary sm:text-4xl">
            Every celebration, one link
          </p>
          <h1 className="animate-fade-up mt-4 font-display text-5xl font-semibold tracking-tight text-foreground [animation-delay:80ms] sm:text-6xl">
            Invitations, RSVPs, and live photos — all in one place
          </h1>
          <p className="animate-fade-up mx-auto mt-6 max-w-xl text-lg leading-relaxed text-stone-600 [animation-delay:160ms]">
            Replace paper invitations, WhatsApp chaos, and scattered photo sharing with one
            beautiful digital event page for weddings, birthdays, and celebrations.
          </p>
          <div className="animate-fade-up mt-9 flex flex-col justify-center gap-3 [animation-delay:240ms] sm:flex-row">
            <Link href="/signup" className="btn-primary px-7 py-3">
              Create your event
              <IconArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="btn-outline px-7 py-3">
              I already have an account
            </Link>
          </div>
        </section>

        <section aria-labelledby="features-heading" className="mx-auto max-w-5xl px-6 pb-20">
          <h2 id="features-heading" className="sr-only">
            What EventFlow does
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="card p-6 text-left transition-shadow duration-200 hover:shadow-lift"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="steps-heading" className="mx-auto max-w-5xl px-6 pb-24">
          <h2
            id="steps-heading"
            className="text-center font-display text-3xl font-semibold text-foreground"
          >
            How it works
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="text-center">
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg font-semibold text-on-primary shadow-soft">
                  {step.n}
                </span>
                <h3 className="mt-3 font-semibold text-foreground">{step.title}</h3>
                <p className="mx-auto mt-1 max-w-60 text-sm leading-relaxed text-stone-600">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative border-t border-border-soft bg-surface/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-8 text-center">
          <p className="inline-flex items-center gap-1.5 text-sm text-stone-500">
            Made with <IconHeartSolid className="h-3.5 w-3.5 text-primary" title="love" /> for
            weddings, birthdays, and every celebration in between
          </p>
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} EventFlow
          </p>
        </div>
      </footer>
    </div>
  );
}
