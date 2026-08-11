"use client";

import { toggleFavorite } from "@/app/actions";
import { useState } from "react";
import { Heart } from "lucide-react";

export function FavoriteButton({ menuItemId, isFavorite }: { menuItemId: string; isFavorite: boolean }) {
  const [optimisticFav, setOptimisticFav] = useState(isFavorite);
  const [loading, setLoading] = useState(false);
  const [burst, setBurst] = useState(false);

  const handleToggle = async () => {
    if (loading) return;
    const next = !optimisticFav;
    setOptimisticFav(next);
    if (next) {
      setBurst(true);
      setTimeout(() => setBurst(false), 400);
    }
    setLoading(true);
    await toggleFavorite(menuItemId, next);
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={optimisticFav ? "Remove from favourites" : "Add to favourites"}
      className={`
        relative flex items-center justify-center
        w-9 h-9 rounded-full flex-shrink-0
        transition-all duration-150
        active:scale-90
        ${optimisticFav
          ? "bg-pink-100 hover:bg-pink-200"
          : "bg-gray-100 hover:bg-pink-100"}
        ${burst ? "scale-125" : "scale-100"}
      `}
    >
      <Heart
        size={17}
        className={`transition-all duration-200 ${
          optimisticFav
            ? "fill-secondary text-secondary"
            : "fill-transparent text-gray-400 group-hover:text-secondary"
        }`}
      />

      {/* Burst ring animation on favourite */}
      {burst && (
        <span className="absolute inset-0 rounded-full bg-secondary/20 animate-ping" />
      )}
    </button>
  );
}
