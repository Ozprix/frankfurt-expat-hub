import React from 'react';
import SEOHead from '@/components/SEOHead';
import { BookOpen, Check, MessageSquare, Search, Users, Wrench } from '@/lib/icons';
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

  return (
    <>
      <SEOHead
        title="Free Access | Frankfurt Expat Services"
        description="Frankfurt Expat Services is currently free while we grow the relocation tools, checklist, forum, guides, and English-speaking provider directory."
        canonical="/pricing"
      />

      <div className="bg-[#f3f4ef] px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="border border-[#dbe1d8] bg-white px-6 py-12 text-center sm:px-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">Free Access</p>
            <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl">
              Everything is free while we grow Frankfurt&apos;s expat hub.
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#475569]">
              Paid checkout is paused. The focus now is useful tools, strong directory coverage, practical guides,
              and a community that helps newcomers settle faster.
            </p>

            <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => navigate(user ? '/dashboard' : '/signup')}
                className="rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#115e59]"
              >
                {user ? 'Go To Dashboard' : 'Create Free Account'}
              </button>
              <button
                onClick={() => navigate('/directory')}
                className="rounded-lg border border-[#dbe1d8] bg-white px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:bg-[#f8faf8]"
              >
                Browse Directory
              </button>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {included.map(({ title, description, icon: Icon }) => (
              <article key={title} className="border border-[#dbe1d8] bg-white p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#ecfdf5] text-[#0f766e]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-[#0f172a]">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{description}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 border border-[#dbe1d8] bg-[#0c2622] p-8 text-white sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5eead4]">What Comes Next</p>
                <h2 className="mt-2 text-3xl font-black">More listings, better guides, stronger community.</h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#cbd5e1]">
                  We will revisit paid products only after the directory has deeper coverage, the tools are useful
                  for regular visitors, and the forum has enough practical answers to become a real Frankfurt newcomer resource.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <button
                  onClick={() => navigate('/tools')}
                  className="rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d9488]"
                >
                  Use Free Tools
                </button>
                <button
                  onClick={() => navigate('/forum')}
                  className="rounded-lg border border-[#1e3a35] px-5 py-3 text-sm font-bold text-[#cbd5e1] transition hover:border-[#0f766e] hover:text-white"
                >
                  Visit Forum
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default PricingPage;
