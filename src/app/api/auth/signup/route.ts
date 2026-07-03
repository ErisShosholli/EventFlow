import { handleSignup } from "@/server/controllers/auth.controller";

export async function POST(request: Request) {
  return handleSignup(request);
}
