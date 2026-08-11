"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const userId = (session.user as any).id;
  const displayName = formData.get("displayName") as string;
  const avatar = formData.get("avatar") as File | null;

  let avatarUrl = undefined;
  if (avatar && avatar.size > 0) {
    const blob = await put(`avatar_${userId}_${avatar.name}`, avatar, { access: 'public' });
    avatarUrl = blob.url;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      displayName: displayName || undefined,
      ...(avatarUrl && { avatarUrl }),
      likes: formData.get("likes") ? String(formData.get("likes")).split(",").map(s => s.trim()).filter(Boolean) : undefined,
      dislikes: formData.get("dislikes") ? String(formData.get("dislikes")).split(",").map(s => s.trim()).filter(Boolean) : undefined,
    }
  });

  revalidatePath("/profile");
  revalidatePath("/");
  revalidatePath("/admin");
}
