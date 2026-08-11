"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createDishRequest(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "USER") throw new Error("Unauthorized");
  const guestId = (session.user as any).id;
  const connectedChefId = (session.user as any).connectedChefId;

  if (!connectedChefId) throw new Error("Not connected to a chef");

  const dishName = formData.get("dishName") as string;
  const notes = formData.get("notes") as string | null;

  if (!dishName) throw new Error("Dish name is required");

  await prisma.dishRequest.create({
    data: {
      guestId,
      chefId: connectedChefId,
      dishName,
      notes,
    }
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateDishRequestStatus(id: string, status: "PENDING" | "ACCEPTED" | "REJECTED", replyNote?: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") throw new Error("Unauthorized");
  const chefId = (session.user as any).id;

  const request = await prisma.dishRequest.findUnique({ where: { id } });
  if (!request || request.chefId !== chefId) throw new Error("Not found");

  await prisma.dishRequest.update({
    where: { id },
    data: { status, replyNote: replyNote ?? null }
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
