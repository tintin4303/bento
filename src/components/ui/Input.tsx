import React from "react";

export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={`w-full px-4 py-3 rounded-xl border-2 border-pink-100 bg-pink-50/30 focus:bg-white focus:border-secondary focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
}
