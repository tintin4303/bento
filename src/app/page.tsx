import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { MonkeyEmpty } from "@/components/icons/MonkeyEmpty";
import { OrderForm } from "@/components/OrderForm";
import { CancelButton } from "@/components/CancelButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CalendarView } from "@/components/CalendarView";
import { GuestMenu } from "@/components/GuestMenu";
import { HistoryList } from "@/components/HistoryList";
import { ProfileForm } from "@/components/ProfileForm";
import { DishRequestForm } from "@/components/DishRequestForm";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/login");

  // If the guest is not connected to any chef yet, don't crash, just show empty
  const connectedChefId = user.connectedChefId;

  const menuItems = connectedChefId ? await prisma.menuItem.findMany({
    where: { isAvailableThisWeek: true, chefId: connectedChefId },
    orderBy: [
      { isFavorite: "desc" },
      { category: "asc" }
    ]
  }) : [];

  const activeOrders = await prisma.order.findMany({
    where: { status: { not: "COMPLETED" }, guestId: user.id },
    include: { menuItem: true },
    orderBy: { targetDate: "asc" }
  });

  const dishRequests = await prisma.dishRequest.findMany({
    where: { guestId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const completedOrders = await prisma.order.findMany({
    where: { status: "COMPLETED", guestId: user.id },
    include: { menuItem: true, review: true },
    orderBy: { targetDate: "desc" }
  });

  // Nodes for Modals
  const historyNode = <HistoryList completedOrders={completedOrders as any} />;
  
  const dishRequestNode = (
    <div>
      <p className="text-sm text-gray-500 mb-4">Send your chef a request for a new dish!</p>
      <DishRequestForm />
      {dishRequests.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Recent Requests</h3>
          {dishRequests.map(req => (
            <div key={req.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
              <div>
                <p className="font-bold text-sm text-gray-900">{req.dishName}</p>
                {req.notes && <p className="text-xs text-gray-500 italic mt-0.5">"{req.notes}"</p>}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                req.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const profileNode = <ProfileForm user={dbUser} isChef={false} />;

  return (
    <div className="p-4 max-w-2xl mx-auto w-full pt-10 overflow-hidden">
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Bento Box 🍱</h1>
          <p className="text-gray-500 text-sm font-semibold">Hello, {dbUser.displayName || dbUser.username}!</p>
        </div>
        <GuestMenu 
          historyNode={historyNode} 
          dishRequestNode={dishRequestNode} 
          profileNode={profileNode} 
        />
      </div>

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
                    For: {order.targetDate.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok', weekday: 'long', month: 'short', day: 'numeric' })}
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

      <div className="flex justify-between items-center mb-6 mt-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">This Week's Menu</h2>
          <p className="text-gray-500 text-sm mt-1">Select your lunch for the week! ❤️</p>
        </div>
      </div>
      
      {menuItems.length === 0 ? (
        <Card className="text-center py-12 flex flex-col items-center">
          <MonkeyEmpty className="w-32 h-32 text-secondary mb-4" />
          <h2 className="text-xl font-semibold text-gray-800">No menu set yet!</h2>
          <p className="text-gray-500">The chef is still deciding what to cook.</p>
        </Card>
      ) : (
        <div className="grid gap-4 mb-12">
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
