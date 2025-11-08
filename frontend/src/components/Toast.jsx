import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, options = {}) => {
    const id = ++idCounter;
    const toast = {
      id,
      message,
      type: options.type || "info",
      duration: typeof options.duration === "number" ? options.duration : 4000,
    };
    setToasts((prev) => {
      const exists = prev.some(
        (x) => x.message === toast.message && x.type === toast.type
      );
      if (exists) return prev;
      return [...prev, toast];
    });
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => removeToast(t.id), t.duration)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div style={containerStyle} aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              ...toastStyle,
              ...(t.type === "error" ? toastErrorStyle : {}),
            }}
          >
            {t.message}
            <button
              onClick={() => removeToast(t.id)}
              style={closeBtnStyle}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

const containerStyle = {
  position: "fixed",
  right: 16,
  top: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  zIndex: 9999,
};
const toastStyle = {
  background: "rgba(20,20,20,0.9)",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 8,
  minWidth: 200,
  boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
  position: "relative",
};
const toastErrorStyle = {
  borderLeft: "4px solid #ff6b6b",
};
const closeBtnStyle = {
  position: "absolute",
  right: 8,
  top: 4,
  border: "none",
  background: "transparent",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
};

export default ToastProvider;
