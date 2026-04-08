'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    className: 'border-[oklch(0.80_0.10_155)] bg-[oklch(0.97_0.03_155)] text-[oklch(0.38_0.15_155)]',
    iconClass: 'text-[oklch(0.60_0.18_155)]',
  },
  error: {
    icon: XCircle,
    className: 'border-[oklch(0.85_0.10_25)] bg-[oklch(0.98_0.03_25)] text-[oklch(0.40_0.20_25)]',
    iconClass: 'text-[oklch(0.58_0.22_25)]',
  },
  warning: {
    icon: AlertCircle,
    className: 'border-[oklch(0.85_0.12_75)] bg-[oklch(0.98_0.05_75)] text-[oklch(0.45_0.15_75)]',
    iconClass: 'text-[oklch(0.72_0.17_75)]',
  },
  info: {
    icon: Info,
    className: 'border-[oklch(0.80_0.10_245)] bg-[oklch(0.97_0.03_245)] text-[oklch(0.42_0.20_245)]',
    iconClass: 'text-[oklch(0.60_0.20_245)]',
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {mounted &&
        createPortal(
          <div id="toast-container">
            {toasts.map((toast) => {
              const Icon = typeConfig[toast.type].icon;
              return (
                <div
                  key={toast.id}
                  className={cn('toast', typeConfig[toast.type].className)}
                >
                  <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', typeConfig[toast.type].iconClass)} />
                  <div className="flex-1 mr-2">
                    <p className="font-semibold">{toast.title}</p>
                    {toast.message && (
                      <p className="text-sm opacity-90 mt-0.5">{toast.message}</p>
                    )}
                  </div>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="shrink-0 p-1 rounded-md hover:bg-black/5 opacity-70 hover:opacity-100 transition-all font-medium"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
