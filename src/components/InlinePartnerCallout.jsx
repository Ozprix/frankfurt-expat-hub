import React, { useState } from 'react';
import { ExternalLink } from '@/lib/icons';
import { trackAndOpen } from '@/utils/partnerReferrals';

const InlinePartnerCallout = ({ partner, sourcePage }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await trackAndOpen(partner.slug, sourcePage);
    setLoading(false);
  };

  return (
    <div className="mt-4 rounded-lg border border-[#dbe1d8] bg-[#f8faf8] p-4" style={{ borderLeftColor: partner.logo_color || '#0f766e', borderLeftWidth: 4 }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#64748b]">Affiliate partner</p>
          <p className="mt-1 text-sm font-black text-[#0f172a]">Consider {partner.name}</p>
          {partner.bonus_text && (
            <p className="mt-1 text-xs leading-relaxed text-[#475569]">{partner.bonus_text}</p>
          )}
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="inline-flex flex-shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
          style={{ backgroundColor: partner.logo_color || '#0f766e' }}
        >
          {loading ? 'Opening...' : `Open ${partner.name}`}
          {!loading && <ExternalLink className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default InlinePartnerCallout;
