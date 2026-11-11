import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { BriefcaseBusiness, CheckCircle2, Globe, MapPin, ShieldCheck, Sparkles } from '@/lib/icons';
import { jobFocusAreas, trustedJobSources } from '@/data/jobsData';

const trustChecks = [
  ['Language made explicit', 'Every role must clearly state the working-language and German expectation.'],
  ['International-readiness reviewed', 'We look for concrete signals such as English application support, relocation help, or visa clarity.'],
  ['Direct application route', 'You apply on the employer’s own site. We do not collect CVs or charge job seekers.'],
];

const JobsPage = () => (
  <>
    <SEOHead
      title="International Jobs in Frankfurt | Career & Relocation Readiness"
      description="A curated, trust-led starting point for international professionals seeking English-friendly jobs in Frankfurt and the Rhine-Main region."
      canonical="/jobs"
    />
    <main>
      <section className="overflow-hidden bg-[#0f172a] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#99f6e4]">Career + relocation readiness</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">Find work that is ready for an international move.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">Frankfurt Jobs is a curated extension of our expat directory—not another noisy job board. We surface clear, international-ready opportunities and the practical steps that help you be ready to apply.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#alerts" className="rounded-lg bg-[#5eead4] px-5 py-3 text-sm font-bold text-[#134e4a] transition hover:bg-[#99f6e4]">Get launch alerts</a>
              <a href="#employers" className="rounded-lg border border-slate-500 px-5 py-3 text-sm font-bold text-white transition hover:border-[#99f6e4]">Post a role for review</a>
            </div>
          </div>
          <aside className="rounded-2xl border border-teal-300/25 bg-white/10 p-6 backdrop-blur">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5eead4] text-[#134e4a]"><ShieldCheck className="h-6 w-6" /></div>
            <h2 className="mt-5 text-xl font-black">No false promises. Clear signals.</h2>
            <ul className="mt-5 space-y-4">
              {['Frankfurt/Rhine-Main focus', 'English and German requirements shown', 'Visa and relocation context where confirmed', 'Direct employer application links'].map((item) => <li key={item} className="flex gap-3 text-sm text-slate-200"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#5eead4]" />{item}</li>)}
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-[#f3f4ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">The curated launch</p><h2 className="mt-3 text-3xl font-black text-[#0f172a]">We are building the first reviewed collection now.</h2><p className="mt-4 leading-relaxed text-[#475569]">Rather than publish stale or ambiguous vacancies, we are confirming employers, language expectations, and application routes before a role appears here. Join the alert list and we’ll share the first release.</p></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {jobFocusAreas.slice(0, 3).map((area) => <article key={area} className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm"><BriefcaseBusiness className="h-6 w-6 text-[#0f766e]" /><h3 className="mt-4 font-black text-[#0f172a]">{area}</h3><p className="mt-2 text-sm leading-relaxed text-[#64748b]">Priority area for the first Frankfurt/Rhine-Main employer collection.</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Why trust this space</p><h2 className="mt-3 text-3xl font-black text-[#0f172a]">A job listing should tell you whether the move is realistic.</h2></div><div className="mt-8 grid gap-5 md:grid-cols-3">{trustChecks.map(([title, description], index) => <article key={title} className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ecfdf5] text-sm font-black text-[#0f766e]">{index + 1}</span><h3 className="mt-4 font-black text-[#0f172a]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#475569]">{description}</p></article>)}</div></div>
      </section>

      <section className="border-y border-[#dbe1d8] bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Start today</p><h2 className="mt-3 text-3xl font-black text-[#0f172a]">Use trusted sources while the curated collection grows.</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{trustedJobSources.map((source) => <a key={source.name} href={source.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0f766e]"><Globe className="h-6 w-6 text-[#0f766e]" /><h3 className="mt-4 font-black text-[#0f172a]">{source.name}</h3><p className="mt-2 text-sm leading-relaxed text-[#475569]">{source.description}</p><span className="mt-5 inline-block text-sm font-bold text-[#0f766e]">{source.label} →</span></a>)}</div><div className="mt-7 flex flex-wrap gap-3 text-sm"><Link to="/frankfurt-first-30-days-checklist" className="font-bold text-[#0f766e] hover:underline">Prepare your move with the First 30 Days Checklist</Link><span className="text-[#94a3b8]">•</span><Link to="/directory/housing-relocation-frankfurt" className="font-bold text-[#0f766e] hover:underline">Find relocation and housing support</Link></div></div></section>

      <section id="alerts" className="px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-start"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">For job seekers</p><h2 className="mt-3 text-3xl font-black text-[#0f172a]">Be first to see reviewed roles.</h2><p className="mt-4 max-w-xl leading-relaxed text-[#475569]">Tell us the role or field you’re targeting. This helps us shape the collection; it is not a recruitment service and we will never share your details with employers without your permission.</p><div className="mt-6 flex items-center gap-3 text-sm text-[#475569]"><MapPin className="h-5 w-5 text-[#0f766e]" />Frankfurt and the Rhine-Main region</div></div><LeadCaptureForm intent="job-alert" title="Get the curated jobs launch alert" description="We’ll email you when the first reviewed Frankfurt roles go live." submitLabel="Join the alert list" messageLabel="What work are you looking for?" messagePlaceholder="For example: product management, finance, data, logistics; your English/German level; and preferred work model." /></div></section>

      <section id="employers" className="bg-[#ecfdf5] px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-start"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">For employers</p><h2 className="mt-3 text-3xl font-black text-[#0f172a]">Reach people preparing a Frankfurt move.</h2><p className="mt-4 max-w-xl leading-relaxed text-[#475569]">Submit an international-ready role for editorial review. Acceptance is based on clarity, relevance, and applicant experience—not payment.</p><div className="mt-6 flex gap-3 text-sm text-[#334155]"><Sparkles className="h-5 w-5 shrink-0 text-[#0f766e]" />Please include language expectations, location/work model, salary information where possible, and confirmed visa or relocation support.</div></div><LeadCaptureForm intent="job-employer-submission" title="Submit a role for review" description="We review submissions before they appear. A submission does not guarantee publication." submitLabel="Submit role" showCompany showCategory companyLabel="Employer name" categoryLabel="Role area" categoryOptions={jobFocusAreas} messageLabel="Role details" messagePlaceholder="Include job title, direct application URL, location/work model, English and German requirements, salary range where available, visa/relocation support, and closing date." /></div></section>
    </main>
  </>
);

export default JobsPage;
