import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, Globe, MapPin, ShieldCheck } from '@/lib/icons';
import SEOHead from '@/components/SEOHead';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { getProviderBySlug, getProviderCategoryId } from '@/utils/directoryProfiles';
import { trackConversionEvent } from '@/utils/conversionTracking';

const DirectoryProviderPage = () => {
  const { providerSlug } = useParams();
  const provider = getProviderBySlug(providerSlug);

  if (!provider) return <Navigate to="/directory" replace />;

  const services = Array.isArray(provider.services) ? provider.services.filter(Boolean) : [];
  const languages = Array.isArray(provider.languages) ? provider.languages.filter(Boolean) : [];
  const title = `${provider.name} | Frankfurt Expat Services`;
  const categoryId = getProviderCategoryId(provider);

  return (
    <>
      <SEOHead
        title={title}
        description={provider.summary || `Learn about ${provider.name}, an English-speaking service provider for Frankfurt expats.`}
        canonical={`/directory/provider/${providerSlug}`}
      />
      <div className="bg-[#f3f4ef] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link to="/directory" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]">
            <ArrowLeft className="h-4 w-4" /> Back to directory
          </Link>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
            <main className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">{provider.category}</p>
              <h1 className="mt-3 text-3xl font-black leading-tight text-[#0f172a] sm:text-4xl">{provider.name}</h1>
              {provider.location ? <p className="mt-3 flex items-center gap-2 text-sm text-[#64748b]"><MapPin className="h-4 w-4" /> {provider.location}</p> : null}
              {provider.summary ? <p className="mt-6 text-base leading-relaxed text-[#475569]">{provider.summary}</p> : null}

              <section className="mt-8 border-t border-[#e2e8f0] pt-7">
                <h2 className="text-lg font-black text-[#0f172a]">Services offered</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {services.map((service) => <li key={service} className="flex items-start gap-2 text-sm text-[#334155]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0f766e]" />{service}</li>)}
                </ul>
              </section>

              <section className="mt-8 grid gap-4 border-t border-[#e2e8f0] pt-7 sm:grid-cols-2">
                {languages.length ? <div><p className="text-xs font-bold uppercase tracking-wide text-[#64748b]">Languages</p><p className="mt-1 text-sm font-semibold text-[#334155]">{languages.join(', ')}</p></div> : null}
                {provider.pricing ? <div><p className="text-xs font-bold uppercase tracking-wide text-[#64748b]">Pricing approach</p><p className="mt-1 text-sm font-semibold text-[#334155]">{provider.pricing}</p></div> : null}
              </section>

              <section className="mt-8 rounded-xl bg-[#f0fdfa] p-5">
                <div className="flex gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0f766e]" /><div><h2 className="font-black text-[#0f172a]">Directory review standard</h2><p className="mt-1 text-sm leading-relaxed text-[#475569]">We assess listed services for English-language support, clear service information, and fit for Frankfurt newcomers. A listing is not a guarantee of outcomes; always confirm credentials, scope, fees, and availability directly.</p></div></div>
              </section>

              {provider.url ? <a href={provider.url} target="_blank" rel="noopener noreferrer" onClick={() => trackConversionEvent('directory_provider_website_click', { provider_name: provider.name, provider_category: provider.category, provider_url: provider.url })} className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[#0f766e] px-4 py-2.5 text-sm font-bold text-[#0f766e] hover:bg-[#f0fdfa]">Visit provider website <ExternalLink className="h-4 w-4" /></a> : null}
            </main>
            <aside className="space-y-5">
              <LeadCaptureForm intent="directory-introduction" title={`Request an introduction to ${provider.name}`} description="Tell us what you need. We will review your request before sharing an introduction." submitLabel="Request introduction" context={`Provider: ${provider.name} | Category: ${provider.category}`} leadMetadata={{ providerName: provider.name, providerCategory: provider.category }} messageLabel="What help do you need?" messagePlaceholder="For example: I need help with a Blue Card renewal and would prefer an online consultation this month." showMatchDetails />
              <div className="rounded-xl border border-[#dbe1d8] bg-white p-5 text-sm text-[#475569]"><div className="flex items-center gap-2 font-bold text-[#334155]"><Globe className="h-4 w-4 text-[#0f766e]" /> Prefer to compare?</div><Link to={categoryId ? `/directory?category=${categoryId}` : '/directory'} className="mt-2 inline-block font-semibold text-[#0f766e] hover:underline">Browse more {provider.category} options</Link></div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

export default DirectoryProviderPage;
