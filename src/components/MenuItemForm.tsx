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
  
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");
  const [optionsRequired, setOptionsRequired] = useState(false);

  const handleAddOption = (e: React.MouseEvent) => {
    e.preventDefault();
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (opt: string) => {
    setOptions(options.filter(o => o !== opt));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Append options data
    formData.set("options", JSON.stringify(options));
    formData.set("optionsRequired", optionsRequired ? "true" : "false");
    
    if (onOptimisticAdd) {
      onOptimisticAdd({
        id: Math.random().toString(),
        name: formData.get("name"),
        description: formData.get("description"),
        category: formData.get("category"),
        imageUrl: null,
        isAvailableThisWeek: true,
        optionsRequired,
        options: options.map(label => ({ id: Math.random().toString(), label }))
      });
    }

    setLoading(true);
    await createMenuItem(formData);
    setLoading(false);
    setIsOpen(false);
    setOptions([]);
    setOptionsRequired(false);
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

        <div className="border-t border-pink-50 pt-4 mt-2">
          <label className="text-xs font-bold text-gray-600 flex justify-between items-center mb-2">
            <span>Dish Options (Variants)</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" checked={optionsRequired} onChange={(e) => setOptionsRequired(e.target.checked)} className="rounded text-secondary" />
              <span className="text-[10px] uppercase">Required</span>
            </label>
          </label>
          <div className="flex gap-2">
            <Input value={newOption} onChange={e => setNewOption(e.target.value)} placeholder="e.g. Chicken" className="text-sm" />
            <Button onClick={handleAddOption} variant="secondary" className="px-4 py-2 shrink-0">Add Option</Button>
          </div>
          {options.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {options.map(opt => (
                <span key={opt} className="inline-flex items-center gap-1 px-3 py-1 bg-pink-50 text-secondary border border-pink-100 rounded-full text-xs font-bold">
                  {opt}
                  <button type="button" onClick={() => handleRemoveOption(opt)} className="hover:text-pink-800 ml-1">✕</button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Save Dish"}
        </Button>
      </form>
    </Card>
  );
}
