"use client";

import { useRef } from "react";
import { Button } from "./ui/Button";
import { createDishRequest } from "@/app/actions/requests";

export function DishRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    await createDishRequest(formData);
    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={handleSubmit} className="flex gap-2 w-full mt-4 bg-white p-4 rounded-xl shadow-sm border border-pink-100">
      <div className="flex-1 space-y-2">
        <input 
          name="dishName" 
          type="text" 
          required 
          className="w-full px-3 py-2 text-sm rounded-lg border border-pink-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          placeholder="I'm craving..."
        />
        <input 
          name="notes" 
          type="text" 
          className="w-full px-3 py-2 text-xs rounded-lg border border-gray-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
          placeholder="Notes (optional)"
        />
      </div>
      <Button type="submit" variant="primary" className="h-full px-6 whitespace-nowrap">
        Send Request ✨
      </Button>
    </form>
  );
}
