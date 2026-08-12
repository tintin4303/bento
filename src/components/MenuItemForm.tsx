"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";
import { createMenuItem } from "@/app/actions/menu";
import { Category } from "@/generated/prisma/client";

export function MenuItemForm({ onOptimisticAdd }: { onOptimisticAdd?: (item: any) => void }) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (onOptimisticAdd) {
      onOptimisticAdd({
        id: Math.random().toString(),
        name: formData.get("name"),
        description: formData.get("description"),
        category: formData.get("category"),
        imageUrl: null, // Optimistic UI won't have the uploaded image URL yet
        isAvailableThisWeek: true,
      });
    }

    setLoading(true);
    await createMenuItem(formData);
    setLoading(false);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full mb-4">
        + Add New Dish
      </Button>
    );
  }

  return (
    <Card className="mb-6 border-secondary">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">Add New Dish</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-600">Dish Name</label>
          <Input name="name" required placeholder="e.g. Krapao (Dry Beef)" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600">Description</label>
          <Input name="description" placeholder="e.g. Spicy and authentic" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-600">Category</label>
            <select name="category" className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 bg-pink-50/30 focus:bg-white focus:border-secondary focus:outline-none transition-colors">
              <option value="MAIN">Main</option>
              <option value="SIDE">Side</option>
              <option value="DRINK">Drink</option>
              <option value="DESSERT">Dessert</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-600">Picture (Optional)</label>
            <Input type="file" name="image" accept="image/*" className="py-2" />
          </div>
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Dish"}
        </Button>
      </form>
    </Card>
  );
}
