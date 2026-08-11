"use client";

import { toggleFavorite } from "@/app/actions";
import { useState } from "react";

export function FavoriteButton({ menuItemId, isFavorite }: { menuItemId: string; isFavorite: boolean }) {
  const [optimisticFav, setOptimisticFav] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    setOptimisticFav(!optimisticFav);
    await toggleFavorite(menuItemId, !optimisticFav);
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={loading}
      className={`text-2xl transition-transform hover:scale-110 active:scale-95 ${optimisticFav ? "text-secondary" : "text-pink-200"}`}
      title={optimisticFav ? "Unfavorite" : "Favorite"}
    >
      {optimisticFav ? "❤️" : "♡"}
    </button>
  );
}
