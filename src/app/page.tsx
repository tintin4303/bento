import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { MonkeyEmpty } from "@/components/icons/MonkeyEmpty";
import { OrderForm } from "@/components/OrderForm";
import { LogoutButton } from "@/components/LogoutButton";
import { CancelButton } from "@/components/CancelButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CalendarView } from "@/components/CalendarView";
import Link from "next/link";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role === "ADMIN") {
    redirect("/admin");
  }

  const menuItems = await prisma.menuItem.findMany({
    where: { isAvailableThisWeek: true },
    orderBy: [
      { isFavorite: "desc" },
      { category: "asc" }
    ]
  });

  const activeOrders = await prisma.order.findMany({
    where: { status: { not: "COMPLETED" } },
    include: { menuItem: true },
    orderBy: { targetDate: "asc" }
  });

  return (
    <div className="p-4 max-w-2xl mx-auto w-full pt-10 overflow-hidden">
      <CalendarView orders={activeOrders as any} />
      
      {activeOrders.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Scheduled Orders</h2>
          <div className="space-y-3">
            {activeOrders.map(order => (
              <Card key={order.id} className="flex justify-between items-center bg-pink-50/50 border-secondary/20">
                <div>
                  <h3 className="font-bold text-gray-900">{order.menuItem.name}</h3>
                  <p className="text-xs text-gray-500 font-semibold mb-1">
                    For: {order.targetDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-gray-500">
                    Status: <strong className="text-secondary">{order.status}</strong>
                  </p>
                </div>
                {order.status === "PENDING" && <CancelButton orderId={order.id} />}
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h1 className="text-3xl font-bold text-gray-900">This Week's Menu</h1>
        <LogoutButton />
      </div>
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-500">Select your lunch for the week! ❤️</p>
        <Link href="/history" className="text-sm font-bold text-secondary bg-pink-50 px-4 py-2 rounded-xl hover:bg-pink-100 transition-colors">
          View History
        </Link>
      </div>
      
      {menuItems.length === 0 ? (
        <Card className="text-center py-12 flex flex-col items-center">
          <MonkeyEmpty className="w-32 h-32 text-secondary mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">No menu set yet!</h2>
          <p className="text-gray-500">The chef is still deciding what to cook.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {menuItems.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-secondary transition-colors overflow-hidden relative">
              <div className="absolute top-4 right-4 sm:static">
                <FavoriteButton menuItemId={item.id} isFavorite={item.isFavorite} />
              </div>
              <div className="flex gap-4 items-center flex-1">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-pink-50 flex-shrink-0" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 pr-8 sm:pr-0">{item.name}</h3>
                  {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                  <span className="text-xs font-semibold px-2 py-1 bg-pink-100 text-secondary rounded-full mt-2 inline-block">
                    {item.category}
                  </span>
                </div>
              </div>
              <OrderForm menuItemId={item.id} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
