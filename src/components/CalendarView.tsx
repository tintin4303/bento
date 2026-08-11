import { Order, MenuItem } from "@/generated/prisma/client";

type OrderWithMenu = Order & { menuItem: MenuItem };

export function CalendarView({ orders }: { orders: OrderWithMenu[] }) {
  // Generate the next 14 days
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  return (
    <div className="mb-10 overflow-hidden">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Schedule</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
        {days.map((day, idx) => {
          // Find orders for this day
          const dayOrders = orders.filter(o => {
            const od = new Date(o.targetDate);
            od.setHours(0, 0, 0, 0);
            return od.getTime() === day.getTime();
          });

          const isToday = idx === 0;

          return (
            <div 
              key={day.toISOString()} 
              className={`flex-shrink-0 w-32 rounded-2xl border-2 p-3 snap-start flex flex-col items-center ${
                dayOrders.length > 0 ? "border-secondary bg-pink-50" : "border-pink-50 bg-white"
              }`}
            >
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {day.toLocaleDateString(undefined, { weekday: 'short' })}
              </span>
              <span className={`text-2xl font-black ${isToday ? 'text-secondary' : 'text-gray-700'}`}>
                {day.getDate()}
              </span>
              
              <div className="mt-3 flex flex-col gap-2 w-full">
                {dayOrders.length > 0 ? (
                  dayOrders.map(o => (
                    <div key={o.id} className="text-center group relative">
                      {o.menuItem.imageUrl ? (
                        <img 
                          src={o.menuItem.imageUrl} 
                          alt={o.menuItem.name} 
                          className="w-12 h-12 mx-auto rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 mx-auto rounded-full bg-pink-200 flex items-center justify-center text-xs shadow-sm">
                          🍱
                        </div>
                      )}
                      <p className="text-[10px] font-semibold text-gray-700 mt-1 truncate px-1">{o.menuItem.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-xs text-gray-300 py-2">-</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
