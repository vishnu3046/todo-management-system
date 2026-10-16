import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 size={18} className="toast-icon text-emerald" />,
    error: <AlertCircle size={18} className="toast-icon text-rose" />,
    info: <Info size={18} className="toast-icon text-blue" />,
  };

  return (
    <aside className="toast-container" aria-live="polite">
      <div className={`toast-card toast-${toast.type || 'info'}`}>
        <div className="toast-left">
          {iconMap[toast.type] || iconMap.info}
          <div className="toast-message">{toast.message}</div>
        </div>
        <button
          type="button"
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Close notification"
        >
          <X size={15} />
        </button>
      </div>
    </aside>
  );
}
