import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { toggleMenuItemAvailability } from "@/app/actions";
import { MenuItemForm } from "@/components/MenuItemForm";
import { deleteMenuItem } from "@/app/actions/menu";
import { ChefMenu } from "@/components/ChefMenu";
import { FeedbackInbox } from "@/components/FeedbackInbox";
import { DishRequestInbox } from "@/components/DishRequestInbox";
import { ProfileForm } from "@/components/ProfileForm";
import { ConnectedGuestsList } from "@/components/ConnectedGuestsList";
import { ChefActiveOrders } from "@/components/ChefActiveOrders";
import { ChefMenuClient } from "@/components/ChefMenuClient";
import { ChefStatsCards } from "@/components/ChefStatsCards";

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  PENDING:  { label: "Pending",  dot: "bg-yellow-400", badge: "bg-yellow-50  text-yellow-700 border border-yellow-200" },
  COOKING:  { label: "Cooking",  dot: "bg-orange-400", badge: "bg-orange-50  text-orange-700 border border-orange-200" },
  READY:    { label: "Ready",    dot: "bg-blue-400",   badge: "bg-blue-50    text-blue-700   border border-blue-200" },
  COMPLETED:{ label: "Done",     dot: "bg-green-400",  badge: "bg-green-50   text-green-700  border border-green-200" },
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const chefId = (session.user as any).id;

  const dbUser = await prisma.user.findUnique({ where: { id: chefId } });
  if (!dbUser) redirect("/login");

  const connectedGuests = await prisma.user.findMany({
    where: { connectedChefId: chefId }
  });

  const menuItems = await prisma.menuItem.findMany({
    where: { chefId },
    include: { options: true },
    orderBy: { category: "asc" }
  });

  const activeOrders = await prisma.cart.findMany({
    where: { status: { not: "COMPLETED" }, orders: { some: { menuItem: { chefId } } } },
    include: {
      guest: true,
      orders: { include: { menuItem: true, selectedOption: true } }
    },
    orderBy: { targetDate: "asc" }
  });

  const recentReviews = await prisma.review.findMany({
    where: { cart: { orders: { some: { menuItem: { chefId } } } } },
    include: {
      cart: {
        include: { guest: true, orders: { include: { menuItem: true } } }
      }
    },
    orderBy: { cart: { targetDate: "desc" } },
    take: 10
  });

  const pendingRequests = await prisma.dishRequest.findMany({
    where: { chefId, status: "PENDING" },
    include: { guest: true },
    orderBy: { createdAt: "desc" }
  });

  const feedbackNode    = <FeedbackInbox    recentReviews={recentReviews as any} />;
  const dishRequestNode = <DishRequestInbox pendingRequests={pendingRequests as any} />;
  const profileNode     = <ProfileForm      user={dbUser} isChef={true} />;
  const guestsNode      = <ConnectedGuestsList guests={connectedGuests as any} />;

  const visibleItems  = menuItems.filter(i => i.isAvailableThisWeek);
  const hiddenItems   = menuItems.filter(i => !i.isAvailableThisWeek);

  return (
    <div className="min-h-screen bg-[#FDF2F8] overflow-x-hidden">
      {/* ─── Top Nav Bar ─── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {dbUser.avatarUrl ? (
              <img src={dbUser.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-200" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-lg ring-2 ring-pink-200">
                👨‍🍳
              </div>
            )}
            <div>
              <p className="font-black text-gray-900 text-sm leading-none">{dbUser.displayName || dbUser.username}</p>
              <p className="text-[11px] text-gray-400 font-semibold">Chef Dashboard</p>
            </div>
          </div>
          <ChefMenu
            feedbackNode={feedbackNode}
            dishRequestNode={dishRequestNode}
            profileNode={profileNode}
            guestsNode={guestsNode}
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8 space-y-8">

        {/* ─── Stats Row ─── */}
        <ChefStatsCards
          initialMenuItems={menuItems as any}
          initialActiveOrders={activeOrders as any}
          initialPendingRequests={pendingRequests as any}
        />

        {/* ─── Main Grid ─── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* ─── LEFT: Menu Panel ─── */}
          <div id="menu-panel" className="lg:col-span-2">
            <ChefMenuClient initialItems={menuItems as any} />
          </div>

          {/* ─── RIGHT: Active Orders ─── */}
          <div id="active-orders" className="lg:col-span-3 space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-black text-gray-900">Active Orders</h2>
              <span className="text-xs text-gray-400 font-semibold">{activeOrders.length} order{activeOrders.length !== 1 ? "s" : ""}</span>
            </div>
            <ChefActiveOrders initialOrders={activeOrders as any} />
          </div>

        </div>
      </main>
    </div>
  );
}
