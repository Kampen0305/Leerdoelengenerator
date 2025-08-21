import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './pages/index.tsx';
import About from './pages/About.tsx';
import Layout from './components/Layout.tsx';
import './index.css';

function loadGA(measurementId: string) {
  // 1) load gtag.js
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(s);

  // 2) dataLayer + gtag helper
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;

  // 3) Consent Mode v2 - default denied
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
  });

  // 4) basic config (no page_view yet!)
  gtag('js', new Date());
  gtag('config', measurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });
}

if (import.meta.env.PROD && import.meta.env.VITE_GA_ID) {
  loadGA(import.meta.env.VITE_GA_ID);
}

const rootElement = document.getElementById('root')!;

function Router() {
  const path = window.location.pathname;
  const Page = path === '/over' ? About : HomePage;
  return (
    <Layout>
      <Page />
    </Layout>
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
