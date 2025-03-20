"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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
      {messages.map((msg) => (
        <ToastMessage
          key={msg.id}
          message={msg.message}
          type={msg.type}
          duration={duration}
          onClose={() => onClose(msg.id)}
        />
      ))}
    </div>,
    document.body
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
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  }[type];

  return (
    <div
      className={`alert ${alertClass} transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span>{message}</span>
    </div>
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
    [showToast]
  );

  const showErrorToast = useCallback(
    (message: string) => showToast(message, "error"),
    [showToast]
  );

  const showInfoToast = useCallback(
    (message: string) => showToast(message, "info"),
    [showToast]
  );

  const showWarningToast = useCallback(
    (message: string) => showToast(message, "warning"),
    [showToast]
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
