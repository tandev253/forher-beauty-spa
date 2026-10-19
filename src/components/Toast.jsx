import React from 'react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <aside className="corp-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="corp-toast-item">
          <span className="corp-toast-icon">{toast.icon || '✨'}</span>
          <span className="corp-toast-message">{toast.message}</span>
          {onDismiss && (
            <button 
              type="button" 
              className="corp-toast-close" 
              onClick={() => onDismiss(toast.id)}
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          )}
        </div>
      ))}
    </aside>
  );
}
