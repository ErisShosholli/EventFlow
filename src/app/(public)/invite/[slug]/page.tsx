import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedEventBySlug } from "@/server/services/event.service";
import { getTemplate } from "@/templates/registry";
import { toEventData } from "@/templates/mapper";

// Dedupes the query between generateMetadata and the page render.
const getEvent = cache(getPublishedEventBySlug);

interface InvitePageProps {
  params: Promise<{ slug: string }>;
}

// CLAUDE.md §12: invites are shared over WhatsApp — the link preview should
// show the host-authored title, not the app name.
export async function generateMetadata({ params }: InvitePageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) {
    return {};
  }

  return {
    title: event.title,
    description: event.description || `You're invited to ${event.title}`,
  };
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;

  const event = await getEvent(slug);
  if (!event) {
    notFound();
  }

  const template = getTemplate(event.templateId);
  if (!template) {
    notFound();
  }

  const Template = template.component;

  return <Template event={toEventData(event)} />;
}
