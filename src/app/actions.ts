"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isAvailableThisWeek: isAvailable }
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function createOrder(menuItemId: string, notes?: string) {
  await prisma.order.create({
    data: {
      menuItemId,
      notes,
    }
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
