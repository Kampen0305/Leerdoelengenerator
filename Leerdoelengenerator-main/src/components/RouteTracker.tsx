import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPage } from '@/lib/ga';

const KEY = 'cookie-consent-v1';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem(KEY) === 'granted') {
      trackPage(location.pathname);
    }
  }, [location]);

  return null;
}

