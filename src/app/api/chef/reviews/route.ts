import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chefId = (session.user as any).id;

  const recentReviews = await prisma.review.findMany({
    where: { cart: { orders: { some: { menuItem: { chefId } } } } },
    include: { cart: { include: { guest: true, orders: { include: { menuItem: true } } } } },
    orderBy: { cart: { targetDate: "desc" } },
    take: 10,
  });

  return NextResponse.json({
    recentReviews,
  });
}
