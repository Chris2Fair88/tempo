import { memo, useEffect, useState, useCallback } from 'react';

/**
 * Toasts Component - Phase 3 Performance Optimized
 * Memoized with optimized callbacks to prevent unnecessary re-renders
 */
const Toasts = memo(function Toasts() {
  const [items, setItems] = useState([]);

  // Memoized callback to prevent useEffect re-creation
  const onToast = useCallback((e) => {
    const t = e.detail;
    setItems(prev => [...prev, t]);
    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== t.id));
    }, t.duration || 2500);
  }, []);

  useEffect(() => {
    window.addEventListener('tempo:toast', onToast);
    return () => window.removeEventListener('tempo:toast', onToast);
  }, [onToast]);

  if (items.length === 0) return null;

  return (
    <div className="toasts">
      {items.map(t => (
        <div key={t.id} role="status" aria-live="polite" className={`toast ${t.variant === 'error' ? 'toast--error' : 'toast--success'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
});

export default Toasts;
