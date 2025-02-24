'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { Toast } from '@/components/Toast';

interface ToastContextType {
  showToast: (message: string, variant?: 'success' | 'error' | 'warning' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; variant?: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  const showToast = useCallback((message: string, variant: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ message, variant });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}; 