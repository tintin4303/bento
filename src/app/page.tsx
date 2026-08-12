import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { GuestMenu } from "@/components/GuestMenu";
import { HistoryList } from "@/components/HistoryList";
import { ProfileForm } from "@/components/ProfileForm";
import { DishRequestForm } from "@/components/DishRequestForm";
import { ConnectedChefProfile } from "@/components/ConnectedChefProfile";
import { GuestDashboardClient } from "@/components/GuestDashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = session.user as any;
  if (user.role === "ADMIN") redirect("/admin");

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (!dbUser) redirect("/login");

  const connectedChefId = user.connectedChefId;
  const connectedChef = connectedChefId
    ? await prisma.user.findUnique({ where: { id: connectedChefId } })
    : null;

  const menuItems = connectedChefId
    ? await prisma.menuItem.findMany({
        where: { isAvailableThisWeek: true, chefId: connectedChefId },
        include: { options: true },
        orderBy: [{ isFavorite: "desc" }, { category: "asc" }],
      })
    : [];

  const activeOrders = await prisma.cart.findMany({
    where: { status: { not: "COMPLETED" }, guestId: user.id },
    include: { orders: { include: { menuItem: true, selectedOption: true } } },
    orderBy: { targetDate: "asc" },
  });

  const dishRequests = await prisma.dishRequest.findMany({
    where: { guestId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const completedOrders = await prisma.cart.findMany({
    where: { status: "COMPLETED", guestId: user.id },
    include: { orders: { include: { menuItem: true, selectedOption: true } }, review: true },
    orderBy: { targetDate: "desc" },
  });

  /* ── Unreviewed completed orders (for rating prompt on dashboard) ── */
  const unreviewedOrders = completedOrders.filter(c => !c.review);

  /* ── Modal content nodes ── */
  const historyNode = <HistoryList completedOrders={completedOrders as any} />;

  const dishRequestNode = (
    <div>
      <p className="text-sm text-gray-500 mb-4">Send your chef a request for a new dish!</p>
      <DishRequestForm />
      {dishRequests.length > 0 && (
        <div className="mt-6 space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Recent Requests</h3>
          {dishRequests.map(req => (
            <div key={req.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex justify-between items-start p-3">
                <div>
                  <p className="font-bold text-sm text-gray-900">{req.dishName}</p>
                  {req.notes && <p className="text-xs text-gray-500 italic mt-0.5">"{req.notes}"</p>}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ml-2 ${
                  req.status === "PENDING"  ? "bg-yellow-100 text-yellow-700" :
                  req.status === "ACCEPTED" ? "bg-green-100  text-green-700"  :
                  "bg-red-100 text-red-700"
                }`}>
                  {req.status}
                </span>
              </div>
              {req.replyNote && (
                <div className="px-3 pb-3 flex items-start gap-2 border-t border-pink-50 pt-2">
                  <span className="text-base">👨‍🍳</span>
                  <p className="text-xs text-gray-600 italic">"{req.replyNote}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );


  const profileNode = <ProfileForm user={dbUser} isChef={false} />;
  const chefNode    = <ConnectedChefProfile chef={connectedChef as any} />;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-[#FDF2F8]">

      {/* ─── Sticky Nav ─── */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-2xl mx-auto px-5 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {dbUser.avatarUrl ? (
              <img src={dbUser.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover ring-2 ring-pink-200" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-lg ring-2 ring-pink-200">
                💁‍♀️
              </div>
            )}
            <div>
              <p className="font-black text-gray-900 text-sm leading-none">{dbUser.displayName || dbUser.username}</p>
              <p className="text-[11px] text-gray-400 font-semibold">
                {connectedChef ? `Chef: ${connectedChef.displayName || connectedChef.username}` : "Not connected"}
              </p>
            </div>
          </div>
          <GuestMenu
            historyNode={historyNode}
            dishRequestNode={dishRequestNode}
            profileNode={profileNode}
            chefNode={chefNode}
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pb-16 space-y-6">
        {/* ─── Hero greeting ─── */}
        <div className="pt-8 pb-2">
          <p className="text-gray-400 text-sm font-semibold">{greeting()},</p>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">{dbUser.displayName || dbUser.username} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeOrders.length > 0
              ? `You have ${activeOrders.length} upcoming order${activeOrders.length > 1 ? "s" : ""}. Enjoy your meal!`
              : "Nothing ordered yet — tap a day in the calendar then pick a dish below!"}
          </p>
        </div>

        {/* ─── Interactive dashboard (calendar + orders + menu) ─── */}
        <GuestDashboardClient
          menuItems={menuItems as any}
          activeOrders={activeOrders as any}
          connectedChef={connectedChef as any}
          unreviewedOrders={unreviewedOrders as any}
        />
      </main>
    </div>
  );
}
