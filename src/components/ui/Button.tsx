import React from "react";

export function Button({ className = "", variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "outline" }) {
  const baseStyles = "px-4 py-2 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-secondary text-white shadow-md hover:bg-rose-600 hover:shadow-lg",
    secondary: "bg-white text-secondary shadow-sm border border-pink-100 hover:bg-primary",
    outline: "border-2 border-secondary text-secondary hover:bg-primary"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
}
