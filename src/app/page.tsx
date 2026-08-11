import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { MonkeyEmpty } from "@/components/icons/MonkeyEmpty";
import { OrderForm } from "@/components/OrderForm";
import { CancelButton } from "@/components/CancelButton";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CalendarView } from "@/components/CalendarView";
import { GuestMenu } from "@/components/GuestMenu";
import { HistoryList } from "@/components/HistoryList";
import { ProfileForm } from "@/components/ProfileForm";
import { DishRequestForm } from "@/components/DishRequestForm";
import { ConnectedChefProfile } from "@/components/ConnectedChefProfile";

const STATUS_CONFIG: Record<string, { label: string; dot: string; pill: string }> = {
  PENDING:  { label: "Pending",  dot: "bg-yellow-400", pill: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  COOKING:  { label: "Cooking",  dot: "bg-orange-400", pill: "bg-orange-50 text-orange-700 border border-orange-200" },
  READY:    { label: "Ready!",   dot: "bg-blue-400",   pill: "bg-blue-50   text-blue-700   border border-blue-200" },
};

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
        orderBy: [{ isFavorite: "desc" }, { category: "asc" }],
      })
    : [];

  const activeOrders = await prisma.order.findMany({
    where: { status: { not: "COMPLETED" }, guestId: user.id },
    include: { menuItem: true },
    orderBy: { targetDate: "asc" },
  });

  const dishRequests = await prisma.dishRequest.findMany({
    where: { guestId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const completedOrders = await prisma.order.findMany({
    where: { status: "COMPLETED", guestId: user.id },
    include: { menuItem: true, review: true },
    orderBy: { targetDate: "desc" },
  });

  /* ── Modal content nodes ── */
  const historyNode = <HistoryList completedOrders={completedOrders as any} />;

  const dishRequestNode = (
    <div>
      <p className="text-sm text-gray-500 mb-4">Send your chef a request for a new dish!</p>
      <DishRequestForm />
      {dishRequests.length > 0 && (
        <div className="mt-6 space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Your Recent Requests</h3>
          {dishRequests.map(req => (
            <div key={req.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
              <div>
                <p className="font-bold text-sm text-gray-900">{req.dishName}</p>
                {req.notes && <p className="text-xs text-gray-500 italic mt-0.5">"{req.notes}"</p>}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                req.status === "PENDING"  ? "bg-yellow-100 text-yellow-700" :
                req.status === "ACCEPTED" ? "bg-green-100  text-green-700"  :
                "bg-red-100 text-red-700"
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
  const chefNode    = <ConnectedChefProfile chef={connectedChef as any} />;

  /* ── helpers ── */
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

      <main className="max-w-2xl mx-auto px-5 pb-16 space-y-8">

        {/* ─── Hero greeting ─── */}
        <div className="pt-8 pb-2">
          <p className="text-gray-400 text-sm font-semibold">{greeting()},</p>
          <h1 className="text-4xl font-black text-gray-900 leading-tight">{dbUser.displayName || dbUser.username} 👋</h1>
          <p className="text-gray-500 text-sm mt-1">
            {activeOrders.length > 0
              ? `You have ${activeOrders.length} upcoming order${activeOrders.length > 1 ? "s" : ""}. Enjoy your meal!`
              : "Nothing ordered yet — check out this week's menu below!"}
          </p>
        </div>

        {/* ─── Delivery Calendar ─── */}
        <CalendarView orders={activeOrders as any} />

        {/* ─── Active Orders ─── */}
        {activeOrders.length > 0 && (
          <section>
            <h2 className="text-xl font-black text-gray-900 mb-4">Your Orders</h2>
            <div className="space-y-3">
              {activeOrders.map(order => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <div key={order.id} className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden flex items-center gap-4 pr-4">
                    {order.menuItem.imageUrl ? (
                      <img
                        src={order.menuItem.imageUrl}
                        alt={order.menuItem.name}
                        className="w-20 h-20 object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-pink-100 flex items-center justify-center text-3xl flex-shrink-0">🍱</div>
                    )}
                    <div className="flex-1 min-w-0 py-3">
                      <p className="font-black text-gray-900 text-sm">{order.menuItem.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.targetDate.toLocaleDateString("en-US", { timeZone: "Asia/Bangkok", weekday: "short", month: "short", day: "numeric" })}
                      </p>
                      <span className={`mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    {order.status === "PENDING" && <CancelButton orderId={order.id} />}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── This Week's Menu ─── */}
        <section>
          <div className="flex items-baseline justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900">This Week's Menu</h2>
            {menuItems.length > 0 && (
              <span className="text-xs text-gray-400 font-semibold">{menuItems.length} dish{menuItems.length !== 1 ? "es" : ""}</span>
            )}
          </div>

          {menuItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-pink-200 p-12 text-center flex flex-col items-center">
              <MonkeyEmpty className="w-28 h-28 text-secondary mb-4" />
              <p className="font-bold text-gray-700">No menu this week yet!</p>
              <p className="text-sm text-gray-400 mt-1">
                {connectedChef
                  ? `${connectedChef.displayName || connectedChef.username} is still planning the menu.`
                  : "You're not connected to a chef yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {menuItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden hover:border-secondary/40 hover:shadow-md transition-all duration-200"
                >
                  {/* Food image – full width banner if present */}
                  {item.imageUrl && (
                    <div className="relative h-44 w-full overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {/* Favorite button overlay */}
                      <div className="absolute top-3 right-3">
                        <FavoriteButton menuItemId={item.id} isFavorite={item.isFavorite} />
                      </div>
                      {/* Category pill */}
                      <span className="absolute bottom-3 left-3 text-[10px] font-bold px-2 py-1 bg-white/90 text-secondary rounded-full uppercase tracking-wide">
                        {item.category}
                      </span>
                    </div>
                  )}

                  <div className="p-4">
                    {!item.imageUrl && (
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold px-2 py-1 bg-pink-100 text-secondary rounded-full uppercase tracking-wide">
                          {item.category}
                        </span>
                        <FavoriteButton menuItemId={item.id} isFavorite={item.isFavorite} />
                      </div>
                    )}

                    <h3 className="text-lg font-black text-gray-900">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{item.description}</p>
                    )}

                    <div className="mt-4 border-t border-pink-50 pt-4">
                      <OrderForm menuItemId={item.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
