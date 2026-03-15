import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ToastContext = createContext(null);

const variantStyles = {
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-sky-200 bg-sky-50 text-sky-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900"
};

let toastCount = 0;

function ToastItem({ toast, onDismiss }) {
  const { description, duration = 3200, id, title, variant = "info" } = toast;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [duration, id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-3 shadow-lg backdrop-blur ${variantStyles[variant] || variantStyles.info}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-semibold">{title}</p>
          {description ? <p className="text-sm opacity-80">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="rounded-full px-2 py-1 text-xs font-semibold opacity-70 transition hover:opacity-100"
          aria-label="Dismiss notification"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));
  }, []);

  const showToast = useCallback(({ description = "", duration = 3200, title, variant = "info" }) => {
    const id = `toast-${Date.now()}-${toastCount++}`;

    setToasts((currentToasts) => [
      ...currentToasts,
      {
        description,
        duration,
        id,
        title,
        variant
      }
    ]);
  }, []);

  const value = useMemo(
    () => ({
      dismissToast,
      error(title, description = "", duration) {
        showToast({ description, duration, title, variant: "error" });
      },
      info(title, description = "", duration) {
        showToast({ description, duration, title, variant: "info" });
      },
      success(title, description = "", duration) {
        showToast({ description, duration, title, variant: "success" });
      }
    }),
    [dismissToast, showToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
