import { prisma } from "@/server/lib/prisma";
import { stripe } from "@/server/lib/stripe";
import { getStripePriceId } from "@/server/lib/pricing";
import { PaymentType, PaymentStatus, EventStatus, Plan } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

type Db = typeof prisma | Prisma.TransactionClient;

export async function applyPaymentSideEffect(
  paymentType: PaymentType,
  eventId: string,
  db: Db = prisma,
) {
  if (paymentType === PaymentType.PUBLISH) {
    await db.event.update({
      where: { id: eventId },
      data: { status: EventStatus.PUBLISHED, publishedAt: new Date() },
    });
  } else {
    await db.event.update({
      where: { id: eventId },
      data: { hasPremiumTemplate: true },
    });
  }
}

export async function revertPaymentSideEffect(
  paymentType: PaymentType,
  eventId: string,
  db: Db = prisma,
) {
  if (paymentType === PaymentType.PUBLISH) {
    await db.event.update({
      where: { id: eventId },
      data: { status: EventStatus.DRAFT, publishedAt: null },
    });
  } else {
    await db.event.update({
      where: { id: eventId },
      data: { hasPremiumTemplate: false },
    });
  }
}

export async function createCheckoutSession(params: {
  eventId: string;
  userId: string;
  paymentType: PaymentType;
}): Promise<{ bypassed: true } | { checkoutUrl: string }> {
  const { eventId, userId, paymentType } = params;

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  // Pro subscribers skip Checkout entirely for both money events (CLAUDE.md §3.3).
  if (user.plan === Plan.PRO) {
    await applyPaymentSideEffect(paymentType, eventId);
    return { bypassed: true };
  }

  const priceId = getStripePriceId(paymentType);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/events/${eventId}?checkout=success`,
    cancel_url: `${appUrl}/dashboard/events/${eventId}?checkout=cancelled`,
    metadata: { eventId, userId, paymentType },
  });

  if (!checkoutSession.url) {
    throw new Error("Stripe did not return a Checkout URL");
  }

  await prisma.payment.create({
    data: {
      userId,
      eventId,
      type: paymentType,
      amountCents: checkoutSession.amount_total ?? 0,
      status: PaymentStatus.PENDING,
      stripeSessionId: checkoutSession.id,
    },
  });

  return { checkoutUrl: checkoutSession.url };
}
