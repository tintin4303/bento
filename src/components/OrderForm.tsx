"use client";

import { useState } from "react";
import { CalendarDays, ShoppingBag } from "lucide-react";

interface OrderFormProps {
  menuItem: any;
  selectedDate: string | null;
  onScrollToCalendar: () => void;
  onAddToCart: (item: any) => void;
}

export function OrderForm({ menuItem, selectedDate, onScrollToCalendar, onAddToCart }: OrderFormProps) {
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>("");

  const handleAddToCart = () => {
    if (!selectedDate) return;
    if (menuItem.optionsRequired && !selectedOptionId) {
      alert("Please select an option.");
      return;
    }
    
    const option = menuItem.options?.find((o: any) => o.id === selectedOptionId);
    
    onAddToCart({
      menuItemId: menuItem.id,
      name: menuItem.name,
      imageUrl: menuItem.imageUrl,
      optionId: option?.id || null,
      optionLabel: option?.label || null,
      notes
    });
    
    // Reset form
    setNotes("");
    setShowNotes(false);
    setSelectedOptionId("");
  };

  if (!selectedDate) {
    return (
      <button
        onClick={onScrollToCalendar}
        className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-pink-700 transition-colors group mt-2"
      >
        <CalendarDays size={16} className="group-hover:scale-110 transition-transform" />
        Pick a delivery date above to order
      </button>
    );
  }

  const formattedDate = new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <div className="space-y-3 mt-2">
      {/* Options Selection */}
      {menuItem.options && menuItem.options.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
            Choose Option {menuItem.optionsRequired && <span className="text-secondary">*</span>}
          </label>
          <div className="flex flex-wrap gap-2">
            {menuItem.options.map((opt: any) => (
              <button
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                  selectedOptionId === opt.id 
                    ? "bg-secondary text-white border-secondary" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-pink-200 hover:bg-pink-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Date & Note & Button Row */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-secondary bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1.5 flex-shrink-0">
          <CalendarDays size={13} />
          {formattedDate}
        </div>

        <button
          type="button"
          onClick={() => setShowNotes(v => !v)}
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          {showNotes ? "hide note" : "+ note"}
        </button>

        <button
          onClick={handleAddToCart}
          className="ml-auto flex items-center gap-1.5 flex-shrink-0 text-sm font-black bg-secondary text-white px-4 py-1.5 rounded-xl hover:bg-pink-600 active:scale-95 transition-all"
        >
          <ShoppingBag size={14} /> Add
        </button>
      </div>

      {showNotes && (
        <input
          type="text"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Any notes? (e.g. no onions)"
          autoFocus
          className="w-full text-xs px-3 py-2 rounded-xl border border-pink-100 bg-pink-50/30 focus:outline-none focus:border-secondary transition-colors"
        />
      )}
    </div>
  );
}
