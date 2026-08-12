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

export async function createCart(
  items: { menuItemId: string; selectedOptionId?: string; notes?: string }[],
  targetDateStr: string
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "USER") throw new Error("Unauthorized");
  const guestId = (session.user as any).id;

  await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.create({
      data: {
        guestId,
        targetDate: new Date(targetDateStr),
      }
    });

    for (const item of items) {
      await tx.order.create({
        data: {
          cartId: cart.id,
          guestId,
          menuItemId: item.menuItemId,
          selectedOptionId: item.selectedOptionId || null,
          notes: item.notes || null,
        }
      });
    }
  });
}

export async function cancelCart(id: string) {
  await prisma.cart.delete({ where: { id } });
}

export async function updateCartChefNote(id: string, chefNote: string) {
  await prisma.cart.update({
    where: { id },
    data: { chefNote }
  });
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isFavorite }
  });
}

export async function updateCartStatus(id: string, status: "PENDING" | "COOKING" | "READY" | "COMPLETED") {
  await prisma.cart.update({
    where: { id },
    data: { status }
  });
}

export async function submitReview(cartId: string, rating: number, feedback?: string) {
  await prisma.review.create({
    data: { cartId, rating, feedback }
  });
}
