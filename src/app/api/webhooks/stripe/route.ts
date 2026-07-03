import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/server/lib/stripe";
import { handleStripeWebhookEvent } from "@/server/controllers/webhook.controller";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (error) {
    // Only an actual signature failure is the caller's fault; anything
    // else (e.g. missing env config) is ours and must 500 so Stripe
    // retries instead of dropping the event as rejected.
    if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 500 });
  }

  try {
    await handleStripeWebhookEvent(event);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch {
    // Non-2xx makes Stripe retry the webhook later (CLAUDE.md §4).
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
