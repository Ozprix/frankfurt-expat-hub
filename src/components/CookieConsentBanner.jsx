import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ShieldCheck } from '@/lib/icons';
import { CONSENT_KEY } from '@/utils/consent';
import { clearAnalyticsVisitorId } from '@/utils/conversionTracking';

const consentOptions = {
  necessary: true,
  analytics: false,
  marketing: false,
  savedAt: '',
};

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(CONSENT_KEY));

    const openPreferences = () => setVisible(true);
    window.addEventListener('fes:open-consent', openPreferences);
    return () => window.removeEventListener('fes:open-consent', openPreferences);
  }, []);

  const saveConsent = (choices) => {
    if (!choices.analytics) {
      clearAnalyticsVisitorId();
    }

    localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({
        ...consentOptions,
        ...choices,
        savedAt: new Date().toISOString(),
      }),
    );
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dbe1d8] bg-white px-4 py-4 shadow-2xl sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#0f766e]">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-[#0f172a]">Privacy choices</p>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-[#475569]">
              We use necessary storage for core site functions and consent records. Analytics, ads,
              affiliate tracking, or other non-essential cookies stay off unless you allow them.
              See our{' '}
              <Link to="/privacy-policy" className="font-semibold text-[#0f766e] underline-offset-2 hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => saveConsent({ analytics: false, marketing: false })}
            className="rounded-lg border border-[#dbe1d8] bg-white px-4 py-2 text-sm font-bold text-[#0f172a] transition hover:bg-[#f8faf8]"
          >
            Necessary Only
          </button>
          <button
            type="button"
            onClick={() => saveConsent({ analytics: true, marketing: true })}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#115e59]"
          >
            <ShieldCheck className="h-4 w-4" />
            Allow Analytics & Ads
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
