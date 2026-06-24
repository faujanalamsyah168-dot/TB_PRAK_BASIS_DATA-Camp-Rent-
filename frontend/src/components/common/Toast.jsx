import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'bg-[#3B593F] text-white border-emerald-600',
    error: 'bg-red-900/95 text-white border-red-500',
    info: 'bg-[#1E232A] text-white border-[#E2725B]',
  };

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-[#E2725B]" />,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-slide-up rounded-xl border-l-4 p-4 shadow-2xl backdrop-blur-md transition-all duration-300">
      <div className={`flex items-start gap-3 rounded-lg p-1 ${bgColors[type] || bgColors.success}`}>
        <span>{icons[type]}</span>
        <div className="flex-1 text-sm font-medium pr-2">{message}</div>
        <button
          onClick={onClose}
          className="rounded-lg p-0.5 hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4 text-white/80 hover:text-white" />
        </button>
      </div>
    </div>
  );
}
