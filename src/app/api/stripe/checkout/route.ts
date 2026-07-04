import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

// Flat one-time price for unlocking a single event (premium templates,
// unlimited photos, no watermark). Subscription tiers can reuse this
// route with a different Stripe price/mode once defined.
const EVENT_UPGRADE_PRICE_CENTS = 1000; // €10.00

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Payments are not configured yet. Set STRIPE_SECRET_KEY." },
      { status: 501 }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await req.json();
  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event || event.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const origin = new URL(req.url).origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          unit_amount: EVENT_UPGRADE_PRICE_CENTS,
          product_data: { name: `EventFlow Pro upgrade — ${event.title}` },
        },
        quantity: 1,
      },
    ],
    metadata: { userId: session.user.id, eventId: event.id },
    success_url: `${origin}/dashboard/events/${event.id}?upgraded=1`,
    cancel_url: `${origin}/dashboard/events/${event.id}`,
  });

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      eventId: event.id,
      amount: EVENT_UPGRADE_PRICE_CENTS,
      status: "pending",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
