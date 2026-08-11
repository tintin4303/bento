"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isAvailableThisWeek: isAvailable }
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createOrder(menuItemId: string, notes?: string, targetDateStr?: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "USER") throw new Error("Unauthorized");
  const guestId = (session.user as any).id;

  await prisma.order.create({
    data: {
      menuItemId,
      guestId,
      notes,
      targetDate: targetDateStr ? new Date(targetDateStr) : new Date(),
    }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function cancelOrder(id: string) {
  await prisma.order.delete({
    where: { id }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateChefNote(id: string, chefNote: string) {
  await prisma.order.update({
    where: { id },
    data: { chefNote }
  });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/history");
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isFavorite }
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateOrderStatus(id: string, status: "PENDING" | "COOKING" | "READY" | "COMPLETED") {
  await prisma.order.update({
    where: { id },
    data: { status }
  });
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/history");
}

export async function submitReview(orderId: string, rating: number, feedback?: string) {
  await prisma.review.create({
    data: {
      orderId,
      rating,
      feedback
    }
  });
  revalidatePath("/history");
  revalidatePath("/admin");
}
