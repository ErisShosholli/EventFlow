import bcrypt from "bcryptjs";
import { prisma } from "@/server/lib/prisma";
import { Plan } from "@/generated/prisma/enums";

export class EmailInUseError extends Error {}

export async function getUserPlan(userId: string): Promise<Plan> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  return user?.plan ?? Plan.FREE;
}

export async function createUser(params: {
  name: string;
  email: string;
  password: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: params.email },
  });
  if (existing) {
    throw new EmailInUseError("Email already in use");
  }

  const passwordHash = await bcrypt.hash(params.password, 12);

  return prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      password: passwordHash,
    },
    select: { id: true, name: true, email: true },
  });
}
