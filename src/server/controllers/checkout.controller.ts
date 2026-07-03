import { NextResponse } from "next/server";
import { auth } from "@/server/lib/auth";
import { getEventForUser } from "@/server/services/event.service";
import { createCheckoutSession } from "@/server/services/payment.service";
import { checkoutSchema } from "@/lib/schemas/checkout";
import { PaymentType, EventStatus } from "@/generated/prisma/enums";

export async function handleCreateCheckout(request: Request, eventId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await getEventForUser(eventId, session.user.id);
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { paymentType } = parsed.data;

  if (paymentType === PaymentType.TEMPLATE && event.hasPremiumTemplate) {
    return NextResponse.json(
      { error: "Premium template already unlocked" },
      { status: 400 },
    );
  }
  if (paymentType === PaymentType.PUBLISH && event.status === EventStatus.PUBLISHED) {
    return NextResponse.json({ error: "Event already published" }, { status: 400 });
  }

  const result = await createCheckoutSession({
    eventId: event.id,
    userId: session.user.id,
    paymentType,
  });

  return NextResponse.json(result, { status: 200 });
}
