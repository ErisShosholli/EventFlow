# EventFlow

A multi-tenant SaaS platform for digital event invitations, RSVP tracking, and
live QR-based photo sharing — built for weddings, engagements, birthdays, and
other events.

## Stack

- Next.js 16 (App Router) + TypeScript + TailwindCSS
- Prisma ORM (v7, via the `@prisma/adapter-pg` driver adapter) + PostgreSQL
- Auth.js (NextAuth v5) with a Credentials (email/password) provider
- Cloudinary for photo storage
- Stripe for payments (optional — routes no-op until configured)
- `qrcode` for QR generation

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values (a starter `.env`
   with placeholders already exists for local dev):
   - `DATABASE_URL` — a Postgres connection string (e.g. from
     [Supabase](https://supabase.com) or [Neon](https://neon.tech)), or the
     local zero-install option below
   - `NEXTAUTH_SECRET` — generate with `npx auth secret`
   - `CLOUDINARY_*` — from your [Cloudinary](https://cloudinary.com) dashboard
   - `STRIPE_*` — from your [Stripe](https://dashboard.stripe.com) dashboard
     (optional; upgrade/checkout is disabled until these are set)
3. Push the schema to your database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```

Without a real `DATABASE_URL`, the app will build and the static/public pages
will render, but any route touching the database (signup, dashboard, RSVP,
photos) will error at request time — that's expected until step 3 is done.

### Local database without installing Postgres

Prisma ships a local, zero-install Postgres dev server (PGlite-based). The
checked-in `.env` already points at it:

```bash
npx prisma dev --name eventflow --detach   # start it (background)
npx prisma dev ls                          # see status + connection URLs
npx prisma dev stop eventflow              # stop it
```

Note the TCP port in `prisma dev ls` (the `.env` values assume `51218`
main / `51219` shadow); if the port differs on your machine, update
`DATABASE_URL` and `SHADOW_DATABASE_URL` in `.env` to match.

Known issue: with this local server, `prisma migrate dev` currently fails with
`P1017` (a schema-engine/PGlite wire-protocol incompatibility in Prisma 7.8).
The initial migration in `prisma/migrations/20260704000000_init` was generated
with `prisma migrate diff --from-empty --to-schema prisma/schema.prisma
--script` and applied manually, and is recorded in `_prisma_migrations`. For
future schema changes against the local server, repeat that pattern (diff from
`prisma/migrations` to the schema, apply the SQL with any Postgres client,
insert a `_prisma_migrations` row) — or use a real Postgres instance, where
`prisma migrate dev` works normally.

## Project structure

- `src/app` — routes (public pages, auth pages, dashboard, API routes)
- `src/components` — shared UI (forms, uploader, gallery, QR card)
- `src/lib` — Prisma client, Auth.js config, Cloudinary/Stripe clients, slug generator
- `prisma/schema.prisma` — data model (`User`, `Event`, `Rsvp`, `Photo`, `Payment`)

## Key routes

| Route | Description |
| --- | --- |
| `/` | Landing page |
| `/signup`, `/login` | Auth pages |
| `/dashboard` | List of the logged-in user's events |
| `/dashboard/events/create` | Create a new event |
| `/dashboard/events/[id]` | RSVP stats, guest list, photo gallery, QR codes |
| `/invite/[slug]` | Public invitation + RSVP form (no login) |
| `/event/[slug]/photos` | Public QR photo wall (upload + gallery, no login) |

## Notes / MVP limits

- Free-tier events are capped at 30 photos (`src/app/api/photos/[slug]/route.ts`)
  and show a "Made with EventFlow" watermark on the invite page.
- Stripe checkout marks an event `isPremium` and the owning user `plan: "pro"`
  on `checkout.session.completed` — see `src/app/api/stripe/webhook/route.ts`.
  Point a Stripe CLI or dashboard webhook at `/api/stripe/webhook` to test.
