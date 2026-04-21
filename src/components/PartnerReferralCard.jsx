import React, { useState } from 'react';
import { ExternalLink } from '@/lib/icons';
import { trackAndOpen } from '@/utils/partnerReferrals';

const PartnerReferralCard = ({ partner, sourcePage = '/partners' }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await trackAndOpen(partner.slug, sourcePage);
    setLoading(false);
  };

  return (
    <article className="flex h-full flex-col gap-4 rounded-lg border border-[#dbe1d8] bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border text-sm font-black"
          style={{
            backgroundColor: `${partner.logo_color || '#0f766e'}18`,
            borderColor: `${partner.logo_color || '#0f766e'}30`,
            color: partner.logo_color || '#0f766e',
          }}
        >
          {partner.logo_initials || partner.name?.slice(0, 2) || 'P'}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black text-[#0f172a]">{partner.name}</h2>
          {partner.tagline && <p className="mt-1 text-sm text-[#64748b]">{partner.tagline}</p>}
        </div>
        {partner.category && (
          <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#475569]">
            {partner.category}
          </span>
        )}
      </div>

      {partner.description && (
        <p className="text-sm leading-relaxed text-[#475569]">{partner.description}</p>
      )}

      {partner.bonus_text && (
        <div className="rounded-lg border border-[#b7eadb] bg-[#e1f5ee] p-3">
          <p className="text-sm font-semibold leading-relaxed text-[#0f6e56]">{partner.bonus_text}</p>
        </div>
      )}

      {partner.referral_code && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-[#cbd5e1] px-3 py-2">
          <span className="text-xs font-semibold text-[#64748b]">Referral code</span>
          <code className="text-sm font-black tracking-wide text-[#0f172a]">{partner.referral_code}</code>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
        style={{ backgroundColor: partner.logo_color || '#0f766e' }}
      >
        {loading ? 'Opening...' : `Open ${partner.name}`}
        {!loading && <ExternalLink className="h-4 w-4" />}
      </button>

      <p className="text-center text-xs leading-relaxed text-[#64748b]">
        Affiliate link. We may earn a reward if you sign up, at no extra cost to you.
      </p>
    </article>
  );
};

export default PartnerReferralCard;
