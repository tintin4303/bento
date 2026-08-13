"use client";

import { Card } from "@/components/ui/Card";
import { ReviewForm } from "@/components/ReviewForm";
import { MonkeySlider } from "@/components/icons/MonkeySlider";
import { usePolling } from "@/hooks/usePolling";

interface HistoryListProps {
  completedOrders: any[];
}

export function HistoryList({ completedOrders: initialOrders }: HistoryListProps) {
  const { completedOrders } = usePolling(
    "/api/guest/completed-orders",
    { completedOrders: initialOrders },
    3000
  );

  return (
    <div className="w-full">
      {completedOrders.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">No completed orders yet.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {completedOrders.map((cart: any) => (
            <Card key={cart.id} className="flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-pink-50 pb-4">
                <div className="flex flex-col gap-2 w-full pr-4">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {cart.orders.map((o: any) => o.menuItem.name).join(' + ')}
                  </h3>
                  <p className="text-xs text-gray-400">Delivered: {new Date(cart.targetDate).toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-2 mt-2 space-y-1">
                    {cart.orders.map((o: any) => (
                      <div key={o.id}>
                        <p className="text-xs text-gray-700 font-medium">
                          • {o.menuItem.name} {o.selectedOption && <span className="text-[10px] text-secondary bg-pink-50 px-1 rounded ml-1">{o.selectedOption.label}</span>}
                        </p>
                        {o.notes && <p className="text-[10px] text-gray-500 italic ml-2 border-l-2 border-pink-100 pl-1.5 mt-0.5">"{o.notes}"</p>}
                      </div>
                    ))}
                  </div>

                  {cart.chefNote && (
                    <div className="mt-2 p-3 bg-pink-100/50 rounded-xl border border-pink-100 flex gap-2 items-start">
                      <span className="text-xl">👨‍🍳</span>
                      <div>
                        <p className="text-xs font-bold text-secondary mb-1">Chef's Note</p>
                        <p className="text-sm text-gray-700 italic">"{cart.chefNote}"</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {cart.review && (
                  <div className="flex flex-col items-center flex-shrink-0">
                    <MonkeySlider rating={cart.review.rating} className="w-12 h-12" />
                    <span className="text-xs font-bold text-secondary mt-1">{cart.review.rating} / 5</span>
                  </div>
                )}
              </div>
              
              {!cart.review ? (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">How was it?</h4>
                  <ReviewForm orderId={cart.id} />
                </div>
              ) : (
                cart.review.feedback && (
                  <p className="text-sm text-gray-600 bg-pink-50/50 p-3 rounded-lg border border-pink-100">
                    "{cart.review.feedback}"
                  </p>
                )
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
