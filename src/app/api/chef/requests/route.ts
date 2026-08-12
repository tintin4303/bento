import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/** GET /api/chef/requests — chef's pending dish requests */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const chefId = (session.user as any).id;

  const pendingRequests = await prisma.dishRequest.findMany({
    where: { chefId, status: "PENDING" },
    include: { guest: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ pendingRequests });
}
