"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");
  return (session.user as any).id as string;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateDisplayName(formData: FormData) {
  const userId = await getAuthenticatedUserId();
  const displayName = formData.get("displayName") as string;
  await prisma.user.update({
    where: { id: userId },
    data: { displayName: displayName?.trim() || undefined },
  });
  revalidateAll();
}

export async function updateAvatar(formData: FormData) {
  const userId = await getAuthenticatedUserId();
  const avatar = formData.get("avatar") as File | null;
  if (!avatar || avatar.size === 0) return;
  const blob = await put(`avatar_${userId}_${avatar.name}`, avatar, { access: "public" });
  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: blob.url },
  });
  revalidateAll();
}

export async function updatePreferences(formData: FormData) {
  const userId = await getAuthenticatedUserId();
  const parse = (key: string) =>
    formData.get(key)
      ? String(formData.get(key)).split(",").map((s) => s.trim()).filter(Boolean)
      : [];
  await prisma.user.update({
    where: { id: userId },
    data: {
      likes: parse("likes"),
      dislikes: parse("dislikes"),
      allergies: parse("allergies"),
    },
  });
  revalidateAll();
}

// Keep old function for any remaining callers
export async function updateProfile(formData: FormData) {
  await updateDisplayName(formData);
  await updatePreferences(formData);
}
