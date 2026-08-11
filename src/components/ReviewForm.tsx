"use client";

import { useState } from "react";
import { submitReview } from "@/app/actions";
import { Star } from "lucide-react";

export function ReviewForm({ orderId }: { orderId: string }) {
  const [rating, setRating] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    await submitReview(orderId, rating, feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <p className="text-2xl mb-1">🎉</p>
        <p className="text-sm font-bold text-secondary">Thanks for the feedback!</p>
      </div>
    );
  }

  const labels: Record<number, string> = {
    1: "Not great 😞",
    2: "Could be better 😐",
    3: "Pretty good 🙂",
    4: "Really loved it 😍",
    5: "Absolutely perfect! 🤩",
  };

  const active = hovered || rating;

  return (
    <div className="flex flex-col gap-4">
      {/* Star selector */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="p-1 transition-transform hover:scale-125 active:scale-95"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                size={32}
                className={`transition-colors ${
                  star <= active
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-200 fill-gray-200"
                }`}
              />
            </button>
          ))}
        </div>
        <p className={`text-xs font-bold transition-all ${active ? "text-gray-700 opacity-100" : "opacity-0"}`}>
          {labels[active] ?? ""}
        </p>
      </div>

      {/* Feedback */}
      <textarea
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
        placeholder="Any specific feedback? (optional)"
        className="w-full text-sm px-3 py-2 rounded-xl border border-pink-100 focus:outline-none focus:border-secondary h-16 bg-pink-50/30 resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={loading || !rating}
        className="w-full py-2.5 rounded-xl font-bold text-sm bg-secondary text-white hover:bg-pink-600 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
