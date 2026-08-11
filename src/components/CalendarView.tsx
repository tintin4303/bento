"use client";

import { Order, MenuItem } from "@/generated/prisma/client";
import { useEffect, useRef, useState } from "react";
import { CalendarX } from "lucide-react";

type OrderWithMenu = Order & { menuItem: MenuItem };

interface CalendarViewProps {
  orders: OrderWithMenu[];
  selectedDate: string | null;       // "YYYY-MM-DD"
  onSelectDate: (date: string) => void;
}

export function CalendarView({ orders, selectedDate, onSelectDate }: CalendarViewProps) {
  const [days, setDays] = useState<Date[]>([]);
  const selectedRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const generated = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);
      return d;
    });
    setDays(generated);
  }, []);

  // Scroll to selected day when it changes
  useEffect(() => {
    if (selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedDate]);

  if (days.length === 0) {
    return <div className="h-36 mb-6 animate-pulse bg-pink-50 rounded-2xl" />;
  }

  // Convert "YYYY-MM-DD" to a comparable midnight timestamp (local)
  const selectedTs = selectedDate ? new Date(selectedDate + "T00:00:00").getTime() : null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-black text-gray-900">Delivery Schedule</h2>
        {selectedDate && (
          <button
            onClick={() => onSelectDate("")}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-secondary transition-colors"
          >
            <CalendarX size={13} />
            Clear
          </button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 snap-x" style={{ scrollbarWidth: "none" }}>
        {days.map((day, idx) => {
          const dayTs = day.getTime();
          const isToday = idx === 0;
          const isSelected = selectedTs !== null && dayTs === selectedTs;

          // Find orders for this day
          const dayOrders = orders.filter(o => {
            const od = new Date(o.targetDate);
            od.setHours(0, 0, 0, 0);
            return od.getTime() === dayTs;
          });
          const hasOrder = dayOrders.length > 0;

          // Format the date string for this button
          const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;

          return (
            <button
              key={day.toISOString()}
              ref={isSelected ? selectedRef : null}
              onClick={() => onSelectDate(isSelected ? "" : dateStr)}
              className={`flex-shrink-0 w-14 rounded-2xl border-2 py-3 px-1 snap-start flex flex-col items-center gap-1 transition-all duration-150 active:scale-95 ${
                isSelected
                  ? "border-secondary bg-secondary text-white shadow-md shadow-secondary/30"
                  : hasOrder
                  ? "border-pink-300 bg-pink-50 text-gray-700"
                  : isToday
                  ? "border-pink-200 bg-white text-gray-700"
                  : "border-pink-50 bg-white text-gray-400"
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wide ${isSelected ? "text-white/80" : "text-gray-400"}`}>
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </span>
              <span className={`text-xl font-black ${isSelected ? "text-white" : isToday ? "text-secondary" : "text-gray-700"}`}>
                {day.getDate()}
              </span>

              {/* Order indicator dots */}
              {hasOrder && (
                <div className="flex flex-col gap-1 w-full mt-1">
                  {dayOrders.map(o => (
                    <div key={o.id} className="relative mx-auto">
                      {o.menuItem.imageUrl ? (
                        <img
                          src={o.menuItem.imageUrl}
                          alt={o.menuItem.name}
                          className={`w-8 h-8 rounded-full object-cover border-2 ${isSelected ? "border-white/50" : "border-white"} shadow-sm`}
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] shadow-sm ${isSelected ? "bg-white/20" : "bg-pink-200"}`}>
                          🍱
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty slot dot */}
              {!hasOrder && (
                <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? "bg-white/50" : "bg-pink-100"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected date label */}
      {selectedDate && (
        <p className="text-xs text-secondary font-bold mt-2 text-center animate-in fade-in slide-in-from-top-1 duration-150">
          Ordering for {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      )}
    </div>
  );
}
