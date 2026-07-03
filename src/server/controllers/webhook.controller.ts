import type Stripe from "stripe";
import { prisma } from "@/server/lib/prisma";
import {
  applyPaymentSideEffect,
  revertPaymentSideEffect,
} from "@/server/services/payment.service";
import { PaymentStatus } from "@/generated/prisma/enums";

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "charge.refunded":
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;
    default:
      break;
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const payment = await prisma.payment.findUnique({
    where: { stripeSessionId: session.id },
  });

  // No matching Payment row means this session wasn't created through our
  // checkout flow — nothing for us to reconcile.
  if (!payment) return;

  // Idempotent no-op: Stripe retries webhooks, and this may already be processed.
  if (payment.status === PaymentStatus.PAID) return;

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.PAID, stripePaymentId: paymentIntentId },
    });
    await applyPaymentSideEffect(payment.type, payment.eventId, tx);
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const paymentIntentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) return;

  const payment = await prisma.payment.findFirst({
    where: { stripePaymentId: paymentIntentId },
  });

  if (!payment || payment.status === PaymentStatus.REFUNDED) return;

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.REFUNDED },
    });
    await revertPaymentSideEffect(payment.type, payment.eventId, tx);
  });
}
