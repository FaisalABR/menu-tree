"use client";

import { useEffect, useState } from "react";
import { AlertCircle, X, RefreshCw } from "lucide-react";

interface Props {
  message: string | null;
  onClear: () => void;
  onRetry?: () => void;
}

export default function ErrorToast({ message, onClear, onRetry }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      // Auto-hide after 8 seconds if not cleared manually
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClear, 300); // Wait for fade-out animation
      }, 8000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="bg-white border border-red-100 rounded-3xl shadow-2xl shadow-red-200/50 p-4 min-w-[320px] max-w-md flex items-center gap-4 group">
        <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
          <AlertCircle size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-0.5">
            System Error
          </p>
          <p className="text-sm text-gray-700 font-medium truncate">
            {message}
          </p>
        </div>

        <div className="flex items-center gap-1 border-l border-gray-100 pl-3 ml-1">
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
              title="Try Again"
            >
              <RefreshCw size={18} />
            </button>
          )}
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClear, 300);
            }}
            className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl transition-all active:scale-90"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
