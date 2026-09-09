import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackConversionEvent } from '@/utils/conversionTracking';

const SESSION_PREFIX = 'fes_answer_cta_';

/**
 * Records a consent-gated arrival from a static Answer Library CTA.
 * Static answer pages pass source/topic metadata in the URL; tracking happens
 * only after the visitor reaches the React destination and has opted in.
 */
const AnswerAttributionTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('source') !== 'answer_library') return;

    const topic = params.get('topic');
    const cta = params.get('cta');
    if (!topic || !cta) return;

    const key = `${SESSION_PREFIX}${topic}_${cta}_${location.pathname}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, '1');
    } catch {
      // Continue without duplicate protection when session storage is unavailable.
    }

    trackConversionEvent('answer_library_cta_follow', {
      topic,
      cta,
      destination: location.pathname,
    });
  }, [location.pathname, location.search]);

  return null;
};

export default AnswerAttributionTracker;
