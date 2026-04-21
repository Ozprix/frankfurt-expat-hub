import React, { useEffect, useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import PartnerReferralCard from '@/components/PartnerReferralCard';
import { supabaseClient } from '@/config/supabaseClient';

const categoryLabel = (category = '') =>
  category
    .split('-')
    .join(' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const PartnersPage = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadPartners = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseClient
        .from('partner_referrals')
        .select('*')
        .eq('active', true)
        .order('display_order', { ascending: true });

      if (cancelled) return;

      if (fetchError) {
        console.error('Partner referrals fetch error:', fetchError);
        setError(fetchError);
        setPartners([]);
      } else {
        setPartners(data || []);
      }

      setLoading(false);
    };

    loadPartners();

    return () => {
      cancelled = true;
    };
  }, []);

  const groupedPartners = useMemo(() => {
    return partners.reduce((groups, partner) => {
      const category = partner.category || 'recommended';
      if (!groups[category]) groups[category] = [];
      groups[category].push(partner);
      return groups;
    }, {});
  }, [partners]);

  return (
    <>
      <SEOHead
        title="Recommended Partner Offers for Frankfurt Expats | Frankfurt Expat Services"
        description="Affiliate partner offers for Frankfurt newcomers, including banking and investing services that may provide user rewards."
        canonical="/partners"
      />

      <main className="bg-[#f3f4ef] px-4 py-14 text-[#0f172a] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <section className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Recommended Partners</p>
            <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
              Useful offers for Frankfurt newcomers
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              These partner links may provide a user reward and may also earn Frankfurt Expat Services
              a referral reward. We label them clearly before you click.
            </p>
          </section>

          {loading ? (
            <div className="mt-10 rounded-lg border border-[#dbe1d8] bg-white p-8 text-center text-sm font-semibold text-[#64748b]">
              Loading partner offers...
            </div>
          ) : error ? (
            <div className="mt-10 rounded-lg border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-700">
              Partner offers are unavailable right now.
            </div>
          ) : partners.length === 0 ? (
            <div className="mt-10 rounded-lg border border-[#dbe1d8] bg-white p-8 text-center text-sm font-semibold text-[#64748b]">
              No partner offers are active yet.
            </div>
          ) : (
            <div className="mt-10 space-y-10">
              {Object.entries(groupedPartners).map(([category, categoryPartners]) => (
                <section key={category}>
                  <h2 className="text-xs font-black uppercase tracking-[0.18em] text-[#64748b]">
                    {categoryLabel(category)}
                  </h2>
                  <div className="mt-4 grid gap-5 md:grid-cols-2">
                    {categoryPartners.map((partner) => (
                      <PartnerReferralCard key={partner.slug} partner={partner} sourcePage="/partners" />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          <section className="mt-12 rounded-lg border border-[#dbe1d8] bg-white p-6">
            <h2 className="text-lg font-black text-[#0f172a]">Affiliate disclosure</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#475569]">
              Some links on this page are affiliate or referral links. If you open an account through them,
              we may receive a reward from the partner. This does not change the price you pay and does not
              replace your own decision-making. Non-essential referral session tracking is only stored after
              the relevant cookie consent choice.
            </p>
          </section>
        </div>
      </main>
    </>
  );
};

export default PartnersPage;
