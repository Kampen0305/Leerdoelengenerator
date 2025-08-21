import { useEffect, useState } from 'react';
import { sendPageView, setConsentGranted, setConsentDenied } from '@/lib/ga';

const KEY = 'cookie-consent-v1';

export default function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);

    if (!saved) {
      // Eerste bezoek → toon banner en stuur een cookieless page_view
      setOpen(true);
      sendPageView(); // cookieless door consent=denied
    } else if (saved === 'granted') {
      setConsentGranted().then(() => sendPageView());
    } else {
      setConsentDenied().then(() => sendPageView()); // cookieless bevestiging
    }
  }, []);

  const grant = async () => {
    localStorage.setItem(KEY, 'granted');
    await setConsentGranted();
    setOpen(false);
    await sendPageView(); // enhanced page_view na akkoord
  };

  const deny = async () => {
    localStorage.setItem(KEY, 'denied');
    await setConsentDenied();
    setOpen(false);
    await sendPageView(); // blijft cookieless
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
