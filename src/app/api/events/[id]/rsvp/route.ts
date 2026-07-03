import { handleCreateRsvp } from "@/server/controllers/rsvp.controller";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleCreateRsvp(request, id);
}
