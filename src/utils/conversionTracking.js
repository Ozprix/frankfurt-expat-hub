import { supabaseClient } from '@/config/supabaseClient';
import { hasConsent } from '@/utils/consent';

const VISITOR_ID_KEY = 'fes_analytics_visitor_id';

const getVisitorId = () => {
  if (!hasConsent('analytics')) return null;

  try {
    const existing = window.localStorage.getItem(VISITOR_ID_KEY);
    if (existing) return existing;

    const next = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(VISITOR_ID_KEY, next);
    return next;
  } catch {
    return null;
  }
};

export const trackConversionEvent = async (eventName, metadata = {}, options = {}) => {
  if (!hasConsent('analytics')) return { skipped: true, reason: 'analytics_consent_missing' };

  const visitorId = getVisitorId();
  if (!visitorId) return { skipped: true, reason: 'visitor_id_unavailable' };

  try {
    const { error } = await supabaseClient.from('conversion_events').insert({
      event_name: eventName,
      visitor_id: visitorId,
      user_id: options.userId || null,
      page_path: window.location.pathname,
      metadata,
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Conversion tracking error:', error);
    return { success: false, error };
  }
};

export const clearAnalyticsVisitorId = () => {
  try {
    window.localStorage.removeItem(VISITOR_ID_KEY);
  } catch {
    // Ignore storage failures.
  }
};
