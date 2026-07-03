import Stripe from "stripe";

let client: Stripe | undefined;

/**
 * Lazily constructed so importing this module never throws when
 * STRIPE_SECRET_KEY is unset (e.g. during `next build`'s route
 * page-data collection, which evaluates route modules without a
 * runtime request). Only code paths that actually call Stripe pay
 * the cost of requiring the key.
 */
function getStripeClient(): Stripe {
  if (!client) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      throw new Error("Missing STRIPE_SECRET_KEY environment variable");
    }
    client = new Stripe(apiKey, { apiVersion: "2026-06-24.dahlia" });
  }
  return client;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop, receiver) {
    return Reflect.get(getStripeClient(), prop, receiver);
  },
});
