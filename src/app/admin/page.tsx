import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { toggleMenuItemAvailability, updateOrderStatus, updateChefNote } from "@/app/actions";
import { MenuItemForm } from "@/components/MenuItemForm";
import { deleteMenuItem } from "@/app/actions/menu";
import { ChefMenu } from "@/components/ChefMenu";
import { FeedbackInbox } from "@/components/FeedbackInbox";
import { DishRequestInbox } from "@/components/DishRequestInbox";
import { ProfileForm } from "@/components/ProfileForm";
import { ConnectedGuestsList } from "@/components/ConnectedGuestsList";
import { ChefActiveOrders } from "@/components/ChefActiveOrders";

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

  const feedbackNode    = <FeedbackInbox    recentReviews={recentReviews as any} />;
  const dishRequestNode = <DishRequestInbox pendingRequests={pendingRequests as any} />;
  const profileNode     = <ProfileForm      user={dbUser} isChef={true} />;
  const guestsNode      = <ConnectedGuestsList guests={connectedGuests as any} />;

  const visibleItems  = menuItems.filter(i => i.isAvailableThisWeek);
  const hiddenItems   = menuItems.filter(i => !i.isAvailableThisWeek);

  return (
    <div className="min-h-screen bg-[#FDF2F8]">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Dishes",    value: menuItems.length,         sub: "in your menu" },
            { label: "On This Week",    value: visibleItems.length,      sub: "available to guests" },
            { label: "Active Orders",   value: activeOrders.length,      sub: "in progress" },
            { label: "Dish Requests",   value: pendingRequests.length,   sub: "awaiting response" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-pink-50 shadow-sm p-5">
              <p className="text-3xl font-black text-secondary">{stat.value}</p>
              <p className="text-sm font-bold text-gray-800 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* ─── Main Grid ─── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* ─── LEFT: Menu Panel ─── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-black text-gray-900">Your Menu</h2>
              <span className="text-xs text-gray-400 font-semibold">{menuItems.length} dish{menuItems.length !== 1 ? "es" : ""}</span>
            </div>

            <MenuItemForm />

            {menuItems.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-pink-200 p-8 text-center">
                <p className="text-gray-400 text-sm">No dishes yet. Add your first one above!</p>
              </div>
            )}

            {/* Available Dishes */}
            {visibleItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Available this week</p>
                {visibleItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-pink-50 shadow-sm p-4 flex gap-3 items-center">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-pink-50 flex-shrink-0 flex items-center justify-center text-2xl">🍱</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{item.category}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <form action={async () => { "use server"; await toggleMenuItemAvailability(item.id, false); }}>
                        <button className="text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors w-full">Hide</button>
                      </form>
                      <form action={async () => { "use server"; await deleteMenuItem(item.id, item.imageUrl); }}>
                        <button className="text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors w-full">Delete</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hidden Dishes */}
            {hiddenItems.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Hidden</p>
                {hiddenItems.map(item => (
                  <div key={item.id} className="bg-white/60 rounded-2xl border border-pink-50 p-4 flex gap-3 items-center opacity-60">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 grayscale" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-2xl grayscale">🍱</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-500 text-sm truncate">{item.name}</p>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">{item.category}</span>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      <form action={async () => { "use server"; await toggleMenuItemAvailability(item.id, true); }}>
                        <button className="text-[10px] font-bold text-secondary bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-lg transition-colors w-full">Show</button>
                      </form>
                      <form action={async () => { "use server"; await deleteMenuItem(item.id, item.imageUrl); }}>
                        <button className="text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors w-full">Delete</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Active Orders ─── */}
          <div className="lg:col-span-3 space-y-4">
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
