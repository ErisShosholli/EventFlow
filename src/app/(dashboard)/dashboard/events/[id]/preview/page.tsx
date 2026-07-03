import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/server/lib/auth";
import { getEventForUser } from "@/server/services/event.service";
import { getTemplate } from "@/templates/registry";
import { toEventData } from "@/templates/mapper";

export default async function EventPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const event = await getEventForUser(id, session.user.id);
  if (!event) {
    notFound();
  }

  const template = getTemplate(event.templateId);
  if (!template) {
    notFound();
  }

  const Template = template.component;

  return (
    <div className="-mx-6 -my-8">
      <div className="flex items-center justify-between bg-gray-100 px-6 py-2 text-sm text-gray-600">
        <span>
          Previewing &quot;{event.title}&quot; ({event.status})
        </span>
        <Link href={`/dashboard/events/${event.id}`} className="underline">
          Back to event
        </Link>
      </div>
      <Template event={toEventData(event)} />
    </div>
  );
}
