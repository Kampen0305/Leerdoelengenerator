const GA_ID = 'G-J1Q1DZ40PB';

function g() {
  return (window as any).gtag as undefined | ((...args: any[]) => void);
}

export function initGA() {
  const gtag = g();
  if (!gtag) return;
  // Config zonder automatische page_view; we sturen zelf events.
  gtag('config', GA_ID, {
    anonymize_ip: true,
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/** Minimale page_view: werkt ook bij denied consent (cookieless ping) */
export function sendMinimalPageView(path = window.location.pathname, title = document.title) {
  const gtag = g();
  if (!gtag) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
    // geen user_id/engagement params; GA respecteert consent = denied en gebruikt geen storage
    send_to: GA_ID,
  });
}

/** Volwaardige page_view na consent = granted */
export function sendEnhancedPageView(path = window.location.pathname, title = document.title) {
  const gtag = g();
  if (!gtag) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
    send_to: GA_ID,
  });
}

export function updateConsentGranted() {
  const gtag = g();
  if (!gtag) return;
  gtag('consent', 'update', {
    analytics_storage: 'granted',
    functionality_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    security_storage: 'granted',
  });
}

export function updateConsentDenied() {
  const gtag = g();
  if (!gtag) return;
  gtag('consent', 'update', {
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    security_storage: 'granted',
  });
}
