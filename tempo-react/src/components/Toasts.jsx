import { useEffect, useState } from 'react';

export default function Toasts() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    function onToast(e) {
      const t = e.detail;
      setItems(prev => [...prev, t]);
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== t.id));
      }, t.duration || 2500);
    }
    window.addEventListener('tempo:toast', onToast);
    return () => window.removeEventListener('tempo:toast', onToast);
  }, []);

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
}
