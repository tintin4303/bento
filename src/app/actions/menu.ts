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
  const optionsRequired = formData.get("optionsRequired") === "true";
  
  const optionsStr = formData.get("options") as string;
  const options = optionsStr ? JSON.parse(optionsStr) : [];

  let imageUrl = null;
  if (image && image.size > 0) {
    const blob = await put(`menu_${chefId}_${image.name}`, image, { access: "public" });
    imageUrl = blob.url;
  }

  await prisma.menuItem.create({
    data: { 
      name, 
      description, 
      category, 
      imageUrl, 
      chefId,
      optionsRequired,
      options: {
        create: options.map((label: string) => ({ label }))
      }
    },
  });

  revalidatePath("/admin");
}

export async function updateMenuItem(id: string, formData: FormData, existingImageUrl: string | null) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as Category;
  const image = formData.get("image") as File | null;
  const chefId = (session.user as any).id;
  
  let imageUrl = existingImageUrl;
  if (image && image.size > 0) {
    if (existingImageUrl) {
      try { await del(existingImageUrl); } catch (e) {}
    }
    const blob = await put(`menu_${chefId}_${image.name}`, image, { access: "public" });
    imageUrl = blob.url;
  }

  await prisma.menuItem.update({
    where: { id },
    data: { name, description, category, imageUrl },
  });

  revalidatePath("/admin");
}

export async function createMenuItemOption(menuItemId: string, label: string) {
  await prisma.menuItemOption.create({
    data: { menuItemId, label }
  });
  revalidatePath("/admin");
}

export async function deleteMenuItemOption(id: string) {
  await prisma.menuItemOption.delete({ where: { id } });
  revalidatePath("/admin");
}

export async function setOptionsRequired(menuItemId: string, required: boolean) {
  await prisma.menuItem.update({
    where: { id: menuItemId },
    data: { optionsRequired: required }
  });
  revalidatePath("/admin");
}

export async function deleteMenuItem(id: string, existingImageUrl: string | null) {
  if (existingImageUrl) {
    try { await del(existingImageUrl); } catch (e) {}
  }
  await prisma.menuItem.delete({ where: { id } });
  revalidatePath("/admin");
}
