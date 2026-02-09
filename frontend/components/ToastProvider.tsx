/**
 * Toast notification provider component
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { toastManager, Toast } from '@/lib/toast';

const ToastContext = createContext<any>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  React.useEffect(() => {
    const unsubscribe = toastManager.subscribe(setToasts);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ToastContext.Provider value={{}}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-3 rounded-lg text-white shadow-lg fade-in ${
              toast.type === 'success'
                ? 'bg-green-500'
                : toast.type === 'error'
                ? 'bg-red-500'
                : 'bg-blue-500'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
