"use client";

import { useRef, useState } from "react";
import { createDishRequest } from "@/app/actions/requests";
import { Send } from "lucide-react";

const CATEGORIES = [
  { label: "Thai",    emoji: "🍜" },
  { label: "Western", emoji: "🥩" },
  { label: "Healthy", emoji: "🥗" },
  { label: "Surprise me", emoji: "✨" },
];

export function DishRequestForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Append selected category as part of the notes if no dishName explicitly typed
    if (selectedCategory) {
      const existing = formData.get("notes") as string;
      formData.set("notes", [selectedCategory, existing].filter(Boolean).join(" · "));
    }
    await createDishRequest(formData);
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-6">
        <p className="text-3xl mb-2">🙏</p>
        <p className="font-bold text-gray-800">Request sent!</p>
        <p className="text-sm text-gray-400 mt-1">Your chef will get back to you soon.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-4 text-xs text-secondary font-semibold underline underline-offset-2"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Category chips */}
      <div>
        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Quick category</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat.label ? null : cat.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all active:scale-95 ${
                selectedCategory === cat.label
                  ? "bg-secondary text-white border-secondary shadow-sm"
                  : "bg-white text-gray-600 border-pink-100 hover:border-secondary"
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main input */}
      <div className="space-y-2">
        <input
          name="dishName"
          type="text"
          required
          className="w-full px-4 py-3 text-sm rounded-xl border border-pink-100 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/30 transition-all bg-white"
          placeholder="I'm craving..."
        />
        <input
          name="notes"
          type="text"
          className="w-full px-4 py-2.5 text-xs rounded-xl border border-gray-100 focus:outline-none focus:border-secondary transition-all bg-white text-gray-600"
          placeholder="Extra notes (optional — e.g. not too spicy)"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-sm bg-secondary text-white hover:bg-pink-600 active:scale-95 transition-all disabled:opacity-50"
      >
        <Send size={15} />
        {loading ? "Sending..." : "Send Request"}
      </button>
    </form>
  );
}
