"use client";

import { useState } from "react";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { connectChef } from "@/app/actions/profile";
import { Hash } from "lucide-react";

interface ConnectedChefProfileProps {
  chef: {
    displayName: string | null;
    username: string;
    avatarUrl: string | null;
  } | null;
}

export function ConnectedChefProfile({ chef }: ConnectedChefProfileProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    try {
      await connectChef(formData);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (!chef) {
    return (
      <div className="py-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center text-2xl shadow-md mx-auto mb-4">
            👩‍🍳
          </div>
          <h2 className="text-xl font-bold text-gray-900">Connect to a Chef</h2>
          <p className="text-sm text-gray-500 mt-1">You need a chef to start ordering food.</p>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Chef Code
            </label>
            <div className="relative">
              <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <Input
                name="chefCode"
                type="text"
                required
                className="pl-11 font-bold text-gray-900 uppercase tracking-widest"
                placeholder="6-digit code from your chef"
              />
            </div>
          </div>
          {error && <p className="text-xs font-bold text-red-500 text-center">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Connecting..." : "Connect Chef"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center mb-4">
        {chef.avatarUrl ? (
          <img src={chef.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-pink-100 shadow-md mb-4" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center text-4xl shadow-md mb-4">
            👨‍🍳
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900">{chef.displayName || chef.username}</h2>
        <p className="text-gray-500 font-semibold">Your Personal Chef</p>
      </div>
      
      <Card className="w-full bg-pink-50/50 border-pink-100 mt-4 p-4 text-center">
        <p className="text-sm text-gray-600">
          This is the talented chef preparing your meals! You can request custom dishes or leave feedback for them using the other menu options.
        </p>
      </Card>
    </div>
  );
}
