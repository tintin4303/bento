"use client";

import { useState } from "react";
import { createOrder } from "@/app/actions";
import { CalendarDays, CheckCircle2 } from "lucide-react";

interface OrderFormProps {
  menuItemId: string;
  selectedDate: string | null;   // "YYYY-MM-DD" from calendar
  onScrollToCalendar: () => void;
}

export function OrderForm({ menuItemId, selectedDate, onScrollToCalendar }: OrderFormProps) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const handleOrder = async () => {
    if (!selectedDate) return;
    setLoading(true);
    await createOrder(menuItemId, notes, selectedDate);
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 size={18} />
        <span className="text-sm font-bold">Ordered for {new Date(selectedDate! + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}!</span>
      </div>
    );
  }

  if (!selectedDate) {
    return (
      <button
        onClick={onScrollToCalendar}
        className="flex items-center gap-2 text-sm font-semibold text-secondary hover:text-pink-700 transition-colors group"
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
    <div className="space-y-2">
      {/* Confirm row */}
      <div className="flex items-center gap-2">
        {/* Date chip */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-secondary bg-pink-50 border border-pink-200 rounded-lg px-2.5 py-1.5 flex-shrink-0">
          <CalendarDays size={13} />
          {formattedDate}
        </div>

        {/* Notes toggle */}
        <button
          type="button"
          onClick={() => setShowNotes(v => !v)}
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 transition-colors"
        >
          {showNotes ? "hide note" : "+ note"}
        </button>

        {/* Order button */}
        <button
          onClick={handleOrder}
          disabled={loading}
          className="ml-auto flex-shrink-0 text-sm font-black bg-secondary text-white px-4 py-1.5 rounded-xl hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? "..." : "Order"}
        </button>
      </div>

      {/* Collapsible notes */}
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
