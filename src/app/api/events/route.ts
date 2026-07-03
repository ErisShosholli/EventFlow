import { handleCreateEvent } from "@/server/controllers/event.controller";

export async function POST(request: Request) {
  return handleCreateEvent(request);
}
