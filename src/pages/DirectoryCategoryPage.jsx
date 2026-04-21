import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, ExternalLink, FileCheck } from '@/lib/icons';
import SEOHead from '@/components/SEOHead';
import { schemaFAQ, schemaBreadcrumb, schemaService } from '@/utils/structuredData';
import { getCategoryBySlug } from '@/data/directoryCategories';
import { trackConversionEvent } from '@/utils/conversionTracking';
import { supabaseClient } from '@/config/supabaseClient';
import PartnerOffersSection from '@/components/PartnerOffersSection';
import { partnerCategoriesForDirectory } from '@/utils/partnerReferrals';

/* ── Partner card (reused from DirectoryPage aesthetics) ─────────────────── */
const PartnerCard = ({ partner, categorySlug }) => (
  <article className="rounded-xl border border-[#dbe1d8] bg-white p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[#64748b]">{partner.category}</p>
        <h3 className="mt-1 text-lg font-black text-[#0f172a]">{partner.name}</h3>
        {partner.location && (
          <p className="mt-0.5 text-sm text-[#64748b]">{partner.location}</p>
        )}
      </div>
    </div>
    {partner.summary && (
      <p className="mt-3 text-sm leading-relaxed text-[#475569]">{partner.summary}</p>
    )}
    {partner.services && partner.services.length > 0 && (
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {partner.services.slice(0, 4).map((s) => (
          <li key={s} className="rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-xs font-medium text-[#334155]">
            {s}
          </li>
        ))}
      </ul>
    )}
    {partner.url && (
      <a
        href={partner.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackConversionEvent('directory_partner_click', {
          source: 'category_page',
          category_slug: categorySlug,
          partner_name: partner.name,
          partner_category: partner.category,
          partner_url: partner.url,
        })}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0f766e] hover:text-[#115e59]"
      >
        Visit website <ExternalLink className="h-3.5 w-3.5" />
      </a>
    )}
  </article>
);

