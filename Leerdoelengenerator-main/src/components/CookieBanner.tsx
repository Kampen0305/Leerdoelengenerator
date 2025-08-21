// src/components/CookieBanner.tsx
import { useEffect, useState } from 'react';
import {
  initGA,
  sendMinimalPageView,
  sendEnhancedPageView,
  updateConsentGranted,
  updateConsentDenied,
} from '@/lib/ga';

const KEY = 'cookie-consent-v1';

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Init GA-config
    initGA();

    const saved = localStorage.getItem(KEY);
    if (!saved) {
      setOpen(true);
      // Altijd minimale page_view op eerste bezoek (cookieless)
      sendMinimalPageView();
    } else if (saved === 'granted') {
      updateConsentGranted().then(() => sendEnhancedPageView());
    } else {
      updateConsentDenied().then(() => sendMinimalPageView());
    }
  }, []);

  const grant = async () => {
    localStorage.setItem(KEY, 'granted');
    await updateConsentGranted();
    setOpen(false);
    // Direct enhanced page_view na akkoord
    await sendEnhancedPageView();
  };

  const deny = async () => {
    localStorage.setItem(KEY, 'denied');
    await updateConsentDenied();
    setOpen(false);
    // Optioneel nogmaals minimal bevestigen
    await sendMinimalPageView();
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 'auto 16px 16px 16px',
      background: '#111', color: '#fff', padding: '12px 16px',
      borderRadius: 8, zIndex: 9999, display: 'flex', gap: 8, alignItems: 'center',
      boxShadow: '0 6px 32px rgba(0,0,0,.35)'
    }}>
      <div style={{ flex: 1 }}>
        We gebruiken cookies voor anonieme analytics. Akkoord voor volledige meting?
      </div>
      <button onClick={deny} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: 6, padding: '8px 12px' }}>
        Weigeren
      </button>
      <button onClick={grant} style={{ background: '#4ade80', color: '#111', border: 'none', borderRadius: 6, padding: '8px 12px', fontWeight: 600 }}>
        Akkoord
      </button>
    </div>
  );
}
