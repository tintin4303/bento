"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { createOrder } from "@/app/actions";

export function OrderForm({ menuItemId }: { menuItemId: string }) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleOrder = async () => {
    setLoading(true);
    await createOrder(menuItemId, notes);
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return <span className="text-sm font-bold text-secondary">Ordered! 💕</span>;
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <input 
        type="text" 
        value={notes} 
        onChange={(e) => setNotes(e.target.value)} 
        placeholder="Any notes? (e.g. no onions)" 
        className="text-sm px-3 py-1 rounded-md border border-pink-100 bg-pink-50/30 focus:outline-none focus:border-secondary w-full max-w-[200px]"
      />
      <Button 
        onClick={handleOrder} 
        disabled={loading}
        className="py-1 px-4 text-sm"
      >
        {loading ? "..." : "Order"}
      </Button>
    </div>
  );
}
