"use client";

import { usePolling } from "@/hooks/usePolling";

interface ChefStatsCardsProps {
  initialMenuItems: any[];
  initialActiveOrders: any[];
  initialPendingRequests: any[];
}

export function ChefStatsCards({
  initialMenuItems,
  initialActiveOrders,
  initialPendingRequests,
}: ChefStatsCardsProps) {
  // Poll for active orders (same endpoint as ChefActiveOrders)
  const { activeOrders } = usePolling(
    "/api/chef/orders",
    { activeOrders: initialActiveOrders },
    3000
  );

  // Poll for pending requests (same endpoint as DishRequestInbox)
  const { pendingRequests } = usePolling(
    "/api/chef/requests",
    { pendingRequests: initialPendingRequests },
    10000
  );

  // Menu items don't poll, they rely on server revalidation on mutation
  const visibleItems = initialMenuItems.filter((i) => i.isAvailableThisWeek);

  const handleScrollToMenu = () => {
    document.getElementById("menu-panel")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToOrders = () => {
    document.getElementById("active-orders")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleOpenDishRequests = () => {
    window.dispatchEvent(new CustomEvent("openChefModal", { detail: "requests" }));
  };

  const stats = [
    { label: "Total Dishes", value: initialMenuItems.length, sub: "in your menu", onClick: handleScrollToMenu },
    { label: "On This Week", value: visibleItems.length, sub: "available to guests", onClick: handleScrollToMenu },
    { label: "Active Orders", value: activeOrders.length, sub: "in progress", onClick: handleScrollToOrders },
    { label: "Dish Requests", value: pendingRequests.length, sub: "awaiting response", onClick: handleOpenDishRequests },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          onClick={stat.onClick}
          className="bg-white rounded-2xl border border-pink-50 shadow-sm p-5 cursor-pointer hover:border-pink-200 hover:shadow-md transition-all active:scale-95 min-w-0"
        >
          <p className="text-3xl font-black text-secondary">{stat.value}</p>
          <p className="text-sm font-bold text-gray-800 mt-1 truncate">{stat.label}</p>
          <p className="text-xs text-gray-400 truncate">{stat.sub}</p>
        </div>
      ))}
    </div>
  );
}
