"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Card } from "./ui/Card";
import { updateMenuItem } from "@/app/actions/menu";

interface EditMenuItemFormProps {
  item: any;
  onCancel: () => void;
  onOptimisticUpdate?: (item: any) => void;
}

export function EditMenuItemForm({ item, onCancel, onOptimisticUpdate }: EditMenuItemFormProps) {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (onOptimisticUpdate) {
      onOptimisticUpdate({
        ...item,
        name: formData.get("name"),
        description: formData.get("description"),
        category: formData.get("category"),
        optionsRequired: formData.get("optionsRequired") === "true",
      });
    }

    setLoading(true);
    await updateMenuItem(item.id, formData, item.imageUrl);
    setLoading(false);
    onCancel();
  };

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900">Edit Dish</h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-600">Dish Name</label>
          <Input name="name" required defaultValue={item.name} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-600">Description</label>
          <Input name="description" defaultValue={item.description || ""} />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-600">Category</label>
            <select name="category" defaultValue={item.category} className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 bg-pink-50/30 focus:bg-white focus:border-secondary focus:outline-none transition-colors">
              <option value="MAIN">Main</option>
              <option value="SIDE">Side</option>
              <option value="DRINK">Drink</option>
              <option value="DESSERT">Dessert</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs font-bold text-gray-600">Picture (Optional)</label>
            <Input type="file" name="image" accept="image/*" className="py-2" />
            <p className="text-[10px] text-gray-500 mt-1">Leave empty to keep current picture.</p>
          </div>
        </div>
        
        <div className="border-t border-pink-50 pt-4 mt-2">
          <label className="text-xs font-bold text-gray-600 flex justify-between items-center mb-2">
            <span>Dish Options Settings</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="checkbox" name="optionsRequired" value="true" defaultChecked={item.optionsRequired} className="rounded text-secondary" />
              <span className="text-[10px] uppercase">Required</span>
            </label>
          </label>
          <p className="text-[10px] text-gray-500">Note: You can add/remove options from the main menu view.</p>
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button type="button" onClick={onCancel} variant="secondary" className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
