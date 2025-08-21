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
    initGA();

    const saved = localStorage.getItem(KEY);
    if (!saved) {
      setOpen(true);
      // Stuur altijd een minimale page_view bij eerste bezoek (cookieless)
      sendMinimalPageView();
    } else if (saved === 'granted') {
      updateConsentGranted();
      sendEnhancedPageView();
    } else {
      updateConsentDenied();
      sendMinimalPageView();
    }
  }, []);

  const grant = () => {
    localStorage.setItem(KEY, 'granted');
    updateConsentGranted();
    setOpen(false);
    // Stuur meteen een enhanced page_view na akkoord
    sendEnhancedPageView();
  };

  const deny = () => {
    localStorage.setItem(KEY, 'denied');
    updateConsentDenied();
    setOpen(false);
    // Eventueel nog een minimale page_view (blijft cookieless)
    sendMinimalPageView();
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 'auto 16px 16px 16px',
      background: '#111', color: '#fff', padding: '12px 16px',
      borderRadius: 8, zIndex: 9999, display: 'flex', gap: 8, alignItems: 'center'
    }}>
      <div style={{ flex: 1 }}>
        We gebruiken cookies voor analytics. Akkoord voor volledige meting?
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
