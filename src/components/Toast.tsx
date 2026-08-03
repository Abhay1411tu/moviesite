import { useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import type { Toast as ToastType } from "../types";

interface ToastProps {
  toast: ToastType;
  onRemove: (id: number) => void;
}

export function ToastItem({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-rose-500" />,
    info: <Info className="w-5 h-5 text-coral" />,
  };

  const borders = {
    success: "border-emerald-200",
    error: "border-rose-200",
    info: "border-coral/30",
  };

  return (
    <div
      className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-2xl glass-strong border ${borders[toast.type]} shadow-xl w-full`}
    >
      {icons[toast.type]}
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-1 rounded-lg hover:bg-white/50 text-gray-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: number) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-20 sm:top-24 left-0 right-0 z-[60] flex flex-col items-center gap-3 px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}
