import React from 'react';
import { BadgeCheck } from '@/lib/icons';

const SponsoredDisclosure = ({
	  compact = false,
	  label = 'Directory ranking note',
  children = 'Listings are editorial unless clearly labelled otherwise. Paid placements, affiliate links, sponsored recommendations, or advertisements must be clearly labelled as Sponsored, Advertisement, or Affiliate before users click.',
}) => (
  <div className={`rounded-lg border border-[#dbe1d8] bg-white ${compact ? 'p-3' : 'p-4'}`}>
    <div className="flex gap-3">
      <BadgeCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0f766e]" />
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">{label}</p>
        <p className="mt-1 text-xs leading-relaxed text-[#64748b]">{children}</p>
      </div>
    </div>
  </div>
);

export default SponsoredDisclosure;
