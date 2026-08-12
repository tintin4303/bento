"use client";

import { useState } from "react";
import { usePolling } from "@/hooks/usePolling";
import { updateCartStatus, updateCartChefNote } from "@/app/actions";

interface ChefActiveOrdersProps {
  initialOrders: any[];
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  PENDING:  { label: "Pending",  dot: "bg-yellow-400", badge: "bg-yellow-50  text-yellow-700 border border-yellow-200" },
  COOKING:  { label: "Cooking",  dot: "bg-orange-400", badge: "bg-orange-50  text-orange-700 border border-orange-200" },
  READY:    { label: "Ready",    dot: "bg-blue-400",   badge: "bg-blue-50    text-blue-700   border border-blue-200" },
  COMPLETED:{ label: "Done",     dot: "bg-green-400",  badge: "bg-green-50   text-green-700  border border-green-200" },
};

export function ChefActiveOrders({ initialOrders }: ChefActiveOrdersProps) {
  // Chef notes local state (ephemeral)
  const [chefNotes, setChefNotes] = useState<Record<string, string>>({});
  // Optimistic status local state (instant UI feedback)
  const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, string>>({});

  // Live polling — new guest orders pop up immediately
  const { activeOrders } = usePolling(
    "/api/chef/orders",
    { activeOrders: initialOrders },
    3000
  );

  const visibleOrders = activeOrders.filter((cart: any) => (optimisticStatuses[cart.id] || cart.status) !== "COMPLETED");

  if (visibleOrders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-pink-200 p-12 text-center">
        <p className="font-bold text-gray-700">All clear!</p>
        <p className="text-sm text-gray-400 mt-1">No active orders right now.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {visibleOrders.map((cart: any) => {
        const currentStatus = optimisticStatuses[cart.id] || cart.status;
        const cfg = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.PENDING;
        const noteValue = chefNotes[cart.id] ?? cart.chefNote ?? "";
        return (
          <div key={cart.id} className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden flex flex-col">
            <div className="h-1 bg-gradient-to-r from-secondary to-pink-300" />

            <div className="p-4 flex flex-col gap-3 flex-1">
              {/* Header */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-3 items-center min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-pink-50 flex-shrink-0 flex items-center justify-center text-xl border border-pink-100">
                    <span className="font-black text-secondary">{cart.orders.length}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-gray-900 text-sm leading-tight truncate">{cart.guest?.displayName || cart.guest?.username}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                      📅 {new Date(cart.targetDate).toLocaleDateString("en-US", { timeZone: "Asia/Bangkok", weekday: "short", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 flex items-center gap-1 ${cfg.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
                  {cfg.label}
                </span>
              </div>

              {/* Items List */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                {cart.orders.map((o: any) => (
                  <div key={o.id} className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-gray-800">• {o.menuItem.name}</span>
                      {o.selectedOption && (
                        <span className="text-[9px] font-bold text-secondary bg-pink-100 px-1.5 rounded uppercase">{o.selectedOption.label}</span>
                      )}
                    </div>
                    {o.notes && <p className="text-[10px] text-gray-500 italic ml-2 border-l-2 border-pink-100 pl-1.5">{o.notes}</p>}
                  </div>
                ))}
              </div>

              {/* Chef Note */}
              <div className="flex gap-2 mt-auto pt-2">
                <input
                  type="text"
                  value={noteValue}
                  onChange={(e) => setChefNotes((prev) => ({ ...prev, [cart.id]: e.target.value }))}
                  placeholder={cart.chefNote || "Add a note for her..."}
                  className="flex-1 text-xs px-3 py-2 border border-pink-100 rounded-lg focus:outline-none focus:border-secondary bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => updateCartChefNote(cart.id, noteValue)}
                  className="text-[10px] font-bold text-secondary bg-pink-50 hover:bg-pink-100 px-3 py-2 rounded-lg transition-colors flex-shrink-0"
                >
                  Save
                </button>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setOptimisticStatuses(prev => ({ ...prev, [cart.id]: "COOKING" }));
                    updateCartStatus(cart.id, "COOKING");
                  }}
                  className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-100 transition-colors"
                >
                  Cooking
                </button>
                <button
                  onClick={() => {
                    setOptimisticStatuses(prev => ({ ...prev, [cart.id]: "READY" }));
                    updateCartStatus(cart.id, "READY");
                  }}
                  className="flex-1 text-[11px] font-bold py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 transition-colors"
                >
                  Ready
                </button>
                <button
                  onClick={() => {
                    setOptimisticStatuses(prev => ({ ...prev, [cart.id]: "COMPLETED" }));
                    updateCartStatus(cart.id, "COMPLETED");
                  }}
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
