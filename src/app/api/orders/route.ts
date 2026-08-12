import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/** GET /api/orders — guest's active + unreviewed completed orders */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const [activeOrders, completedOrders] = await Promise.all([
    prisma.order.findMany({
      where: { status: { not: "COMPLETED" }, guestId: userId },
      include: { menuItem: true },
      orderBy: { targetDate: "asc" },
    }),
    prisma.order.findMany({
      where: { status: "COMPLETED", guestId: userId },
      include: { menuItem: true, review: true },
      orderBy: { targetDate: "desc" },
    }),
  ]);

  return NextResponse.json({
    activeOrders,
    unreviewedOrders: completedOrders.filter((o) => !o.review),
  });
}
