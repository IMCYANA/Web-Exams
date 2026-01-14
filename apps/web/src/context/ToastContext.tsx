'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    success: (message: string) => void;
    error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const success = (message: string) => showToast(message, 'success');
    const error = (message: string) => showToast(message, 'error');

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, success, error }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className={`
                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-md min-w-[300px]
                ${toast.type === 'success' ? 'bg-[#18181b]/90 border-green-500/20 text-green-500' : ''}
                ${toast.type === 'error' ? 'bg-[#18181b]/90 border-red-500/20 text-red-500' : ''}
                ${toast.type === 'info' ? 'bg-[#18181b]/90 border-blue-500/20 text-blue-500' : ''}
              `}
                        >
                            {toast.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
                            {toast.type === 'error' && <AlertCircle className="h-5 w-5" />}
                            {toast.type === 'info' && <Info className="h-5 w-5" />}

                            <p className="text-sm font-medium text-gray-200 flex-1">{toast.message}</p>

                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
