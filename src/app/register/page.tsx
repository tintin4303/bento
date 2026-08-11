"use client";

import { useState } from "react";
import { User, Lock, Hash, ChefHat, UtensilsCrossed, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";

export default function RegisterPage() {
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError("");
    setLoading(true);
    formData.append("role", role);
    try {
      await registerUser(formData);
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const isGuest = role === "USER";

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-500 via-secondary to-pink-400 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-8 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <ChefHat size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">Bento</h1>
          <p className="text-xl font-medium text-pink-100 max-w-xs leading-relaxed">
            {isGuest
              ? "Connect with your personal chef and order your favourite meals."
              : "Set up your chef profile and start cooking for your guests."}
          </p>

          <div className="mt-12 bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-left">
            {isGuest ? (
              <div className="space-y-3 text-sm text-pink-100">
                <p className="font-black text-white text-base mb-4">As a guest you can:</p>
                {["Browse your chef's weekly menu", "Place & track orders by date", "Rate meals and leave feedback", "Request new dishes"].map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-200 rounded-full flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 text-sm text-pink-100">
                <p className="font-black text-white text-base mb-4">As a chef you can:</p>
                {["Manage your weekly menu", "Track and update orders", "Read guest feedback", "Respond to dish requests"].map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-200 rounded-full flex-shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center bg-[#FDF2F8] p-6">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center">
              <ChefHat size={22} className="text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900">Bento</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-400 font-medium mb-6">Join the Bento family</p>

          {/* Role toggle */}
          <div className="flex p-1 bg-white rounded-2xl border border-gray-200 mb-6 shadow-sm">
            <button
              type="button"
              onClick={() => setRole("USER")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                role === "USER" ? "bg-secondary text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <UtensilsCrossed size={15} />
              I'm a Guest
            </button>
            <button
              type="button"
              onClick={() => setRole("ADMIN")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                role === "ADMIN" ? "bg-secondary text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <ChefHat size={15} />
              I'm a Chef
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-sm font-semibold rounded-xl px-4 py-3 mb-4 text-center">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  name="username"
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                  placeholder="choose a username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                  placeholder="choose a password"
                />
              </div>
            </div>

            {/* Chef code (guest only) */}
            {role === "USER" && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Chef Code
                </label>
                <div className="relative">
                  <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    name="chefCode"
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all font-bold text-gray-900 uppercase tracking-widest placeholder:text-gray-300 placeholder:font-normal placeholder:normal-case placeholder:tracking-normal"
                    placeholder="6-digit code from your chef"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5 font-medium">Ask your chef for their secret invite code.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-rose-600 active:scale-[0.98] text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/25 mt-2 disabled:opacity-60"
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <>Create Account <ArrowRight size={18} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-secondary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
