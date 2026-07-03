# CLAUDE.md

> Source of truth for this project. Any AI agent or developer working in this repo
> must read and follow this file. If a request conflicts with what's here, flag it
> before proceeding. If context is missing, ask — do not assume.

---

## 1. Product

**Working name:** EventFlow (rename TBD)

A multi-tenant SaaS that digitizes real-world events by combining **digital invitations**,
**RSVP tracking**, and **live QR-based photo sharing** into one mobile-first experience.

**Target events:** weddings, engagements, birthdays, general parties. The event *type*
is chosen by the host; the product is event-type-agnostic.

**Core differentiator:** the QR photo wall — guests upload photos live during the event,
no login required. Most invitation tools don't have this.

**Primary language:** Albanian (content is fully host-authored). Build i18n-ready;
do not hardcode user-facing copy in a single language at the template layer.

---

## 2. Users

| Role | Auth | Can do |
|---|---|---|
| **Host** (event creator, the payer) | Yes | Register, build events, pick template, publish (pay), view RSVP stats + photo gallery, manage plan |
| **Guest** | No login | Open invite link, RSVP (WhatsApp or in-app form), upload photos via QR, view gallery |

---

## 3. Monetization (LOCKED)

Two **independent** money events. Neither depends on the other.

### 3.1 Publish fee — core paywall
- €24.99 **per event**, charged to make the event **go live**.
- Event is free to build and privately preview (`DRAFT`). The public guest link 404s until paid.
- The host pays to flip `DRAFT → PUBLISHED`. Editing after publish is free.
- **Why pay-to-publish, not pay-to-unlock-watermark:** a watermarked free version leaks
  (guests screenshot/share it, host never pays). A private draft can't be shared with guests,
  so nothing usable leaks. Payment moment = "Ready to send invites? Publish." = peak intent.

### 3.2 Premium templates — additive upsell
- Client gets **3 basic templates free**. Premium templates cost extra to unlock **per event**.
- **Orthogonal to publish.** A host can: draft only / free template + publish / premium template + publish.
- Enforced server-side via a `TEMPLATES` registry (`isPremium` flag). Never trust template
  choice from the client.

### 3.3 Pro subscription
- €29.99/mo for professionals (planners, photographers, agencies).
- **Waives BOTH the publish fee AND premium template fees.** (Decision locked.)
- Bypass logic runs at both payment points: if `user.plan === 'PRO'`, skip Checkout.

### 3.4 Revenue stack
Pay-per-event (base) + premium templates (upsell) + Pro subscription (recurring) + future add-ons
(extra storage, custom domain, printed QR cards).

---

## 4. Payment mechanics (Stripe)

- **Stripe Checkout (hosted).** Never touch card data — PCI scope ≈ zero. No custom card forms.
- **Webhook is the source of truth**, NOT the success redirect. The redirect is UX only
  (show thank-you) and can be faked/skipped. Never unlock anything on redirect.
- Each Checkout session carries `metadata: { eventId, userId, paymentType }`.
  `paymentType ∈ { PUBLISH, TEMPLATE }` routes the webhook outcome.
- **One webhook, branches on `paymentType`:**
  - `PUBLISH` → `event.status = PUBLISHED`, set `publishedAt`
  - `TEMPLATE` → `event.hasPremiumTemplate = true`
- **Idempotency:** `Payment.stripeSessionId` is `@unique`; handlers no-op on retry.
  Return 500 on handler failure so Stripe retries.
- **Refunds:** handle `charge.refunded`. Revert only the concern that payment covered
  (`PUBLISH` → back to `DRAFT`; `TEMPLATE` → `hasPremiumTemplate = false`).
- **MVP:** publish and premium-template are **separate sequential Checkout sessions**
  (simpler webhook, clearer refunds). Bundling into one session with two line items is a later optimization.

---

## 5. Feature scope

### v1 (build now)
- Host auth (see §7)
- Event creation + host dashboard
- Template system (3 free + premium, pluggable renderers)
- Publish flow + Stripe (publish fee + premium template)
- Public invitation page (`/invite/[slug]`)
- **RSVP: WhatsApp deep-link AND in-app form** — host gets yes/no/maybe stats.
  (WhatsApp button for convenience; in-app form is what populates the dashboard analytics.)
- **QR photo wall (live guest upload) — IN v1.**
- Pro subscription tier

### Out of scope (v1)
No social network features, no chat, no AI features, no drag-and-drop builder,
no photo moderation (moderation toggle is a future flag).

---

## 6. Template system

**Mental model: one data contract, many renderers.**

- A single `EventData` shape drives every template. Each template is a distinct React
  component tree (its own sections, animations, styling) that reads the same data.
- Observed sections from real client designs: envelope/wax-seal reveal → couple names →
  event details (date/time/location) → countdown → RSVP → photo gallery.
- Server-side `TEMPLATES` registry: `{ id, name, isPremium, component }`. "Is this template
  allowed for this event" is a pure server check.
- **Guard:** if a premium `templateId` is selected, block publish unless
  `hasPremiumTemplate === true` OR `user.plan === 'PRO'`. Enforce in the publish controller,
  not just the UI.

---

## 7. Auth — NextAuth / Auth.js (v5)

**Decision:** NextAuth over Clerk/Supabase Auth/custom JWT.
- Free + self-hosted (fits free-first / Vercel; Clerk bills per MAU — wrong for spiky seasonal traffic).
- Email/password + OAuth in one lib.
- Prisma adapter → identity lives in the same Postgres DB as events (no split identity store).
- Runs natively in Next route handlers.

Guest routes require **no** auth. Host/dashboard routes are protected via middleware.

---

## 8. Architecture

**Next.js (App Router) full-stack — route handlers, NOT a separate Express server.**

