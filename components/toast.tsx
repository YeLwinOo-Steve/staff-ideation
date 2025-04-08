"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  messages: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast = ({ messages, duration = 2000, onClose }: ToastProps) => {
  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(
    <div className="toast toast-center z-50">
      <AnimatePresence>
        {messages.map((msg) => (
          <ToastMessage
            key={msg.id}
            message={msg.message}
            type={msg.type}
            duration={duration}
            onClose={() => onClose(msg.id)}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
};

interface ToastMessageProps {
  message: string;
  type: ToastType;
  duration: number;
  onClose: () => void;
}

const ToastMessage = ({
  message,
  type,
  duration,
  onClose,
}: ToastMessageProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const alertClass = {
    success: "bg-success text-success-content",
    error: "bg-error text-error-content",
    warning: "bg-warning text-warning-content",
    info: "bg-info text-info-content",
  }[type];

  const Icon = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }[type];

  return (
    isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl ${alertClass}`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={() => setIsVisible(false)}
          className="btn btn-circle btn-ghost btn-xs ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    )
  );
};

import { createContext, useContext, useCallback, ReactNode } from "react";

interface ToastContextProps {
  showToast: (message: string, type: ToastType) => void;
  showSuccessToast: (message: string) => void;
  showErrorToast: (message: string) => void;
  showInfoToast: (message: string) => void;
  showWarningToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  duration?: number;
}

export const ToastProvider = ({
  children,
  duration = 2000,
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastType }>
  >([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const showSuccessToast = useCallback(
    (message: string) => showToast(message, "success"),
    [showToast],
  );

  const showErrorToast = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast],
  );

  const showInfoToast = useCallback(
    (message: string) => showToast(message, "info"),
    [showToast],
  );

  const showWarningToast = useCallback(
    (message: string) => showToast(message, "warning"),
    [showToast],
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccessToast,
        showErrorToast,
        showInfoToast,
        showWarningToast,
      }}
    >
      {children}
      {toasts.length > 0 && (
        <Toast messages={toasts} duration={duration} onClose={removeToast} />
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
