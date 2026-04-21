import React from 'react';
import SEOHead from '@/components/SEOHead';
import { AlertTriangle, CheckCircle, ExternalLink, Home, MapPin, Search, ShieldCheck } from '@/lib/icons';
import LeadCaptureForm from '@/components/LeadCaptureForm';

const searchPortals = [
  {
    name: 'ImmobilienScout24',
    url: 'https://www.immobilienscout24.de/Suche/de/hessen/frankfurt-am-main/wohnung-mieten',
    useFor: 'Broad long-term apartment search',
  },
  {
    name: 'Immowelt',
    url: 'https://www.immowelt.de/suche/frankfurt-am-main/wohnungen/mieten',
    useFor: 'Alternative long-term listings',
  },
  {
    name: 'WG-Gesucht',
    url: 'https://www.wg-gesucht.de/wg-zimmer-in-Frankfurt-am-Main.41.0.1.0.html',
    useFor: 'Shared flats and rooms',
  },
  {
    name: 'Kleinanzeigen',
    url: 'https://www.kleinanzeigen.de/s-wohnung-mieten/frankfurt-am-main/c203l4292',
    useFor: 'Private landlord and sublet offers',
  },
  {
    name: 'HousingAnywhere',
    url: 'https://housinganywhere.com/s/Frankfurt--Germany',
    useFor: 'Temporary and furnished stays',
  },
];

const neighborhoods = [
  {
    name: 'Nordend',
    fit: 'Central, green, popular with professionals and families.',
    watch: 'High demand and fast-moving listings.',
  },
  {
    name: 'Bornheim',
    fit: 'Lively, good transit, restaurants, and everyday shopping.',
    watch: 'Older buildings vary strongly in insulation and layout.',
  },
  {
    name: 'Sachsenhausen',
    fit: 'Good river access, restaurants, museums, and mixed housing stock.',
    watch: 'Nightlife streets can be noisy.',
  },
  {
    name: 'Bockenheim',
    fit: 'Student-friendly, practical, and connected to Westend and Messe.',
    watch: 'Check commute times if working east of the city.',
  },
  {
    name: 'Gallus / Europaviertel',
    fit: 'Modern buildings, new infrastructure, and easy access to Messe.',
    watch: 'Service charges can be higher in newer buildings.',
  },
  {
    name: 'Westend',
    fit: 'Premium, central, quiet streets close to finance offices.',
    watch: 'One of Frankfurt’s more expensive areas.',
  },
];

const viewingChecklist = [
  'Ask whether the rent is Kaltmiete or Warmmiete and what utilities are included.',
  'Check the exact deposit amount and never pay before a signed contract or verified handover process.',
  'Confirm whether Anmeldung is possible at the address.',
  'Request energy certificate details and ask about heating type and expected monthly costs.',
  'Document defects during handover with dated photos and a written Übergabeprotokoll.',
  'Be careful with landlords who refuse viewings, pressure immediate payment, or only communicate off-platform.',
];

const ApartmentFinderPage = () => {
  return (
    <>
      <SEOHead
        title="Frankfurt Apartment Finder | Frankfurt Expat Services"
        description="Track viewings, save listings, and compare Frankfurt apartments in one place. Built for expats searching for rental housing in Frankfurt."
        canonical="/apartments"
      />

      <div className="min-h-screen bg-[#f3f4ef] text-[#0f172a]">
        <section className="border-b border-[#dbe1d8] bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Housing Search</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">
              Find Frankfurt housing without copying portal listings.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#475569]">
              We do not republish third-party apartment listings, photos, prices, or descriptions. Instead,
              use this page as a clean search hub: compare trusted portals, shortlist neighborhoods, and use
              the viewing checklist before contacting landlords or agents.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ['No copied listings', 'We link out to original sources.'],
                ['No scraped photos', 'Images and descriptions stay with the owner.'],
                ['Original guidance', 'Neighborhood and safety notes are written for expats.'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-xl border border-[#dbe1d8] bg-[#f8faf8] p-4">
                  <ShieldCheck className="mb-2 h-5 w-5 text-[#0f766e]" />
                  <p className="text-sm font-black">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748b]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-start gap-3">
                <div className="rounded-xl bg-[#ecfdf5] p-3 text-[#0f766e]">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Start with the original portals</h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#64748b]">
                    Open each portal directly so availability, price, photos, and contact details remain current
                    and attributable to the source.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {searchPortals.map((portal) => (
                  <a
                    key={portal.name}
                    href={portal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-[#e2e8f0] bg-[#fafaf7] p-4 transition hover:border-[#0f766e] hover:bg-white"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-black">{portal.name}</h3>
                      <ExternalLink className="h-4 w-4 text-[#0f766e]" />
                    </div>
                    <p className="mt-2 text-sm text-[#64748b]">{portal.useFor}</p>
                  </a>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <AlertTriangle className="h-6 w-6 text-amber-700" />
              <h2 className="mt-3 text-xl font-black text-amber-950">Scam checks before you pay</h2>
              <ul className="mt-4 space-y-3">
                {viewingChecklist.slice(1, 4).map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-amber-950">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </section>

        <section className="border-y border-[#dbe1d8] bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Neighborhood Shortlist</p>
              <h2 className="mt-2 text-3xl font-black">Where expats often start looking</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {neighborhoods.map((area) => (
                <article key={area.name} className="rounded-2xl border border-[#dbe1d8] bg-[#f8faf8] p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#0f766e]" />
                    <h3 className="font-black">{area.name}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#475569]">{area.fit}</p>
                  <p className="mt-3 text-xs font-semibold leading-relaxed text-[#64748b]">Watch: {area.watch}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#dbe1d8] bg-white p-6">
              <Home className="h-6 w-6 text-[#0f766e]" />
              <h2 className="mt-3 text-2xl font-black">Viewing checklist</h2>
              <ul className="mt-5 space-y-3">
                {viewingChecklist.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-[#475569]">
                    <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#0f766e]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <LeadCaptureForm
              intent="housing-help"
              title="Suggest a housing resource"
              description="Know a reputable relocation agent, temporary housing provider, or English-speaking landlord resource? Send it for manual review."
              submitLabel="Suggest Resource"
              showCompany
              messageLabel="Resource Details"
              messagePlaceholder="Share the provider name, website, city coverage, language support, and why it is useful for Frankfurt newcomers."
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default ApartmentFinderPage;
