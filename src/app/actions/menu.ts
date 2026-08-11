"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";
import { Category } from "@/generated/prisma/client";

export async function createMenuItem(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as Category;
  const image = formData.get("image") as File | null;
  
  let imageUrl = null;
  
  if (image && image.size > 0) {
    const blob = await put(image.name, image, {
      access: 'public',
    });
    imageUrl = blob.url;
  }

  await prisma.menuItem.create({
    data: {
      name,
      description,
      category,
      imageUrl,
      isAvailableThisWeek: true,
    }
  });
  
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteMenuItem(id: string, existingImageUrl: string | null) {
  if (existingImageUrl) {
    try {
      await del(existingImageUrl);
    } catch(e) {}
  }

  await prisma.menuItem.delete({
    where: { id }
  });
  
  revalidatePath("/admin");
  revalidatePath("/");
}
