export const CONSENT_KEY = 'fes_cookie_consent';

export const getStoredConsent = () => {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const hasConsent = (purpose) => {
  const consent = getStoredConsent();
  return Boolean(consent?.[purpose]);
};
