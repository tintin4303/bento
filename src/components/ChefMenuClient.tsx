"use client";

import { useOptimistic, startTransition } from "react";
import { MenuItem } from "@/generated/prisma/client";
import { toggleMenuItemAvailability } from "@/app/actions";
import { createMenuItemOption, deleteMenuItemOption, deleteMenuItem } from "@/app/actions/menu";
import { MenuItemForm } from "@/components/MenuItemForm";

interface ChefMenuClientProps {
  initialItems: any[];
}

export function ChefMenuClient({ initialItems }: ChefMenuClientProps) {
  const [optimisticItems, dispatchOptimistic] = useOptimistic(
    initialItems,
    (state, action: { type: string; id?: string; val?: boolean; newItem?: any; option?: any; optionId?: string }) => {
      if (action.type === "TOGGLE") {
        return state.map(i => i.id === action.id ? { ...i, isAvailableThisWeek: action.val! } : i);
      }
      if (action.type === "DELETE") {
        return state.filter(i => i.id !== action.id);
      }
      if (action.type === "ADD") {
        return [...state, action.newItem!];
      }
      if (action.type === "ADD_OPTION") {
        return state.map(i => i.id === action.id ? { ...i, options: [...(i.options || []), action.option] } : i);
      }
      if (action.type === "REMOVE_OPTION") {
        return state.map(i => i.id === action.id ? { ...i, options: i.options.filter((o: any) => o.id !== action.optionId) } : i);
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

  const handleAddOption = (menuItemId: string) => {
    const label = prompt("Enter option name (e.g. Chicken):");
    if (!label || !label.trim()) return;
    const option = { id: Math.random().toString(), label: label.trim(), menuItemId };
    startTransition(() => {
      dispatchOptimistic({ type: "ADD_OPTION", id: menuItemId, option });
      createMenuItemOption(menuItemId, label.trim());
    });
  };

  const handleRemoveOption = (menuItemId: string, optionId: string) => {
    if (!confirm("Remove this option?")) return;
    startTransition(() => {
      dispatchOptimistic({ type: "REMOVE_OPTION", id: menuItemId, optionId });
      deleteMenuItemOption(optionId);
    });
  };

  const visibleItems = optimisticItems.filter(i => i.isAvailableThisWeek);
  const hiddenItems = optimisticItems.filter(i => !i.isAvailableThisWeek);

  const renderItemCard = (item: any, isHidden: boolean) => (
    <div key={item.id} className={`bg-white rounded-2xl border border-pink-50 p-4 flex gap-3 items-start ${isHidden ? 'opacity-60 grayscale' : 'shadow-sm'}`}>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-xl bg-pink-50 flex-shrink-0 flex items-center justify-center text-2xl">🍱</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
          {item.optionsRequired && <span className="text-[9px] bg-red-50 text-red-600 px-1.5 rounded uppercase font-bold">Req</span>}
        </div>
        <span className="text-[10px] font-bold text-gray-400 uppercase">{item.category}</span>
        
        {/* Options UI */}
        <div className="mt-2 flex flex-wrap gap-1">
          {item.options?.map((opt: any) => (
            <span key={opt.id} className="text-[9px] font-bold bg-pink-50 text-secondary px-2 py-0.5 rounded-full flex items-center gap-1 border border-pink-100">
              {opt.label}
              <button onClick={() => handleRemoveOption(item.id, opt.id)} className="hover:text-pink-800">✕</button>
            </span>
          ))}
          <button onClick={() => handleAddOption(item.id)} className="text-[9px] font-bold text-gray-400 bg-gray-50 hover:bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
            + option
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0 ml-auto">
        <button 
          onClick={() => handleToggle(item.id, isHidden)}
          className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors w-full ${isHidden ? 'text-secondary bg-pink-50 hover:bg-pink-100' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`}
        >
          {isHidden ? 'Show' : 'Hide'}
        </button>
        <button 
          onClick={() => handleDelete(item.id, item.imageUrl)}
          className="text-[10px] font-bold text-red-400 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-lg transition-colors w-full"
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-black text-gray-900">Your Menu</h2>
        <span className="text-xs text-gray-400 font-semibold">{optimisticItems.length} dish{optimisticItems.length !== 1 ? "es" : ""}</span>
      </div>

      <MenuItemForm onOptimisticAdd={(item: any) => dispatchOptimistic({ type: "ADD", newItem: item })} />

      {optimisticItems.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-pink-200 p-8 text-center">
          <p className="text-gray-400 text-sm">No dishes yet. Add your first one above!</p>
        </div>
      )}

      {/* Available Dishes */}
      {visibleItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Available this week</p>
          {visibleItems.map(item => renderItemCard(item, false))}
        </div>
      )}

      {/* Hidden Dishes */}
      {hiddenItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Hidden</p>
          {hiddenItems.map(item => renderItemCard(item, true))}
        </div>
      )}
    </div>
  );
}
