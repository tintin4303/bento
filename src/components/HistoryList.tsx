import { Card } from "@/components/ui/Card";
import { ReviewForm } from "@/components/ReviewForm";
import { MonkeySlider } from "@/components/icons/MonkeySlider";

interface HistoryListProps {
  completedOrders: any[];
}

export function HistoryList({ completedOrders }: HistoryListProps) {
  return (
    <div className="w-full">
      {completedOrders.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">No completed orders yet.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {completedOrders.map(order => (
            <Card key={order.id} className="flex flex-col gap-4">
              <div className="flex justify-between items-start border-b border-pink-50 pb-4">
                <div className="flex gap-4">
                  {order.menuItem.imageUrl && (
                    <img src={order.menuItem.imageUrl} alt={order.menuItem.name} className="w-16 h-16 rounded-xl object-cover bg-pink-50 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.menuItem.name}</h3>
                    <p className="text-xs text-gray-400">Delivered: {order.targetDate.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })}</p>
                    {order.notes && <p className="text-sm text-gray-600 mt-2 italic">Your Notes: "{order.notes}"</p>}
                    
                    {order.chefNote && (
                      <div className="mt-3 p-3 bg-pink-100/50 rounded-xl border border-pink-100 flex gap-2 items-start">
                        <span className="text-xl">👨‍🍳</span>
                        <div>
                          <p className="text-xs font-bold text-secondary mb-1">Chef's Note</p>
                          <p className="text-sm text-gray-700 italic">"{order.chefNote}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {order.review && (
                  <div className="flex flex-col items-center">
                    <MonkeySlider rating={order.review.rating} className="w-12 h-12" />
                    <span className="text-xs font-bold text-secondary mt-1">{order.review.rating} / 5</span>
                  </div>
                )}
              </div>
              
              {!order.review ? (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-3">How was it?</h4>
                  <ReviewForm orderId={order.id} />
                </div>
              ) : (
                order.review.feedback && (
                  <p className="text-sm text-gray-600 bg-pink-50/50 p-3 rounded-lg border border-pink-100">
                    "{order.review.feedback}"
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
