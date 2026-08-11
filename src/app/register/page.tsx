"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MonkeyStirring } from "@/components/icons/MonkeyStirring";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [error, setError] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setError("");
    formData.append("role", role);
    try {
      await registerUser(formData);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 p-4">
      <Card className="max-w-md w-full p-8 shadow-xl">
        <div className="flex justify-center mb-6">
          <MonkeyStirring className="w-24 h-24 text-secondary animate-bounce" />
        </div>
        
        <h1 className="text-3xl font-black text-center text-gray-900 mb-2">Create Account</h1>
        <p className="text-center text-gray-500 mb-8 font-semibold">Join the Bento Box family!</p>

        <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
          <button 
            type="button"
            onClick={() => setRole("USER")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === "USER" ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            I'm a Guest 💁‍♀️
          </button>
          <button 
            type="button"
            onClick={() => setRole("ADMIN")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${role === "ADMIN" ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
          >
            I'm a Chef 👨‍🍳
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm font-semibold rounded-lg border border-red-100 text-center">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
            <input 
              name="username" 
              type="text" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-pink-100 transition-all font-medium"
              placeholder="e.g. cutiepie99"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input 
              name="password" 
              type="password" 
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-pink-100 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          {role === "USER" && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Chef Code (Required)</label>
              <input 
                name="chefCode" 
                type="text" 
                required 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-secondary focus:ring-2 focus:ring-pink-100 transition-all font-medium uppercase"
                placeholder="e.g. X79B2P"
              />
              <p className="text-xs text-gray-400 mt-2 font-medium">Ask your personal Chef for their secret 6-digit code!</p>
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full py-3 text-lg mt-4 shadow-lg shadow-pink-200">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6 font-medium">
          Already have an account? <Link href="/login" className="text-secondary font-bold hover:underline">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
