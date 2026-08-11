"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/Button";

export function LogoutButton() {
  return (
    <Button 
      variant="outline" 
      className="text-xs py-1 px-3 border-pink-200 text-gray-500 hover:text-white"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      Logout
    </Button>
  );
}
