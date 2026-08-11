"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { createOrder } from "@/app/actions";

export function OrderForm({ menuItemId }: { menuItemId: string }) {
  const [notes, setNotes] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    await createOrder(menuItemId, notes, targetDate);
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return <span className="text-sm font-bold text-secondary">Ordered! 💕</span>;
  }

  return (
    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
      <input 
        type="date"
        value={targetDate}
        onChange={(e) => setTargetDate(e.target.value)}
        className="text-sm px-3 py-1 rounded-md border border-pink-100 bg-pink-50/30 focus:outline-none focus:border-secondary w-full sm:w-48 text-gray-600"
        required
      />
      <input 
        type="text" 
        value={notes} 
        onChange={(e) => setNotes(e.target.value)} 
        placeholder="Any notes? (e.g. no onions)" 
        className="text-sm px-3 py-1 rounded-md border border-pink-100 bg-pink-50/30 focus:outline-none focus:border-secondary w-full sm:w-48"
      />
      <Button 
        onClick={handleOrder} 
        disabled={loading || !targetDate}
        className="py-1 px-4 text-sm w-full sm:w-auto"
      >
        {loading ? "..." : "Order"}
      </Button>
    </div>
  );
}
