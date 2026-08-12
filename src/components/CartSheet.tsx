"use client";

import { useTransition } from "react";
import { createCart } from "@/app/actions";
import { ShoppingBag, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export type CartItem = {
  menuItemId: string;
  name: string;
  imageUrl: string | null;
  optionId: string | null;
  optionLabel: string | null;
  notes: string;
};

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  selectedDate: string | null;
}

export function CartSheet({ isOpen, onClose, cartItems, setCartItems, selectedDate }: CartSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRemove = (index: number) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    if (!selectedDate || cartItems.length === 0) return;
    
    // Map items for the server action
    const items = cartItems.map(item => ({
      menuItemId: item.menuItemId,
      selectedOptionId: item.optionId || undefined,
      notes: item.notes
    }));

    startTransition(async () => {
      await createCart(items, selectedDate);
      setSuccess(true);
      setTimeout(() => {
        setCartItems([]);
        setSuccess(false);
        onClose();
      }, 2000);
    });
  };

  const formattedDate = selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  }) : "";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b border-pink-100">
          <h2 className="font-black text-gray-900 flex items-center gap-2">
            <ShoppingBag className="text-secondary" />
            Your Cart
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {success ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <CheckCircle2 size={48} className="text-green-500" />
              <p className="font-black text-xl text-gray-900">Order Sent!</p>
              <p className="text-gray-500">Your chef has received the order.</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2 opacity-50">
              <ShoppingBag size={48} className="text-gray-300" />
              <p className="font-bold text-gray-400">Cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-pink-50 p-3 rounded-xl border border-pink-100">
                <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Delivery Date</p>
                <p className="font-bold text-gray-900">{formattedDate}</p>
              </div>

              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm relative pr-8">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-pink-50" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-pink-50 flex items-center justify-center text-xl">🍱</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
                      {item.optionLabel && (
                        <span className="inline-block text-[10px] bg-pink-100 text-secondary px-1.5 rounded mt-1 font-bold uppercase">
                          {item.optionLabel}
                        </span>
                      )}
                      {item.notes && <p className="text-[10px] text-gray-500 italic mt-1 line-clamp-2">"{item.notes}"</p>}
                    </div>
                    <button 
                      onClick={() => handleRemove(idx)}
                      className="absolute top-2 right-2 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!success && cartItems.length > 0 && (
          <div className="p-4 border-t border-pink-100 bg-gray-50">
            <button
              onClick={handleCheckout}
              disabled={isPending}
              className="w-full bg-secondary text-white font-black py-4 rounded-xl shadow-lg shadow-pink-200 flex items-center justify-center gap-2 hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-60"
            >
              {isPending ? "Sending Order..." : `Checkout ${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