/* ── FAQ accordion ───────────────────────────────────────────────────────── */
const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-[#e5e7eb] last:border-0">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 py-4 text-left"
      aria-expanded={isOpen}
    >
      <span className="text-sm font-bold text-[#0f172a]">{question}</span>
      <ChevronDown
        className={`h-4 w-4 shrink-0 text-[#64748b] transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && (
      <p className="pb-4 text-sm leading-relaxed text-[#475569]">{answer}</p>
    )}
  </div>
);

/* ── Main component ──────────────────────────────────────────────────────── */
const DirectoryCategoryPage = () => {
  const { categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  const [openFaq, setOpenFaq] = useState(0);
  const [referralPartners, setReferralPartners] = React.useState([]);

  // Import partner data lazily to avoid circular dependency
  const [partners, setPartners] = React.useState([]);
  React.useEffect(() => {
    import('@/data/scraped/directory.json')
      .then((mod) => {
        const all = Array.isArray(mod.default) ? mod.default : [];
        setPartners(
          all.filter(
            (p) => p.name && p.category?.toLowerCase() === category?.title?.toLowerCase()
          )
        );
      })
      .catch(() => setPartners([]));
  }, [category]);

  React.useEffect(() => {
    if (!category) return;
    let cancelled = false;
    const partnerCategories = partnerCategoriesForDirectory(category);

    if (!partnerCategories.length) {
      setReferralPartners([]);
      return;
    }

    const loadReferralPartners = async () => {
      const { data, error } = await supabaseClient
        .from('partner_referrals')
        .select('*')
        .eq('active', true)
        .in('category', partnerCategories)
        .order('display_order', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('Directory partner referral fetch error:', error);
        setReferralPartners([]);
      } else {
        setReferralPartners(data || []);
      }
    };

    loadReferralPartners();

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (!category) {
    return <Navigate to="/directory" replace />;
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Directory', path: '/directory' },
    { name: category.title, path: `/directory/${category.slug}` },
  ];

  return (
    <>
      <SEOHead
        title={category.pageTitle}
        description={category.metaDescription}
        canonical={`/directory/${category.slug}`}
      >
        <script type="application/ld+json">
          {JSON.stringify(schemaBreadcrumb(breadcrumbs))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(schemaService({
            name: category.title,
            description: category.metaDescription,
            path: `/directory/${category.slug}`,
          }))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(schemaFAQ(category.faqs))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${category.title} providers in Frankfurt`,
            description: category.metaDescription,
            url: `https://frankfurtexpatservices.com/directory/${category.slug}`,
            itemListElement: partners.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: p.url || `https://frankfurtexpatservices.com/directory/${category.slug}`,
            })),
          })}
        </script>
      </SEOHead>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="bg-[#f3f4ef] px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/directory"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
          >
            <ArrowLeft className="h-4 w-4" />
            All categories
          </Link>

          <div className="mt-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${category.color}`}>
              {category.status}
            </span>
            <h1 className="mt-4 text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl">
              {category.heading}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
              {category.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">

          {/* ── Main column ──────────────────────────────────────────────── */}
          <div>
            {/* About this category */}
            <section className="rounded-2xl border border-[#dbe1d8] bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-[#0f172a]">About this category</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">{category.longDescription}</p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {category.features.map((f) => (
                  <div key={f} className="flex items-start gap-2 rounded-lg bg-[#f8fafc] p-3">
                    <FileCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />
                    <span className="text-xs font-medium text-[#334155]">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Providers */}
            <section className="mt-8">
	              <h2 className="text-2xl font-black text-[#0f172a]">
	                {partners.length > 0
	                  ? `Listed providers (${partners.length})`
	                  : 'No providers listed yet'}
	              </h2>

              {partners.length > 0 ? (
                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  {partners.map((partner) => (
                    <PartnerCard key={`${partner.name}-${partner.url}`} partner={partner} categorySlug={category.slug} />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-[#dbe1d8] bg-white p-8 text-center">
                  <p className="text-sm font-semibold text-[#334155]">
                    We are currently onboarding qualified providers for this category.
                  </p>
                  <p className="mt-2 text-sm text-[#64748b]">
                    Know a great {category.title.toLowerCase()} provider serving Frankfurt expats?
                  </p>
                  <Link
                    to="/directory#apply"
                    className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-4 py-2 text-sm font-bold text-white hover:bg-[#115e59]"
                  >
                    Suggest a provider <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </section>

            <PartnerOffersSection
              partners={referralPartners}
              sourcePage={`/directory/${category.slug}`}
              title={`Partner offers for ${category.title}`}
            />

            {/* FAQ */}
            <section className="mt-10">
              <h2 className="text-2xl font-black text-[#0f172a]">Frequently asked questions</h2>
              <div className="mt-5 rounded-xl border border-[#dbe1d8] bg-white px-6">
                {category.faqs.map((faq, i) => (
                  <FAQItem
                    key={i}
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-5">
            {/* CTA */}
            <div className="rounded-xl bg-[#0c2622] p-6 text-white">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#5eead4]">Get Listed</p>
              <h3 className="mt-2 text-lg font-black">Serve Frankfurt expats?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
                Apply to be listed in the {category.title} category. We review for English proficiency, expat experience, and transparent pricing.
              </p>
              <Link
                to="/directory#apply"
                className="mt-4 block rounded-lg bg-[#0f766e] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-[#0d9488]"
              >
                Apply to the directory
              </Link>
            </div>

            {/* Related blog */}
            {category.relatedBlog && category.relatedBlog.length > 0 && (
              <div className="rounded-xl border border-[#dbe1d8] bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#64748b]">Related guides</p>
                <ul className="mt-3 space-y-2">
                  {category.relatedBlog.map((post) => (
                    <li key={post.slug}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex items-start gap-1.5 text-sm font-medium text-[#0f766e] hover:text-[#115e59]"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
                        {post.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related tools */}
            {category.relatedTools && category.relatedTools.length > 0 && (
              <div className="rounded-xl border border-[#dbe1d8] bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#64748b]">Free tools</p>
                <ul className="mt-3 space-y-2">
                  {category.relatedTools.map((tool) => (
                    <li key={tool.path}>
                      <Link
                        to={tool.path}
                        className="flex items-start gap-1.5 text-sm font-medium text-[#0f766e] hover:text-[#115e59]"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
                        {tool.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Other categories */}
            <div className="rounded-xl border border-[#dbe1d8] bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#64748b]">All categories</p>
              <Link
                to="/directory"
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#475569] hover:text-[#0f172a]"
              >
                <ArrowLeft className="h-4 w-4" />
                Browse all service types
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default DirectoryCategoryPage;