> Note: this deviates from the default Express-separate-backend preference. Justified for
> this product: guest pages need SSR/SEO + fast cold loads, and Vercel + Supabase/Neon +
> Cloudinary is the free-first path the product requires. Clean architecture is preserved
> *inside* Next (routes → controllers → services → db); there is just no second server.

```
src/
  app/
    (public)/
      invite/[slug]/           # public invitation page (404 unless PUBLISHED)
      event/[slug]/photos/     # QR photo wall (guest upload, no login)
    (auth)/
      login/  signup/
    (dashboard)/
      dashboard/
        events/
        events/create/
        events/[id]/           # RSVP stats + gallery
    api/
      events/[id]/checkout/    # creates Checkout session (PUBLISH or TEMPLATE)
      events/[id]/publish/     # publish controller (guards premium template)
      events/[id]/rsvp/        # in-app RSVP submit
      events/[id]/photos/      # photo upload
      webhooks/stripe/         # source of truth for payments
  server/
    controllers/
    services/
    lib/                       # stripe.ts, prisma.ts, cloudinary.ts
  components/
  hooks/
  templates/                   # pluggable template renderers + registry
```

**Standards (enforced):** routes → controllers → services → db. Centralized error handling.
Zod validation at boundaries. React Hook Form for forms. Zustand/Context for state.
Efficient Prisma queries (no N+1). Modular, production-ready, typed.

---

## 9. Data model (Prisma)

```prisma
enum EventStatus { DRAFT PUBLISHED ARCHIVED }
enum EventType { WEDDING ENGAGEMENT BIRTHDAY PARTY OTHER }
enum PaymentType { PUBLISH TEMPLATE }
enum PaymentStatus { PENDING PAID FAILED REFUNDED }
enum RsvpStatus { YES NO MAYBE }
enum Plan { FREE PRO }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  plan      Plan     @default(FREE)
  events    Event[]
  payments  Payment[]
  createdAt DateTime @default(now())
}

model Event {
  id                 String      @id @default(cuid())
  userId             String
  slug               String      @unique
  type               EventType
  title              String
  description        String?
  eventDate          DateTime
  location           String?
  whatsappNumber     String?     // for WhatsApp RSVP deep-link
  templateId         String
  hasPremiumTemplate Boolean     @default(false)
  status             EventStatus @default(DRAFT)
  publishedAt        DateTime?
  user      User      @relation(fields: [userId], references: [id])
  rsvps     Rsvp[]
  photos    Photo[]
  payments  Payment[]
  createdAt DateTime  @default(now())
  @@index([userId])
}

model Rsvp {
  id          String     @id @default(cuid())
  eventId     String
  name        String
  status      RsvpStatus
  guestsCount Int        @default(1)
  event       Event      @relation(fields: [eventId], references: [id])
  createdAt   DateTime   @default(now())
  @@index([eventId])
}

model Photo {
  id         String   @id @default(cuid())
  eventId    String
  imageUrl   String
  event      Event    @relation(fields: [eventId], references: [id])
  uploadedAt DateTime @default(now())
  @@index([eventId])
}

model Payment {
  id              String        @id @default(cuid())
  userId          String
  eventId         String
  type            PaymentType
  amountCents     Int
  currency        String        @default("eur")
  status          PaymentStatus @default(PENDING)
  stripeSessionId String        @unique
  stripePaymentId String?
  user      User  @relation(fields: [userId], references: [id])
  event     Event @relation(fields: [eventId], references: [id])
  createdAt DateTime @default(now())
  @@index([eventId])
  @@index([userId])
}
```

---

## 10. Routes

**Public:** `/` landing · `/invite/[slug]` invitation · `/event/[slug]/photos` QR photo wall
**Auth:** `/login` · `/signup`
**Dashboard:** `/dashboard` · `/dashboard/events` · `/dashboard/events/create` · `/dashboard/events/[id]`

---

## 11. Tech stack

Next.js (App Router, full-stack) · TypeScript · TailwindCSS · Prisma + PostgreSQL (Supabase/Neon) ·
NextAuth v5 · Stripe · Cloudinary (photos) · QR generation lib · Vercel (deploy).
Python only if/when needed for background jobs or data processing (microservice).

---

## 12. UX requirements

Mobile-first (critical). Fast load (<2–3s). Event creation in <5 min / <5 steps.
WhatsApp-share optimized. Clean, emotional UI for weddings/events. Multi-section scrolling
invitation with countdown + Google Maps.

---

## 13. Multi-tenancy & security rules (MUST)

- Each host owns their events; strict event isolation (scope every query by owner/event).
- Guest access to public event pages requires no login.
- Photo upload endpoint must reject uploads for non-`PUBLISHED` events (guard the API, not just the page).
- Never trust `templateId`, `paymentType`, or plan status from the client — verify server-side.
- Scalable schema; indexed foreign keys.

---

## 14. Success definition

Users sign up → create events → publish generates a shareable link → guests RSVP without login →
QR photo upload works live → deployed and publicly usable → first paying users exist.

---

## 15. Open / not yet decided

- Final product name & domain.
- Bundling publish + premium template into a single Checkout session (deferred optimization).
- Photo moderation (future flag).
- Which vertical slice to build first — recommend: **scaffold + schema + NextAuth**, then
  event creation + dashboard, then invite + RSVP, then photo wall.

---

## 16. Build order (proposed)

1. Project scaffold + Prisma schema + NextAuth (email + OAuth)
2. Event creation + host dashboard
3. Template registry + 3 free renderers
4. Publish flow + Stripe (publish fee + premium template + webhook)
5. Public invite page + RSVP (WhatsApp + in-app form + stats)
6. QR photo wall (upload + live gallery)
7. Pro subscription + fee bypass
