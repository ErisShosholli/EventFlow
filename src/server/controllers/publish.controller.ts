import { NextResponse } from "next/server";
import { auth } from "@/server/lib/auth";
import { getEventForUser } from "@/server/services/event.service";
import { getUserPlan } from "@/server/services/user.service";
import { createCheckoutSession } from "@/server/services/payment.service";
import { getTemplate } from "@/templates/registry";
import { PaymentType, Plan, EventStatus } from "@/generated/prisma/enums";

export async function handlePublish(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const event = await getEventForUser(eventId, session.user.id);
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (event.status === EventStatus.PUBLISHED) {
    return NextResponse.json({ published: true }, { status: 200 });
  }

  const plan = await getUserPlan(session.user.id);
  const template = getTemplate(event.templateId);
  const templateUnlocked =
    !template?.isPremium || event.hasPremiumTemplate || plan === Plan.PRO;

  // CLAUDE.md §6: never trust the client — re-verify the premium template
  // guard here, in the publish controller, not just in the UI.
  if (!templateUnlocked) {
    return NextResponse.json(
      { error: "Unlock the premium template before publishing." },
      { status: 400 },
    );
  }

  const result = await createCheckoutSession({
    eventId: event.id,
    userId: session.user.id,
    paymentType: PaymentType.PUBLISH,
  });

  return NextResponse.json(result, { status: 200 });
}
