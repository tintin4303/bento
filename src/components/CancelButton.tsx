"use client";

import { cancelCart } from "@/app/actions";
import { useTransition } from "react";

export function CancelButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    startTransition(async () => {
      await cancelCart(orderId);
      // Polling will remove the card from the list within 3 s
    });
  };

  return (
    <button
      onClick={handleCancel}
      disabled={isPending}
      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ml-4 flex-shrink-0
        ${isPending
          ? "border-gray-200 text-gray-300 cursor-not-allowed"
          : "border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 active:scale-95"
        }`}
    >
      {isPending ? "Canceling…" : "Cancel"}
    </button>
  );
}
