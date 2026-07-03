import { PaymentType } from "@/generated/prisma/enums";

/**
 * Stripe Price IDs are the source of truth for amounts (set in the Stripe
 * dashboard); we only need to know which env var backs which PaymentType.
 */
export function getStripePriceId(paymentType: PaymentType): string {
  const priceId =
    paymentType === PaymentType.PUBLISH
      ? process.env.STRIPE_PRICE_PUBLISH
      : process.env.STRIPE_PRICE_TEMPLATE_PREMIUM;

  if (!priceId) {
    throw new Error(`Missing Stripe price id env var for paymentType=${paymentType}`);
  }

  return priceId;
}
