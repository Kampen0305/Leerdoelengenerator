import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendPageView } from '@/lib/ga';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Consent-status bepaalt vanzelf of dit cookieless of enhanced is
    sendPageView(location.pathname, document.title);
  }, [location]);

  return null;
}
