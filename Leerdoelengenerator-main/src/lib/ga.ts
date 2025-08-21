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

/** Stuur een page_view (cookieless als consent denied is) */
export async function sendPageView(
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

/** Consent → granted (analytics + functionality) */
export async function setConsentGranted() {
  await gtagReady();
  const gtag = g();
  if (!gtag) return;

  gtag('consent', 'update', {
    analytics_storage: 'granted',
    functionality_storage: 'granted',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    security_storage: 'granted'
  });
}

/** Consent → denied */
export async function setConsentDenied() {
  await gtagReady();
  const gtag = g();
  if (!gtag) return;

  gtag('consent', 'update', {
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    security_storage: 'granted'
  });
}
