"use client";

import { ReactNode } from "react";
import { LogoutButton } from "./LogoutButton";

interface HamburgerMenuProps {
  children: ReactNode;
}

export function HamburgerMenu({ children }: HamburgerMenuProps) {
  return (
    <div>
      <button 
        type="button"
        // @ts-ignore
        popovertarget="app-menu"
        className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors"
        aria-label="Open Menu"
      >
        <span className="w-5 h-0.5 bg-gray-600 rounded-full"></span>
        <span className="w-5 h-0.5 bg-gray-600 rounded-full"></span>
        <span className="w-5 h-0.5 bg-gray-600 rounded-full"></span>
      </button>

      <div 
        id="app-menu" 
        // @ts-ignore
        popover="auto"
        className="m-0 mt-2 mr-4 bg-white p-2 rounded-2xl shadow-xl border border-gray-100 min-w-[200px]"
        // Anchor it to top right, styling can just be absolute via css
        style={{ inset: 'auto 1rem auto auto', top: '4rem' }}
      >
        <div className="flex flex-col gap-1">
          {children}
          <div className="h-px bg-gray-100 my-1 mx-2" />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}

export function MenuButton({ onClick, icon, label }: { onClick: () => void, icon: ReactNode, label: string }) {
  return (
    <button 
      type="button" 
      onClick={(e) => {
        onClick();
        // Close the popover after clicking
        const popover = document.getElementById('app-menu');
        // @ts-ignore
        if (popover && typeof popover.hidePopover === 'function') {
          // @ts-ignore
          popover.hidePopover();
        }
      }}
      className="flex items-center gap-3 w-full text-left px-4 py-2 hover:bg-pink-50 rounded-xl transition-colors text-sm font-semibold text-gray-700 hover:text-secondary"
    >
      <span className="text-gray-500">{icon}</span>
      {label}
    </button>
  );
}
