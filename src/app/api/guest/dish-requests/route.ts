import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id;

  const dishRequests = await prisma.dishRequest.findMany({
    where: { guestId: userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return NextResponse.json({
    dishRequests,
  });
}
