"use client";

import { useRef, useState } from "react";
import { Order, MenuItem, User } from "@/generated/prisma/client";
import { CalendarView } from "./CalendarView";
import { OrderForm } from "./OrderForm";
import { FavoriteButton } from "./FavoriteButton";
import { CancelButton } from "./CancelButton";
import { MonkeyEmpty } from "./icons/MonkeyEmpty";
import { ReviewForm } from "./ReviewForm";
import { Star } from "lucide-react";
import { usePolling } from "@/hooks/usePolling";

type OrderWithMenu = Order & { menuItem: MenuItem; review: any | null };
type MenuItemType = MenuItem;

interface GuestDashboardClientProps {
  menuItems: MenuItemType[];
  activeOrders: OrderWithMenu[];
  connectedChef: User | null;
  unreviewedOrders: OrderWithMenu[];
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; pill: string }> = {
  PENDING: { label: "Pending", dot: "bg-yellow-400", pill: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  COOKING: { label: "Cooking", dot: "bg-orange-400", pill: "bg-orange-50 text-orange-700 border border-orange-200" },
  READY:   { label: "Ready!",  dot: "bg-blue-400",   pill: "bg-blue-50   text-blue-700   border border-blue-200" },
};

export function GuestDashboardClient({ menuItems, activeOrders: initialOrders, connectedChef, unreviewedOrders: initialUnreviewed }: GuestDashboardClientProps) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dismissedRatings, setDismissedRatings] = useState<Set<string>>(new Set());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Live polling — only re-renders these sections when data actually changes
  const { activeOrders, unreviewedOrders } = usePolling(
    "/api/orders",
    { activeOrders: initialOrders, unreviewedOrders: initialUnreviewed },
    3000
  );

  const scrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-8">
      {/* ─── Calendar ─── */}
      <div ref={calendarRef}>
        <CalendarView
          orders={activeOrders}
          selectedDate={selectedDate || null}
          onSelectDate={setSelectedDate}
        />
      </div>

      {/* ─── Rate your meal prompt ─── */}
      {unreviewedOrders.filter(o => !dismissedRatings.has(o.id)).map(order => (
        <div key={order.id} className="bg-white rounded-2xl border border-yellow-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-50 to-pink-50 px-4 pt-4 pb-3 flex items-center gap-3">
            {order.menuItem.imageUrl ? (
              <img src={order.menuItem.imageUrl} alt={order.menuItem.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-xl flex-shrink-0">🍱</div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Star size={13} className="fill-yellow-400 text-yellow-400" />
                <p className="text-xs font-bold text-yellow-700">Rate your meal</p>
              </div>
              <p className="font-black text-gray-900 text-sm">{order.menuItem.name}</p>
            </div>
            <button
              onClick={() => setDismissedRatings(prev => new Set(prev).add(order.id))}
              className="text-gray-300 hover:text-gray-500 text-lg leading-none flex-shrink-0"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
          <div className="p-4 pt-3">
            <ReviewForm orderId={order.id} />
          </div>
        </div>
      ))}

      {/* ─── Active Orders ─── */}
      {activeOrders.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-4">Your Orders</h2>
          <div className="space-y-3">
            {activeOrders.map(order => {
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
              return (
                <div key={order.id} className="bg-white rounded-2xl border border-pink-50 shadow-sm p-4 flex items-center gap-4">
                  {order.menuItem.imageUrl ? (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-pink-50">
                      <img src={order.menuItem.imageUrl} alt={order.menuItem.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl bg-pink-50 flex items-center justify-center text-3xl">
                      🍱
                    </div>
                  )}
                  <div className="flex-1 min-w-0 py-3">
                    <p className="font-black text-gray-900 text-sm">{order.menuItem.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.targetDate).toLocaleDateString("en-US", { timeZone: "Asia/Bangkok", weekday: "short", month: "short", day: "numeric" })}
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

      {/* ─── Menu ─── */}
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
                className="bg-white rounded-2xl border border-pink-50 shadow-sm p-4 flex gap-4 hover:border-secondary/40 hover:shadow-md transition-all duration-200"
              >
                {/* Image */}
                {item.imageUrl ? (
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex-shrink-0 rounded-xl bg-pink-50 flex items-center justify-center text-3xl">🍱</div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <h3 className="text-base font-black text-gray-900 leading-tight">{item.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-pink-100 text-secondary rounded-full uppercase tracking-wide inline-block mt-1">
                        {item.category}
                      </span>
                    </div>
                    <FavoriteButton menuItemId={item.id} isFavorite={item.isFavorite} />
                  </div>

                  {item.description && (
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                  )}

                  <div className="mt-3 pt-3 border-t border-pink-50">
                    <OrderForm
                      menuItemId={item.id}
                      selectedDate={selectedDate || null}
                      onScrollToCalendar={scrollToCalendar}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
