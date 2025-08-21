import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPage } from '@/lib/ga';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('cookie-consent-v1') === 'granted') {
      trackPage(location.pathname, document.title);
    }
  }, [location]);

  return null;
}
