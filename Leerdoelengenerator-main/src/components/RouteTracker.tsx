import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { sendPageView } from '@/lib/ga';

const DIGITED_SUFFIX = /\s*\|?\s*DigitEd\s*$/i;
const DEFAULT_TITLE = 'AI Leerdoelenmaker';

export default function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const currentTitle = document.title;
    const sanitizedTitle = currentTitle.replace(DIGITED_SUFFIX, '').trim() || DEFAULT_TITLE;

    if (sanitizedTitle !== currentTitle) {
      document.title = sanitizedTitle;
    }

    // Consent-status bepaalt vanzelf of dit cookieless of enhanced is
    sendPageView(location.pathname, sanitizedTitle);
  }, [location]);

  return null;
}
