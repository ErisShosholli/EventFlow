import { NextResponse } from "next/server";
import { createUser, EmailInUseError } from "@/server/services/user.service";
import { signupSchema } from "@/lib/schemas/auth";

export async function handleSignup(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const user = await createUser(parsed.data);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof EmailInUseError) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 },
      );
    }
    throw error;
  }
}
