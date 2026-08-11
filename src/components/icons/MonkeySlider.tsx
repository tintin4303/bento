import React from "react";

export function MonkeySlider({ rating, className = "" }: { rating: number, className?: string }) {
  // rating is 1 to 5. 1 = sleeping, 5 = chef
  
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
      {/* Background circle */}
      <circle cx="50" cy="50" r="45" fill="#FDF2F8" stroke="#F43F5E" />
      
      {/* Face Base */}
      <circle cx="50" cy="50" r="25" fill="#ffffff" stroke="#171717" />
      
      {/* Ears */}
      <circle cx="20" cy="50" r="10" fill="#ffffff" stroke="#171717" />
      <circle cx="80" cy="50" r="10" fill="#ffffff" stroke="#171717" />

      {rating <= 2 ? (
        // Sleeping / Sad Monkey
        <>
          <path d="M35 45 Q40 40 45 45" stroke="#171717" />
          <path d="M55 45 Q60 40 65 45" stroke="#171717" />
          <path d="M40 60 Q50 55 60 60" stroke="#171717" />
          <text x="70" y="30" fontSize="12" fill="#171717" stroke="none">Zzz</text>
        </>
      ) : rating === 3 ? (
        // Neutral Monkey
        <>
          <circle cx="40" cy="45" r="3" fill="#171717" />
          <circle cx="60" cy="45" r="3" fill="#171717" />
          <path d="M40 60 L60 60" stroke="#171717" />
        </>
      ) : (
        // Happy Chef Monkey
        <>
          <circle cx="40" cy="45" r="3" fill="#171717" />
          <circle cx="60" cy="45" r="3" fill="#171717" />
          <path d="M40 55 Q50 65 60 55" stroke="#171717" />
          
          {/* Chef Hat */}
          <path d="M35 30 Q50 10 65 30 L60 25 L40 25 Z" fill="#ffffff" stroke="#F43F5E" />
          <path d="M40 25 L60 25 L60 15 L40 15 Z" fill="#ffffff" stroke="#F43F5E" />
        </>
      )}
    </svg>
  );
}
