import React from "react";

export function MonkeyEmpty({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Lunchbox */}
      <rect x="20" y="60" width="60" height="30" rx="5" fill="#ffffff" stroke="#171717" />
      <path d="M20 75 L80 75" stroke="#171717" strokeDasharray="4 4" />
      
      {/* Empty symbol inside box */}
      <circle cx="50" cy="75" r="5" stroke="#F43F5E" />
      <path d="M46 79 L54 71" stroke="#F43F5E" />

      {/* Monkey peering in */}
      <path d="M30 40 Q50 20 70 40 L65 60 L35 60 Z" fill="#FDF2F8" stroke="#171717" />
      
      {/* Eyes looking down */}
      <circle cx="43" cy="45" r="3" fill="#171717" />
      <circle cx="57" cy="45" r="3" fill="#171717" />
      <path d="M45 52 Q50 55 55 52" stroke="#171717" />

      {/* Question Marks */}
      <text x="75" y="30" fontSize="16" fill="#F43F5E" stroke="none">?</text>
      <text x="15" y="40" fontSize="12" fill="#F43F5E" stroke="none">?</text>
    </svg>
  );
}
