import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toggleMenuItemAvailability, updateOrderStatus, updateChefNote } from "@/app/actions";
import { MonkeySlider } from "@/components/icons/MonkeySlider";
import { LogoutButton } from "@/components/LogoutButton";
import { MenuItemForm } from "@/components/MenuItemForm";
import { deleteMenuItem } from "@/app/actions/menu";
import { UserProfileBadge } from "@/components/UserProfileBadge";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const chefId = (session.user as any).id;

  const menuItems = await prisma.menuItem.findMany({
    where: { chefId },
    orderBy: { category: "asc" }
  });

  const activeOrders = await prisma.order.findMany({
    where: { status: { not: "COMPLETED" }, menuItem: { chefId } },
    include: { menuItem: true, guest: true },
    orderBy: { targetDate: "asc" }
  });

  const recentReviews = await prisma.review.findMany({
    where: { order: { menuItem: { chefId } } },
    include: { order: { include: { menuItem: true, guest: true } } },
    orderBy: { order: { date: "desc" } },
    take: 10
  });

  const pendingRequests = await prisma.dishRequest.findMany({
    where: { chefId, status: "PENDING" },
    include: { guest: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="p-4 max-w-6xl mx-auto w-full pt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      {/* Menu Management */}
      <div className="lg:col-span-1">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Setup</h1>
            <p className="text-gray-500">Manage dishes for the week.</p>
          </div>
          <div className="flex items-center gap-2">
            <UserProfileBadge />
            <LogoutButton />
          </div>
        </div>
        
        <MenuItemForm />

        <div className="space-y-3">
          {menuItems.map(item => (
            <Card key={item.id} className="py-4 px-5">
              <div className="flex gap-4">
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-pink-50" />
                )}
                <div className="flex-1">
                  <h3 className="text-md font-bold text-gray-900">{item.name} {item.isFavorite && "❤️"}</h3>
                  <span className="text-xs text-gray-400">{item.category}</span>
                  
                  <div className="flex gap-2 mt-3">
                    <form action={async () => {
                      "use server";
                      await toggleMenuItemAvailability(item.id, !item.isAvailableThisWeek);
                    }}>
                      <Button variant={item.isAvailableThisWeek ? "primary" : "secondary"} className="text-xs py-1 px-2">
                        {item.isAvailableThisWeek ? "Available" : "Hidden"}
                      </Button>
                    </form>
                    
                    <form action={async () => {
                      "use server";
                      await deleteMenuItem(item.id, item.imageUrl);
                    }}>
                      <Button variant="outline" className="text-xs py-1 px-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Order Kanban */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
        <p className="text-gray-500 mb-6">Track your cooking progress.</p>
        
        <div className="space-y-4">
          {activeOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No active orders right now.</p>
          ) : (
            activeOrders.map(order => (
              <Card key={order.id} className="p-4 border-secondary/20 bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">{order.menuItem.name} {order.menuItem.isFavorite && "❤️"}</h3>
                    <p className="text-xs text-gray-500 mb-1 font-semibold">For: {order.guest.displayName || order.guest.username}</p>
                    <p className="text-xs text-gray-400">
                      Date: {order.targetDate.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok', weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-pink-100 text-secondary rounded-full">
                    {order.status}
                  </span>
                </div>
                
                {order.notes && (
                  <p className="text-sm text-gray-600 bg-pink-50 p-2 rounded-md mb-3 italic border border-pink-100">
                    "{order.notes}"
                  </p>
                )}

                <form action={async (formData) => {
                  "use server";
                  const note = formData.get("chefNote") as string;
                  if (note) {
                    await updateChefNote(order.id, note);
                  }
                }} className="mb-3 flex gap-2">
                  <input 
                    type="text" 
                    name="chefNote" 
                    placeholder={(order as any).chefNote || "Leave a love note..."} 
                    className="flex-1 text-xs px-2 py-1 border border-pink-100 rounded-md focus:outline-none focus:border-secondary"
                  />
                  <Button type="submit" className="text-[10px] py-1 px-2">Save Note</Button>
                </form>

                <div className="flex gap-2">
                  <form action={async () => { "use server"; await updateOrderStatus(order.id, "COOKING"); }} className="flex-1">
                    <Button variant="outline" className="w-full text-xs py-1 px-0 text-orange-500 border-orange-200 hover:bg-orange-50">Cook</Button>
                  </form>
                  <form action={async () => { "use server"; await updateOrderStatus(order.id, "READY"); }} className="flex-1">
                    <Button variant="outline" className="w-full text-xs py-1 px-0 text-blue-500 border-blue-200 hover:bg-blue-50">Ready</Button>
                  </form>
                  <form action={async () => { "use server"; await updateOrderStatus(order.id, "COMPLETED"); }} className="flex-1">
                    <Button variant="primary" className="w-full text-xs py-1 px-0">Done</Button>
                  </form>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Feedback Inbox */}
      <div className="lg:col-span-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback Inbox</h1>
        <p className="text-gray-500 mb-6">See what she thought of your lunches!</p>
        
        {recentReviews.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No reviews yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {recentReviews.map(review => (
              <Card key={review.id} className="border border-pink-100 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900">{review.order.menuItem.name}</h3>
                  <div className="flex flex-col items-center">
                    <MonkeySlider rating={review.rating} className="w-10 h-10" />
                    <span className="text-xs font-bold text-secondary mt-1">{review.rating}/5</span>
                  </div>
                </div>
                {review.feedback && (
                  <p className="text-sm text-gray-600 bg-pink-50/50 p-3 rounded-lg italic border border-pink-50">
                    "{review.feedback}"
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">{review.order.date.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dish Request Inbox */}
      <div className="lg:col-span-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dish Requests</h1>
        <p className="text-gray-500 mb-6">See what your guests are craving!</p>
        
        {pendingRequests.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No pending requests right now.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <Card key={req.id} className="border border-pink-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{req.dishName}</h3>
                    <p className="text-xs text-gray-500 font-semibold mb-1">From: {req.guest.displayName || req.guest.username}</p>
                    {req.notes && <p className="text-sm text-gray-600 italic mt-1">"{req.notes}"</p>}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <form action={async () => {
                    "use server";
                    const { updateDishRequestStatus } = await import("@/app/actions/requests");
                    await updateDishRequestStatus(req.id, "ACCEPTED");
                  }} className="flex-1">
                    <Button variant="primary" className="w-full text-xs py-2 bg-green-500 hover:bg-green-600 shadow-green-200">
                      Accept 🧑‍🍳
                    </Button>
                  </form>
                  <form action={async () => {
                    "use server";
                    const { updateDishRequestStatus } = await import("@/app/actions/requests");
                    await updateDishRequestStatus(req.id, "REJECTED");
                  }} className="flex-1">
                    <Button variant="outline" className="w-full text-xs py-2 text-red-500 border-red-200 hover:bg-red-50">
                      Decline 🙅‍♂️
                    </Button>
                  </form>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
