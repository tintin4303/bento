"use client";

import { useState } from "react";
import { usePolling } from "@/hooks/usePolling";
import { updateOrderStatus, updateChefNote } from "@/app/actions";

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  PENDING:  { label: "Pending",  dot: "bg-yellow-400", badge: "bg-yellow-50  text-yellow-700 border border-yellow-200" },
  COOKING:  { label: "Cooking",  dot: "bg-orange-400", badge: "bg-orange-50  text-orange-700 border border-orange-200" },
  READY:    { label: "Ready",    dot: "bg-blue-400",   badge: "bg-blue-50    text-blue-700   border border-blue-200" },
  COMPLETED:{ label: "Done",     dot: "bg-green-400",  badge: "bg-green-50   text-green-700  border border-green-200" },
};

interface ChefActiveOrdersProps {
  initialOrders: any[];
}

export function ChefActiveOrders({ initialOrders }: ChefActiveOrdersProps) {
  // Chef notes local state (ephemeral)
  const [chefNotes, setChefNotes] = useState<Record<string, string>>({});

  // Live polling — new guest orders pop up immediately
  const { activeOrders } = usePolling(
    "/api/chef/orders",
    { activeOrders: initialOrders },
    3000
  );

  if (activeOrders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-pink-200 p-12 text-center">
        <p className="font-bold text-gray-700">All clear!</p>
        <p className="text-sm text-gray-400 mt-1">No active orders right now.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {activeOrders.map((order: any) => {
        const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
        const noteValue = chefNotes[order.id] ?? order.chefNote ?? "";
        return (
          <div key={order.id} className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden flex flex-col">
            <div className="h-1 bg-gradient-to-r from-secondary to-pink-300" />

            <div className="p-4 flex flex-col gap-3 flex-1">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-3 items-center">
                  {order.menuItem.imageUrl ? (
                    <img src={order.menuItem.imageUrl} alt={order.menuItem.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-pink-50 flex-shrink-0 flex items-center justify-center text-xl">🍱</div>
                  )}
                  <div>
                    <p className="font-black text-gray-900 text-sm leading-tight">{order.menuItem.name}</p>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">
                      {order.guest.displayName || order.guest.username}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1 ${cfg.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
                  {cfg.label}
                </span>
              </div>

              {/* Date */}
              <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-1.5 font-medium">
                📅 {new Date(order.targetDate).toLocaleDateString("en-US", { timeZone: "Asia/Bangkok", weekday: "long", month: "short", day: "numeric" })}
              </p>

              {/* Guest Note */}
              {order.notes && (
                <p className="text-xs text-gray-600 bg-pink-50 border border-pink-100 rounded-lg px-3 py-2 italic">
                  "{order.notes}"
                </p>
              )}

              {/* Chef Note */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteValue}
                  onChange={(e) => setChefNotes((prev) => ({ ...prev, [order.id]: e.target.value }))}
                  placeholder={order.chefNote || "Add a note for her..."}
                  className="flex-1 text-xs px-3 py-2 border border-pink-100 rounded-lg focus:outline-none focus:border-secondary bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => updateChefNote(order.id, noteValue)}
                  className="text-[10px] font-bold text-secondary bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                >
                  Save
                </button>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => updateOrderStatus(order.id, "COOKING")}
                  className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100 transition-colors"
                >
                  Cooking
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "READY")}
                  className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                >
                  Ready
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                  className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-secondary text-white hover:bg-pink-600 transition-colors"
                >
                  Done ✓
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
