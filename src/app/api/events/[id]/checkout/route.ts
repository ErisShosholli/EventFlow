import { handleCreateCheckout } from "@/server/controllers/checkout.controller";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleCreateCheckout(request, id);
}
