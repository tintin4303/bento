"use client";

import { Card } from "@/components/ui/Card";
import { MonkeySlider } from "@/components/icons/MonkeySlider";
import { usePolling } from "@/hooks/usePolling";

interface FeedbackInboxProps {
  recentReviews: any[];
}

export function FeedbackInbox({ recentReviews: initialReviews }: FeedbackInboxProps) {
  const { recentReviews } = usePolling(
    "/api/chef/reviews",
    { recentReviews: initialReviews },
    3000
  );

  return (
    <div className="w-full">
      {recentReviews.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">No reviews yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {recentReviews.map(review => (
            <Card key={review.id} className="border border-pink-100 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900 leading-tight">
                  {review.cart.orders.map((o: any) => o.menuItem.name).join(' + ')}
                </h3>
                <div className="flex flex-col items-center">
                  <MonkeySlider rating={review.rating} className="w-10 h-10" />
                  <span className="text-xs font-bold text-secondary mt-1">{review.rating}/5</span>
                </div>
              </div>
              {review.feedback && (
                <p className="text-sm text-gray-600 bg-pink-50/50 p-3 rounded-lg italic border border-pink-50">
                  "{review.feedback}"
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">{new Date(review.cart.targetDate).toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' })}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
