import { customAlphabet } from "nanoid";
import { prisma } from "@/lib/prisma";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 6);

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export async function generateUniqueSlug(title: string) {
  const base = slugify(title) || "event";
  let slug = base;

  while (await prisma.event.findUnique({ where: { slug } })) {
    slug = `${base}-${nanoid()}`;
  }

  return slug;
}
