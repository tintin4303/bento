"use server";

import prisma from "@/lib/prisma";
import { put, del } from "@vercel/blob";
import { Category } from "@/generated/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMenuItem(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
  const chefId = (session.user as any).id;

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as Category;
  const image = formData.get("image") as File | null;

  let imageUrl = null;
  if (image && image.size > 0) {
    const blob = await put(`menu_${chefId}_${image.name}`, image, { access: "public" });
    imageUrl = blob.url;
  }

  await prisma.menuItem.create({
    data: { name, description, category, imageUrl, chefId },
  });

  // Menu list is server-rendered on the admin page — revalidate only that.
  revalidatePath("/admin");
}

export async function deleteMenuItem(id: string, existingImageUrl: string | null) {
  if (existingImageUrl) {
    try { await del(existingImageUrl); } catch (e) {}
  }
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/admin");
}
