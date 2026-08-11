import React from "react";

export function MonkeyStirring({ className = "" }: { className?: string }) {
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
      {/* Pot */}
      <path d="M20 70 Q50 90 80 70 L75 50 Q50 60 25 50 Z" fill="#FDF2F8" stroke="#F43F5E" />
      <path d="M20 50 Q50 60 80 50" stroke="#F43F5E" />
      
      {/* Spoon */}
      <path d="M40 30 L60 65" stroke="#F43F5E" strokeWidth="3" />
      
      {/* Monkey Head */}
      <circle cx="50" cy="30" r="15" fill="#FDF2F8" stroke="#171717" />
      <circle cx="43" cy="27" r="2" fill="#171717" />
      <circle cx="57" cy="27" r="2" fill="#171717" />
      <path d="M45 35 Q50 40 55 35" stroke="#171717" />
      
      {/* Monkey Ears */}
      <circle cx="32" cy="30" r="5" fill="#FDF2F8" stroke="#171717" />
      <circle cx="68" cy="30" r="5" fill="#FDF2F8" stroke="#171717" />
      
      {/* Steam */}
      <path d="M35 45 Q30 35 40 25" stroke="#F43F5E" strokeDasharray="2 2" />
      <path d="M65 45 Q70 35 60 25" stroke="#F43F5E" strokeDasharray="2 2" />
    </svg>
  );
}
