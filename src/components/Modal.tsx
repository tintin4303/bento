"use client";

import { useEffect, useRef, ReactNode } from "react";

interface ModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ id, isOpen, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
      }
    } else {
      if (dialog.open) {
        dialog.close();
        document.body.style.overflow = '';
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Fallback for browsers without closedby support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;

        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );

        if (!isDialogContent) {
          dialog.close();
        }
      };
      
      dialog.addEventListener('click', handleClick);
      return () => dialog.removeEventListener('click', handleClick);
    }
  }, []);

  const handleClose = () => {
    onClose();
  };

  return (
    // @ts-ignore - closedby is relatively new
    <dialog 
      id={id} 
      ref={dialogRef} 
      closedby="any" 
      aria-labelledby={`${id}-title`}
      onClose={handleClose}
      className="p-0 rounded-2xl shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm max-w-lg w-full m-auto border-0 focus:outline-none bg-white open:animate-in open:fade-in open:zoom-in-95"
    >
      <div className="bg-white p-6 w-full max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/90 backdrop-blur pb-2 z-10 border-b border-gray-100">
          <h2 id={`${id}-title`} className="text-2xl font-bold text-gray-900">{title}</h2>
          <button 
            type="button" 
            onClick={() => dialogRef.current?.close()}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors font-bold"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
