"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, Loader2, ChefHat } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Incorrect username or password.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-500 via-secondary to-pink-400 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-8 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <ChefHat size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-4">Bento</h1>
          <p className="text-xl font-medium text-pink-100 max-w-xs leading-relaxed">
            Your personal chef, your favourite meals — all in one place.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Order",    sub: "your favourites" },
              { label: "Request",  sub: "new dishes" },
              { label: "Rate",     sub: "your meals" },
            ].map(({ label, sub }) => (
              <div key={label} className="bg-white/15 backdrop-blur-sm rounded-2xl p-4">
                <p className="font-black text-lg">{label}</p>
                <p className="text-xs text-pink-100 mt-0.5">{sub}</p>
              </div>
            ))}
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

          <h2 className="text-3xl font-black text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-400 font-medium mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                  placeholder="your username"
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all font-semibold text-gray-900 placeholder:text-gray-300 placeholder:font-normal"
                  placeholder="your password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-500 text-sm font-semibold rounded-xl px-4 py-3 text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary hover:bg-rose-600 active:scale-[0.98] text-white font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/25 mt-2 disabled:opacity-60"
            >
              {loading
                ? <Loader2 size={18} className="animate-spin" />
                : <>Sign In <ArrowRight size={18} /></>
              }
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6 font-medium">
            No account?{" "}
            <Link href="/register" className="text-secondary font-bold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
