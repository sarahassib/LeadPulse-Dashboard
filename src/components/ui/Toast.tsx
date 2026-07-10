"use client";

import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface ToastItem {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

const icons = {
  success: <CheckCircle size={18} className="text-primary-400" />,
  error: <AlertCircle size={18} className="text-red-400" />,
  info: <Info size={18} className="text-accent-400" />,
};

const bgColors = {
  success: "bg-primary-500/10 border-primary-500/20",
  error: "bg-red-500/10 border-red-500/20",
  info: "bg-accent-500/10 border-accent-500/20",
};

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColors[toast.type]}`}
        >
          {icons[toast.type]}
          <span className="text-sm text-white">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-2 p-0.5 rounded hover:bg-surface-card/10"
          >
            <X size={14} className="text-text-muted" />
          </button>
        </div>
      ))}
    </div>
  );
}

