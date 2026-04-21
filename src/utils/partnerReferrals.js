import { supabaseClient } from '@/config/supabaseClient';
import { hasConsent } from '@/utils/consent';

const REFERRAL_SESSION_KEY = 'fes_referral_session';

const referralFallbacks = {
  n26: 'https://n26.com/r/michaela0976?cid=0JY&lang=en',
  'trade-republic': 'https://refnocode.trade.re/9zj7jgwp',
};

const getConsentedReferralSessionId = () => {
  if (!hasConsent('analytics') && !hasConsent('marketing')) return null;

  try {
    const existing = window.sessionStorage.getItem(REFERRAL_SESSION_KEY);
    if (existing) return existing;

    const next = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem(REFERRAL_SESSION_KEY, next);
    return next;
  } catch {
    return null;
  }
};

const openReferralUrl = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const trackAndOpen = async (partnerSlug, sourcePage) => {
  const sessionId = getConsentedReferralSessionId();

  try {
    const body = {
      partner_slug: partnerSlug,
      source_page: sourcePage,
    };

    if (sessionId) {
      body.session_id = sessionId;
    }

    const { data, error } = await supabaseClient.functions.invoke('track-referral-click', { body });
    if (error) throw error;

    if (data?.url) {
      openReferralUrl(data.url);
      return { success: true };
    }
  } catch (error) {
    console.error('Referral tracking failed:', error);
  }

  const fallbackUrl = referralFallbacks[partnerSlug];
  if (fallbackUrl) {
    openReferralUrl(fallbackUrl);
    return { success: true, fallback: true };
  }

  return { success: false };
};

export const CHECKLIST_PARTNER_TRIGGERS = {
  'german bank account': 'n26',
  'bank account': 'n26',
  banking: 'n26',
  girokonto: 'n26',
  iban: 'n26',
  n26: 'n26',
  invest: 'trade-republic',
  investing: 'trade-republic',
  etf: 'trade-republic',
  'trade republic': 'trade-republic',
};

export const findChecklistPartnerSlug = (item) => {
  const haystack = `${item.title} ${item.description} ${item.category}`.toLowerCase();
  const trigger = Object.keys(CHECKLIST_PARTNER_TRIGGERS).find((term) => haystack.includes(term));
  return trigger ? CHECKLIST_PARTNER_TRIGGERS[trigger] : null;
};

export const findPartnerSlugsForText = (value) => {
  const haystack = String(value || '').toLowerCase();
  return [...new Set(
    Object.entries(CHECKLIST_PARTNER_TRIGGERS)
      .filter(([term]) => haystack.includes(term))
      .map(([, slug]) => slug)
  )];
};

export const partnerCategoriesForDirectory = (category) => {
  if (!category) return [];
  const haystack = `${category.id || ''} ${category.slug || ''} ${category.title || ''}`.toLowerCase();

  if (haystack.includes('banking') || haystack.includes('financial')) {
    return ['banking', 'investing'];
  }

  return [];
};
