import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { toggleMenuItemAvailability, updateOrderStatus } from "@/app/actions";
import { MonkeySlider } from "@/components/icons/MonkeySlider";
import { LogoutButton } from "@/components/LogoutButton";
import { MenuItemForm } from "@/components/MenuItemForm";
import { deleteMenuItem } from "@/app/actions/menu";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const menuItems = await prisma.menuItem.findMany({
    orderBy: { category: "asc" }
  });

  const activeOrders = await prisma.order.findMany({
    where: { status: { not: "COMPLETED" } },
    include: { menuItem: true },
    orderBy: { date: "asc" }
  });

  const recentReviews = await prisma.review.findMany({
    include: { order: { include: { menuItem: true } } },
    orderBy: { order: { date: "desc" } },
    take: 10
  });

  return (
    <div className="p-4 max-w-6xl mx-auto w-full pt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      
      {/* Menu Management */}
      <div className="lg:col-span-1">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu Setup</h1>
            <p className="text-gray-500">Manage dishes for the week.</p>
          </div>
          <LogoutButton />
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
                  <h3 className="text-md font-bold text-gray-900">{item.name}</h3>
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
        
        {activeOrders.length === 0 ? (
          <Card className="text-center py-8">
            <p className="text-gray-500">No active orders yet.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeOrders.map(order => (
              <Card key={order.id} className="border-l-4 border-l-secondary">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.menuItem.name}</h3>
                    {order.notes && <p className="text-sm text-gray-600 mt-1 italic">"{order.notes}"</p>}
                  </div>
                  <span className="px-2 py-1 bg-pink-100 text-secondary text-xs rounded-full font-bold">
                    {order.status}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  {order.status === "PENDING" && (
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "COOKING"); }}>
                      <Button variant="secondary" className="text-sm py-1 px-3">Start Cooking</Button>
                    </form>
                  )}
                  {order.status === "COOKING" && (
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "READY"); }}>
                      <Button variant="primary" className="text-sm py-1 px-3">Ready!</Button>
                    </form>
                  )}
                  {order.status === "READY" && (
                    <form action={async () => { "use server"; await updateOrderStatus(order.id, "COMPLETED"); }}>
                      <Button variant="outline" className="text-sm py-1 px-3">Complete (Delivered)</Button>
                    </form>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
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
                <p className="text-xs text-gray-400 mt-2">{review.order.date.toLocaleDateString()}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
