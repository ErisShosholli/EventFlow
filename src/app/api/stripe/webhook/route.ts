import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 501 }
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, eventId } = session.metadata ?? {};

    if (userId && eventId) {
      await prisma.$transaction([
        prisma.event.update({
          where: { id: eventId },
          data: { isPremium: true },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { plan: "pro" },
        }),
        prisma.payment.updateMany({
          where: { userId, eventId, status: "pending" },
          data: { status: "paid" },
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
