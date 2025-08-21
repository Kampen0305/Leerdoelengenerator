// src/lib/ga.ts
const GA_ID = 'G-J1Q1DZ40PB';

function g() {
  return (window as any).gtag as undefined | ((...args: any[]) => void);
}

async function gtagReady(timeoutMs = 5000) {
  const start = performance.now();
  while (performance.now() - start < timeoutMs) {
    if (typeof g() === 'function') return;
    await new Promise(r => setTimeout(r, 50));
  }
}

/** Initialiseer GA4 config zonder automatische page_view */
export async function initGA() {
  await gtagReady();
  const gtag = g();
  if (!gtag) return;

  gtag('config', GA_ID, {
    anonymize_ip: true,
    send_page_view: false,              // wij sturen page_views zelf (minimaal/enhanced)
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

/** Minimale page_view – werkt ook bij consent = denied (cookieless ping) */
export async function sendMinimalPageView(
  path = window.location.pathname,
  title = document.title
) {
  await gtagReady();
  const gtag = g();
  if (!gtag) return;

  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
    send_to: GA_ID,
  });
}

/** Volwaardige page_view – gebruiken na consent = granted */
export async function sendEnhancedPageView(
  path = window.location.pathname,
  title = document.title
) {
  await gtagReady();
  const gtag = g();
  if (!gtag) return;

  gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
    send_to: GA_ID,
  });
}

/** Consent → granted (alleen analytics/functionality; ads blijven uit) */
export async function updateConsentGranted() {
  await gtagReady();
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

/** Consent → denied */
export async function updateConsentDenied() {
  await gtagReady();
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
