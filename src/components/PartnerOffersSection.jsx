import React from 'react';
import PartnerReferralCard from '@/components/PartnerReferralCard';

const PartnerOffersSection = ({ partners = [], sourcePage, title = 'Relevant partner offers', compact = false }) => {
  if (!partners.length) return null;

  return (
    <section className={compact ? 'mt-8' : 'mt-10'}>
      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">Affiliate Partner Offers</p>
        <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-black text-[#0f172a]`}>{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
          These offers may provide a user reward and may also earn Frankfurt Expat Services a referral reward.
        </p>
      </div>
      <div className={`grid gap-5 ${compact ? 'sm:grid-cols-1' : 'md:grid-cols-2'}`}>
        {partners.map((partner) => (
          <PartnerReferralCard key={partner.slug} partner={partner} sourcePage={sourcePage} />
        ))}
      </div>
    </section>
  );
};

export default PartnerOffersSection;
