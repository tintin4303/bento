"use client";

import { useOptimistic, startTransition } from "react";
import { MenuItem } from "@/generated/prisma/client";
import { toggleMenuItemAvailability } from "@/app/actions";
import { deleteMenuItem } from "@/app/actions/menu";
import { MenuItemForm } from "./MenuItemForm";

interface ChefMenuClientProps {
  initialItems: MenuItem[];
}

export function ChefMenuClient({ initialItems }: ChefMenuClientProps) {
  const [optimisticItems, dispatchOptimistic] = useOptimistic(
    initialItems,
    (state, action: { type: string; id?: string; val?: boolean; newItem?: MenuItem }) => {
      if (action.type === "TOGGLE") {
        return state.map(i => i.id === action.id ? { ...i, isAvailableThisWeek: action.val! } : i);
      }
      if (action.type === "DELETE") {
        return state.filter(i => i.id !== action.id);
      }
      if (action.type === "ADD") {
        return [...state, action.newItem!];
      }
      return state;
    }
  );

  const handleToggle = (id: string, val: boolean) => {
    startTransition(() => {
      dispatchOptimistic({ type: "TOGGLE", id, val });
      toggleMenuItemAvailability(id, val);
    });
  };

  const handleDelete = (id: string, imageUrl: string | null) => {
    if (!confirm("Delete this dish forever?")) return;
    startTransition(() => {
      dispatchOptimistic({ type: "DELETE", id });
      deleteMenuItem(id, imageUrl);
    });
  };

  const visibleItems = optimisticItems.filter(i => i.isAvailableThisWeek);
  const hiddenItems = optimisticItems.filter(i => !i.isAvailableThisWeek);

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-black text-gray-900">Your Menu</h2>
        <span className="text-xs text-gray-400 font-semibold">{optimisticItems.length} dish{optimisticItems.length !== 1 ? "es" : ""}</span>
      </div>

      <MenuItemForm onOptimisticAdd={(item) => dispatchOptimistic({ type: "ADD", newItem: item })} />

      {optimisticItems.length === 0 && (
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
                <button 
                  onClick={() => handleToggle(item.id, false)}
                  className="text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-lg transition-colors w-full"
                >
                  Hide
                </button>
                <button 
                  onClick={() => handleDelete(item.id, item.imageUrl)}
                  className="text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors w-full"
                >
                  Delete
                </button>
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
                <button 
                  onClick={() => handleToggle(item.id, true)}
                  className="text-[10px] font-bold text-secondary bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded-lg transition-colors w-full"
                >
                  Show
                </button>
                <button 
                  onClick={() => handleDelete(item.id, item.imageUrl)}
                  className="text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors w-full"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
