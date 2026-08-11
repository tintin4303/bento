import React from "react";

export function Card({ className = "", children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-pink-50 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
