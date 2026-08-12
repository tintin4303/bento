import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/** GET /api/chef/orders — chef's active orders with guest info */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chefId = (session.user as any).id;

  const activeOrders = await prisma.order.findMany({
    where: { status: { not: "COMPLETED" }, menuItem: { chefId } },
    include: { menuItem: true, guest: true },
    orderBy: { targetDate: "asc" },
  });

  return NextResponse.json({ activeOrders });
}
