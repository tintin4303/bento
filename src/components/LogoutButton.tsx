"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-red-50 rounded-xl transition-colors text-sm font-semibold text-red-400 hover:text-red-500"
    >
      <span className="text-red-300">
        <LogOut size={18} />
      </span>
      Logout
    </button>
  );
}
