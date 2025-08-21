const GA_ID = 'G-J1Q1DZ40PB';

export function updateConsent(granted: boolean) {
  const gtag = (window as any).gtag;
  if (!gtag) return;

  gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    functionality_storage: granted ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    security_storage: 'granted',
  });

  if (granted) {
    gtag('config', GA_ID, { anonymize_ip: true });
    gtag('event', 'page_view', {
      page_path: window.location.pathname,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
}

export function trackPage(path: string, title?: string) {
  const gtag = (window as any).gtag;
  if (!gtag) return;
  gtag('event', 'page_view', {
    page_path: path,
    page_title: title ?? document.title,
    page_location: window.location.href,
  });
}
