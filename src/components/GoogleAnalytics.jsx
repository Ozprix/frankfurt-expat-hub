import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { hasConsent } from '@/utils/consent';

// A GA4 measurement ID is a public browser identifier. Keeping an environment
// override lets production use a different property without changing source.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-1V4T4RGBME';
const SCRIPT_ID = 'google-analytics-script';

const removeAnalyticsCookies = () => {
  const expires = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  const domain = window.location.hostname;
  const names = ['_ga', `_ga_${MEASUREMENT_ID.replace('G-', '')}`];
  const domains = ['', `; domain=${domain}`, `; domain=.${domain}`];
  names.forEach((name) => domains.forEach((scope) => {
    document.cookie = `${name}=; ${expires}; path=/${scope}`;
  }));
};

const GoogleAnalytics = () => {
  const { pathname, search } = useLocation();
  const [enabled, setEnabled] = useState(() => hasConsent('analytics'));

  useEffect(() => {
    const updateConsent = (event) => {
      const allowed = Boolean(event.detail?.analytics);
      setEnabled(allowed);
      window[`ga-disable-${MEASUREMENT_ID}`] = !allowed;
      if (!allowed) removeAnalyticsCookies();
    };

    window.addEventListener('fes:consent-updated', updateConsent);
    return () => window.removeEventListener('fes:consent-updated', updateConsent);
  }, []);

  useEffect(() => {
    if (!enabled || !MEASUREMENT_ID) return undefined;

    window[`ga-disable-${MEASUREMENT_ID}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, { send_page_view: false });

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
      document.head.appendChild(script);
    }

    return undefined;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !window.gtag) return;
    window.gtag('event', 'page_view', {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      send_to: MEASUREMENT_ID,
    });
  }, [enabled, pathname, search]);

  return null;
};

export default GoogleAnalytics;
