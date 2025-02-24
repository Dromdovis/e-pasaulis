'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

const toastVariants = cva(
  "fixed flex items-center p-4 rounded-lg shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        success: "bg-success-100 text-success-800 border border-success-200",
        error: "bg-error-100 text-error-800 border border-error-200",
        warning: "bg-warning-100 text-warning-800 border border-warning-200",
        info: "bg-primary-100 text-primary-800 border border-primary-200",
      },
      position: {
        'top-right': "top-4 right-4",
        'top-left': "top-4 left-4",
        'bottom-right': "bottom-4 right-4",
        'bottom-left': "bottom-4 left-4",
      }
    },
    defaultVariants: {
      variant: "info",
      position: "top-right"
    }
  }
);

interface ToastProps extends VariantProps<typeof toastVariants> {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, variant, position, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={toastVariants({ variant, position })}>
      <span className="mr-2">{message}</span>
      <button onClick={onClose} className="p-1 hover:bg-black/5 rounded">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
} 