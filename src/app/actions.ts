"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// NOTE: revalidatePath is intentionally NOT called in most actions here.
// The guest and chef dashboards use client-side polling (usePolling hook)
// that fetches fresh data every 3 s directly from API routes.
// Adding revalidatePath forces a full server-component re-render which adds
// ~2 s of latency on every button click — completely unnecessary when polling
// already keeps the UI up to date.
//
// revalidatePath is only kept for actions that affect server-rendered static
// shells (menu list visible on first load) where polling does not apply.

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isAvailableThisWeek: isAvailable }
  });
  // Menu availability IS baked into the initial server-render of the guest
  // page, so we still need to invalidate it here. The guest reloads or
  // navigation will then pick up the fresh menu.
  const { revalidatePath } = await import("next/cache");
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
  // No revalidatePath — polling on /api/orders and /api/chef/orders picks this up.
}

export async function cancelOrder(id: string) {
  await prisma.order.delete({ where: { id } });
  // No revalidatePath — polling picks this up.
}

export async function updateChefNote(id: string, chefNote: string) {
  await prisma.order.update({
    where: { id },
    data: { chefNote }
  });
  // No revalidatePath — polling picks this up.
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isFavorite }
  });
  // FavoriteButton already has optimistic state — no revalidatePath needed.
}

export async function updateOrderStatus(id: string, status: "PENDING" | "COOKING" | "READY" | "COMPLETED") {
  await prisma.order.update({
    where: { id },
    data: { status }
  });
  // No revalidatePath — polling on both sides picks this up within 3 s.
}

export async function submitReview(orderId: string, rating: number, feedback?: string) {
  await prisma.review.create({
    data: { orderId, rating, feedback }
  });
  // No revalidatePath — history page reloads on next navigation.
}
