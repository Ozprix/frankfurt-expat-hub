import React, { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import {
  Banknote,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  FileCheck,
  Globe,
  Handshake,
  Heart,
  Home,
  Search,
  ShieldCheck,
  Star,
  Users,
} from '@/lib/icons';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import SponsoredDisclosure from '@/components/SponsoredDisclosure';
import scrapedDirectory from '@/data/scraped/directory.json';
import { directoryCategories } from '@/data/directoryCategories';
import { trackConversionEvent } from '@/utils/conversionTracking';
import { supabaseClient } from '@/config/supabaseClient';
import PartnerOffersSection from '@/components/PartnerOffersSection';
import { partnerCategoriesForDirectory } from '@/utils/partnerReferrals';

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const categoryIcons = {
  tax: FileCheck,
  housing: Home,
  banking: Banknote,
  legal: BriefcaseBusiness,
  insurance: ShieldCheck,
  healthcare: Heart,
};

// Merge icon into directoryCategories data — single source of truth for content
const categories = directoryCategories.map((cat) => ({
  ...cat,
  icon: categoryIcons[cat.id] || FileCheck,
  statusColor: cat.color,
}));

const vettingSteps = [
  {
    icon: Globe,
    title: 'Language Screening',
    desc: 'We verify each partner can hold consultations and produce documents in English.',
  },
  {
    icon: Star,
    title: 'Reputation Check',
    desc: 'References from at least three expat clients and confirmation of professional credentials.',
  },
  {
    icon: Users,
    title: 'Responsiveness Test',
    desc: 'Initial enquiries must be answered within 24 business hours — a key pain point for newcomers.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparency Review',
    desc: 'Clear, upfront pricing or an honest "first call free" offer before engagement.',
  },
];

const directoryPartners = Array.isArray(scrapedDirectory)
  ? scrapedDirectory.filter((partner) => partner.name && partner.category)
  : [];

const categoryMatchesPartner = (category, partner) =>
  partner.category?.toLowerCase() === category.title.toLowerCase();

/* ─── CATEGORY CARD ────────────────────────────────────────────────────────── */
const CategoryCard = ({ cat, active, partnerCount, onSelect }) => {
  const [open, setOpen] = useState(false);
  const { icon: Icon, color, statusColor } = cat;

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        active ? 'border-[#0f766e] ring-2 ring-[#99f6e4]' : 'border-[#dbe1d8]'
      }`}
    >
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className={`rounded-xl p-3 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusColor}`}>
            {cat.status}
          </span>
        </div>

        <h3 className="text-lg font-black text-[#0f172a]">{cat.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">{cat.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSelect}
            className="rounded-lg bg-[#0f766e] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#115e59]"
          >
            {active ? 'Showing providers' : `View ${partnerCount} provider${partnerCount === 1 ? '' : 's'}`}
          </button>
          <button
            type="button"
            onClick={() => setOpen((p) => !p)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0f766e] transition hover:text-[#115e59]"
          >
            {open ? 'Hide details' : "See what's covered"}
            {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {open && (
          <ul className="mt-4 space-y-2 border-t border-[#e2e8f0] pt-4">
            {cat.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[#334155]">
                <Check className="h-3.5 w-3.5 flex-shrink-0 text-[#0f766e]" />
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-[#e2e8f0] bg-[#f8faf8] px-6 py-3">
        <p className="text-xs font-bold text-[#64748b]">{cat.count}</p>
        {cat.slug && (
          <Link
            to={`/directory/${cat.slug}`}
            className="flex items-center gap-1 text-xs font-bold text-[#0f766e] hover:text-[#115e59]"
          >
            Full guide <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </article>
  );
};

const PartnerCard = ({ partner }) => {
  const services = Array.isArray(partner.services) ? partner.services.filter(Boolean).slice(0, 4) : [];
  const languages = Array.isArray(partner.languages) ? partner.languages.filter(Boolean).slice(0, 3) : [];

  return (
    <article className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">
          {partner.category || 'Directory Lead'}
        </p>
        <h3 className="mt-2 text-lg font-black text-[#0f172a]">{partner.name || 'Unnamed service'}</h3>
      </div>

      {partner.summary && (
        <p className="mt-3 text-sm leading-relaxed text-[#475569]">{partner.summary}</p>
      )}

      {services.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {services.map((service) => (
            <li key={service} className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-semibold text-[#334155]">
              {service}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 grid gap-2 text-xs text-[#64748b] sm:grid-cols-2">
        {partner.location && <p><span className="font-bold text-[#334155]">Area:</span> {partner.location}</p>}
        {languages.length > 0 && <p><span className="font-bold text-[#334155]">Languages:</span> {languages.join(', ')}</p>}
        {partner.pricing && <p><span className="font-bold text-[#334155]">Pricing:</span> {partner.pricing}</p>}
        {partner.contact && <p><span className="font-bold text-[#334155]">Contact:</span> {partner.contact}</p>}
      </div>

      {(partner.sponsored || partner.placement === 'sponsored') && (
        <div className="mt-5">
          <SponsoredDisclosure compact label="Sponsored">
            This provider has a paid placement. The label is shown separately from our directory notes.
          </SponsoredDisclosure>
        </div>
      )}

      {partner.url && (
        <div className="mt-5 border-t border-[#e2e8f0] pt-4">
          <a
            href={partner.url}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackConversionEvent('directory_partner_click', {
              source: 'directory_page',
              partner_name: partner.name,
              partner_category: partner.category,
              partner_url: partner.url,
            })}
            className="inline-flex items-center justify-center rounded-lg bg-[#0f766e] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#115e59]"
          >
            Visit Website
          </a>
        </div>
      )}
    </article>
  );
};

const PartnerDirectorySection = ({ partners, selectedCategory, referralPartners, onClear }) => {
  return (
    <section id="directory-results" className="border-y border-[#d7ddd3] bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Directory Results</p>
            <h2 className="mt-2 text-3xl font-black text-[#0f172a]">
              {selectedCategory ? selectedCategory.title : 'English-speaking services for Frankfurt expats'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#475569]">
              Browse providers that support international residents with practical relocation, finance,
              housing, legal, health, and everyday setup needs.
            </p>
          </div>
          {selectedCategory && (
            <button
              type="button"
              onClick={onClear}
              className="w-fit rounded-lg border border-[#dbe1d8] bg-white px-4 py-2 text-xs font-bold text-[#0f172a] transition hover:bg-[#f8faf8]"
            >
              Show all providers
            </button>
          )}
        </div>

        {partners.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-8 text-center">
            <Building2 className="mx-auto mb-4 h-10 w-10 text-[#94a3b8]" />
            <p className="text-sm font-bold text-[#334155]">No providers are listed for this filter yet.</p>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-[#64748b]">
              This category is still being curated. Use the listing form below if you know a qualified
              English-speaking provider serving Frankfurt expats.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {partners.map((partner) => (
              <PartnerCard key={`${partner.url}-${partner.name}`} partner={partner} />
            ))}
          </div>
        )}

        <PartnerOffersSection
          partners={referralPartners}
          sourcePage={selectedCategory ? `/directory?category=${selectedCategory.id}` : '/directory'}
          title={selectedCategory ? `Partner offers for ${selectedCategory.title}` : 'Partner offers'}
        />
      </div>
    </section>
  );
};

/* ─── MAIN PAGE ────────────────────────────────────────────────────────────── */
const DirectoryPage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [referralPartners, setReferralPartners] = useState([]);
  const resultsRef = useRef(null);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === selectedCategoryId) || null,
    [selectedCategoryId],
  );

  const filtered = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()),
  );

  const getPartnerCount = (category) =>
    directoryPartners.filter((partner) => categoryMatchesPartner(category, partner)).length;

  const handleCategorySelect = (category) => {
    setSelectedCategoryId(category.id);
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const filteredPartners = directoryPartners.filter((partner) => {
    const q = search.toLowerCase();
    const matchesSelectedCategory = !selectedCategory || categoryMatchesPartner(selectedCategory, partner);
    return (
      matchesSelectedCategory &&
      (!q ||
      [partner.name, partner.category, partner.summary, partner.location, ...(partner.services || [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(q)))
    );
  });

  React.useEffect(() => {
    let cancelled = false;

    const loadReferralPartners = async () => {
      const partnerCategories = selectedCategory
        ? partnerCategoriesForDirectory(selectedCategory)
        : ['banking', 'investing'];

      if (!partnerCategories.length) {
        setReferralPartners([]);
        return;
      }

      const { data, error } = await supabaseClient
        .from('partner_referrals')
        .select('*')
        .eq('active', true)
        .in('category', partnerCategories)
        .order('display_order', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('Directory referral partner fetch error:', error);
        setReferralPartners([]);
      } else {
        setReferralPartners(data || []);
      }
    };

    loadReferralPartners();

    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  return (
    <>
      <SEOHead
        title="English-Speaking Service Directory Frankfurt | Frankfurt Expat Services"
        description="Find vetted English-speaking tax consultants, housing agents, financial advisors, and relocation experts serving expats in Frankfurt, Germany."
        canonical="/directory"
      />

      <div className="bg-[#f3f4ef] text-[#0f172a]">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="px-4 pb-12 pt-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Service Directory</p>
                <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl">
                  Vetted English-speaking experts for Frankfurt newcomers.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-[#475569]">
                  Every partner in our directory is screened for language proficiency, professional credentials,
                  clear service information, and fast response times — so you can skip the guesswork.
                </p>
                <div className="mt-6 max-w-2xl">
                  <SponsoredDisclosure />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 sm:max-w-sm">
                  {[['6', 'Service Categories'], ['<24h', 'Response Target'], ['Free', 'To Browse']].map(([v, l]) => (
                    <div key={l} className="rounded-xl border border-[#dbe1d8] bg-white p-4 text-center">
                      <p className="text-xl font-black text-[#0f172a]">{v}</p>
                      <p className="mt-0.5 text-xs font-semibold text-[#64748b]">{l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-[#ecfdf5] p-3 text-[#0f766e]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-black text-[#0f172a]">Our vetting commitment</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">
                      Partners are reviewed for English proficiency, professional credentials, transparent
                      clear service information, and proven responsiveness to expat clients. We re-evaluate annually.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Search + Categories ───────────────────────────────────────────── */}
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories…"
                className="w-full rounded-xl border border-[#dbe1d8] bg-white py-2.5 pl-10 pr-4 text-sm outline-none ring-[#0f766e] focus:ring-2"
              />
            </div>

            {/* Cards */}
            {filtered.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    cat={cat}
                    active={selectedCategoryId === cat.id}
                    partnerCount={getPartnerCount(cat)}
                    onSelect={() => handleCategorySelect(cat)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-[#cbd5e1]" />
                <p className="text-sm font-semibold text-[#64748b]">No categories match "{search}"</p>
              </div>
            )}
          </div>
        </section>

        <div ref={resultsRef}>
          <PartnerDirectorySection
            partners={filteredPartners}
            selectedCategory={selectedCategory}
            referralPartners={referralPartners}
            onClear={() => setSelectedCategoryId('')}
          />
        </div>

        {/* ── Vetting Process ───────────────────────────────────────────────── */}
        <section className="border-y border-[#d7ddd3] bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">How We Vet</p>
              <h2 className="mt-2 text-3xl font-black text-[#0f172a]">What every partner goes through</h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-[#475569]">
                We do the due diligence so you don't have to. Partners who don't meet the standard are not listed.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {vettingSteps.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0f766e] text-xs font-black text-white">
                      {i + 1}
                    </span>
                    <div className="rounded-lg bg-[#ecfdf5] p-2 text-[#0f766e]">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="font-black text-[#0f172a]">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#475569]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Apply to list ─────────────────────────────────────────────────── */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div className="rounded-2xl border border-[#dbe1d8] bg-white p-7 shadow-sm">
                <div className="rounded-xl bg-[#fff7ed] p-3 text-[#c2410c] w-fit">
                  <Handshake className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-2xl font-black text-[#0f172a]">Apply for Directory Placement</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  Are you an English-speaking professional serving Frankfurt's expat community? Apply to
                  join our vetted directory. Early partners receive featured placement while the first
                  cohorts are curated.
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    'Discovery call arranged within 2 business days',
                    'Featured placement for early partners',
                    'Newsletter spotlight opportunities',
                    'Annual re-verification to maintain trust signal',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#334155]">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0f766e]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <LeadCaptureForm
                intent="directory-listing"
                title="List Your Expat Service"
                description="Share your details and we'll arrange a discovery call if there's a fit."
                submitLabel="Apply To List"
                showCompany
                showCategory
                messageLabel="Service Details"
                messagePlaceholder="Describe your Frankfurt expat services, languages supported, pricing model, and ideal client profile."
              />
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default DirectoryPage;
