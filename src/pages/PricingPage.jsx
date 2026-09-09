import React from 'react';
import SEOHead from '@/components/SEOHead';
import { HoverGlowBorder } from '@/components/ui/hero-canvas';
import { ArrowRight, BookOpen, Check, Clock3, MessageSquare, Search, ShieldCheck, Users, Wrench } from '@/lib/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const included = [
    {
      title: 'Relocation checklist',
      description: 'Track Anmeldung, tax ID, bank setup, insurance, transport, and first-month bureaucracy steps.',
      icon: Check,
    },
    {
      title: 'Free planning tools',
      description: 'Use the salary calculator, currency converter, QR generator, password tool, and First 30 Days checklist tracker.',
      icon: Wrench,
    },
    {
      title: 'Vetted service directory',
      description: 'Find English-speaking tax, relocation, banking, legal, insurance, and healthcare providers.',
      icon: Search,
    },
    {
      title: 'Community forum',
      description: 'Ask Frankfurt-specific questions and help other newcomers with practical relocation experience.',
      icon: MessageSquare,
    },
    {
      title: 'Guides and explainers',
      description: 'Read plain-English guides for bureaucracy, housing, health insurance, banking, and everyday setup.',
      icon: BookOpen,
    },
    {
      title: 'Free account workspace',
      description: 'Save planning progress and use the dashboard while free access is available.',
      icon: Users,
    },
  ];

  const launchPrinciples = [
    {
      title: 'Checkout is paused',
      description: 'No payment route or subscription prompt is part of the current launch path.',
      icon: ShieldCheck,
    },
    {
      title: 'Traffic first',
      description: 'The priority is useful guides, searchable tools, and directory coverage for real Frankfurt questions.',
      icon: Search,
    },
    {
      title: 'Paid products later',
      description: 'Pricing comes back only when the community and provider network justify it.',
      icon: Clock3,
    },
  ];

  return (
    <>
      <SEOHead
        title="Free Access | Frankfurt Expat Services"
        description="Frankfurt Expat Services is currently free while we grow the relocation tools, checklist, forum, guides, and English-speaking provider directory."
        canonical="/pricing"
      />

      <div className="bg-[#f3f4ef] text-[#0f172a]">
        <section className="px-4 pb-14 pt-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Free Access</p>
              <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
                Everything is free while we grow Frankfurt&apos;s expat hub.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
                Paid checkout is paused. The focus now is useful tools, strong directory coverage, practical guides,
                and a community that helps newcomers settle faster.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <HoverGlowBorder radius={12} className="inline-flex">
                  <button
                    type="button"
                    onClick={() => navigate(user ? '/dashboard' : '/signup')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(15,118,110,0.28)] transition hover:bg-[#115e59]"
                  >
                    {user ? 'Go To Dashboard' : 'Create Free Account'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </HoverGlowBorder>
                <button
                  type="button"
                  onClick={() => navigate('/directory')}
                  className="rounded-xl border border-[#dbe1d8] bg-white px-6 py-3 text-sm font-bold text-[#0f172a] transition hover:border-[#0f766e]/40 hover:bg-[#f8faf8]"
                >
                  Browse Directory
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['€0', 'Current Price'],
                  ['Free', 'Account Tools'],
                  ['Paused', 'Paid Checkout'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl bg-[#f8faf8] p-4 text-center">
                    <p className="text-2xl font-black text-[#0f172a]">{value}</p>
                    <p className="mt-1 text-xs font-semibold leading-snug text-[#64748b]">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-[#ecfdf5] p-5">
                <p className="text-sm font-black text-[#0f766e]">Launch promise</p>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                  No hidden checkout step. Create an account, use the tools, save progress, and browse the directory while access is free.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#d7ddd3] bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Included Now</p>
              <h2 className="mt-2 text-3xl font-black text-[#0f172a] sm:text-4xl">Use the full relocation workspace during the growth phase</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {included.map(({ title, description, icon: Icon }) => (
              <HoverGlowBorder key={title} radius={16} className="h-full">
                <article className="h-full rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0f766e]/30 hover:shadow-[0_18px_35px_rgba(15,118,110,0.12)]">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#0f766e]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#0f172a]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">{description}</p>
                </article>
              </HoverGlowBorder>
            ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
            {launchPrinciples.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff7ed] text-[#c2410c]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-[#0f172a]">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-[#111827] p-8 text-white sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5eead4]">What Comes Next</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">More listings, better guides, stronger community.</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                We will revisit paid products only after the directory has deeper coverage, the tools are useful
                for regular visitors, and the forum has enough practical answers to become a real Frankfurt newcomer resource.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => navigate('/tools')}
                className="rounded-xl bg-[#14b8a6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d9488]"
              >
                Use Free Tools
              </button>
              <button
                type="button"
                onClick={() => navigate('/forum')}
                className="rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-500"
              >
                Visit Forum
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PricingPage;
