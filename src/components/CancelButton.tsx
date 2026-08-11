"use client";

import { cancelOrder } from "@/app/actions";
import { useState } from "react";
import { Button } from "./ui/Button";

export function CancelButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      setLoading(true);
      await cancelOrder(orderId);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleCancel} 
      disabled={loading}
      className="text-xs py-1 px-3 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 ml-4"
    >
      {loading ? "Canceling..." : "Cancel Order"}
    </Button>
  );
}
