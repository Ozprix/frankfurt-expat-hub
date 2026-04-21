import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { ClipboardCheck, FileText, MapPinned, Sparkles } from '@/lib/icons';

const steps = [
  {
    title: 'Map your move',
    description: 'Tell us your visa type, arrival date, and priorities. You get a personalised checklist of Frankfurt-specific tasks in the right order — Anmeldung before bank account, insurance before the first payslip.',
    icon: MapPinned,
  },
  {
    title: 'Track the paperwork',
    description: 'Work through each task at your own pace: residence registration (Anmeldung), health insurance sign-up, bank account opening, tax ID, and more — all in one place with progress saved automatically.',
    icon: ClipboardCheck,
  },
	  {
	    title: 'Use free tools along the way',
	    description: 'Create a free account to estimate your German net salary, convert your relocation budget, generate QR codes, and keep checklist progress available across devices.',
	    icon: FileText,
	  },
];

const HowItWorksPage = () => (
  <>
      <SEOHead
        title="How It Works | Frankfurt Expat Services"
        description="See how Frankfurt Expat Services helps you navigate Anmeldung, health insurance, bank accounts, and more with a personalised checklist and free browser tools."
        canonical="/how-it-works"
      />

    <div className="bg-[#f3f4ef] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="border border-[#dbe1d8] bg-white p-8 sm:p-12">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">
            <Sparkles className="h-4 w-4" />
            How it works
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black text-[#0f172a] sm:text-5xl">
            A calmer path through Frankfurt relocation.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#475569]">
            Build a plan, keep your documents organized, and move through each government and setup step with fewer surprises.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#115e59]"
            >
              Start planning
            </Link>
            <Link
              to="/tools"
              className="inline-flex items-center justify-center rounded-lg border border-[#cbd5c6] px-5 py-3 text-sm font-bold text-[#0f172a] transition hover:bg-[#edf2ea]"
            >
              Explore tools
            </Link>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article key={step.title} className="border border-[#dbe1d8] bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ccfbf1] text-[#0f766e]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[#64748b]">
                  Step {index + 1}
                </p>
                <h2 className="mt-2 text-xl font-black text-[#0f172a]">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">{step.description}</p>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  </>
);

export default HowItWorksPage;
