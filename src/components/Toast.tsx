'use client';

import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, isVisible, onClose, duration = 2000 }: ToastProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, duration);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform transition-all duration-200">
      <div className="bg-text-primary flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-400"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {message}
      </div>
    </div>
  );
}
