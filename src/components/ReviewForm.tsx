"use client";

import { useState } from "react";
import { MonkeySlider } from "./icons/MonkeySlider";
import { Button } from "./ui/Button";
import { submitReview } from "@/app/actions";

export function ReviewForm({ orderId }: { orderId: string }) {
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await submitReview(orderId, rating, feedback);
    setSubmitted(true);
  };

  if (submitted) {
    return <div className="text-sm font-bold text-secondary text-center">Thanks for the review! 💕</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-4 justify-between bg-pink-50/50 p-4 rounded-xl border border-pink-100">
        <span className="text-sm font-bold text-gray-700 w-16 text-center">{rating} / 5</span>
        
        <input 
          type="range" 
          min="1" 
          max="5" 
          value={rating} 
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-full accent-secondary"
        />
        
        <MonkeySlider rating={rating} className="w-16 h-16 text-secondary" />
      </div>

      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Any specific feedback? (e.g. less salty next time)"
        className="w-full text-sm px-3 py-2 rounded-md border border-pink-100 focus:outline-none focus:border-secondary h-20 bg-pink-50/30"
      />

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}
