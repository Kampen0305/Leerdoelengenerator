// src/components/RouteTracker.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendMinimalPageView, sendEnhancedPageView } from '@/lib/ga';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent-v1');
    if (consent === 'granted') {
      sendEnhancedPageView(location.pathname, document.title);
    } else {
      sendMinimalPageView(location.pathname, document.title);
    }
  }, [location]);

  return null;
}
