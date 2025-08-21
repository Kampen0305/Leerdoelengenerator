import { useEffect, useState } from 'react';
import { updateConsent } from '@/lib/ga';

const KEY = 'cookie-consent-v1';

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) {
      setOpen(true);
    } else {
      updateConsent(saved === 'granted');
    }
  }, []);

  const grant = () => {
    localStorage.setItem(KEY, 'granted');
    updateConsent(true);
    setOpen(false);
  };

  const deny = () => {
    localStorage.setItem(KEY, 'denied');
    updateConsent(false);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        left: 16,
        right: 16,
        background: '#111',
        color: '#fff',
        padding: 16,
        borderRadius: 8,
      }}
    >
      <span>We gebruiken cookies voor anonieme analytics. Akkoord?</span>
      <button onClick={deny} style={{ marginLeft: 8 }}>
        Weigeren
      </button>
      <button onClick={grant} style={{ marginLeft: 8 }}>
        Akkoord
      </button>
    </div>
  );
}

