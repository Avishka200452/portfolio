'use client';
import { useState, useEffect } from 'react';

let _addToast = null;
export function toast(msg, type = 'info') {
  if (_addToast) _addToast({ msg, type, id: Date.now() });
}

export default function ToastProvider() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    _addToast = (t) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500);
    };
  }, []);

  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}
