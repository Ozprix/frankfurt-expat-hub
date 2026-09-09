import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { motion } from '@/lib/motion';
import { HoverGlowBorder } from '@/components/ui/hero-canvas';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  FileText,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from '@/lib/icons';

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

const supportRows = [
  {
    title: 'Frankfurt-specific order',
    description: 'The checklist keeps city setup steps in the order newcomers actually need them.',
    icon: CalendarDays,
  },
  {
    title: 'Progress saved',
    description: 'Create a free account and continue from dashboard, checklist, or tools without starting over.',
    icon: BadgeCheck,
  },
  {
    title: 'Expert escalation',
    description: 'Use the directory when a tax, housing, insurance, or legal question needs professional help.',
    icon: ShieldCheck,
  },
];

const HowItWorksPage = () => (
  <>
    <SEOHead
      title="How It Works | Frankfurt Expat Services"
      description="See how Frankfurt Expat Services helps you navigate Anmeldung, health insurance, bank accounts, and more with a personalised checklist and free browser tools."
      canonical="/how-it-works"
    />

    <div className="bg-[#f3f4ef] text-[#0f172a]">
      <section className="px-4 pb-14 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">
              <Sparkles className="h-4 w-4" />
              How It Works
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl lg:text-6xl">
              A calmer path through Frankfurt relocation.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
              Build a plan, keep your documents organized, and move through Anmeldung, insurance,
              banking, tax ID, and first-month setup with fewer surprises.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <HoverGlowBorder radius={12} className="inline-flex">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(15,118,110,0.28)] transition hover:bg-[#115e59]"
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </HoverGlowBorder>
              <Link
                to="/tools"
                className="inline-flex items-center justify-center rounded-xl border border-[#dbe1d8] bg-white px-6 py-3 text-sm font-bold text-[#0f172a] transition hover:border-[#0f766e]/40 hover:bg-[#f8faf8]"
              >
                Explore Tools
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="rounded-3xl border border-[#dbe1d8] bg-white p-6 shadow-sm"
          >
            <div className="grid grid-cols-3 gap-3">
              {[
                ['30', 'Day Starter Plan'],
                ['Free', 'Tools Included'],
                ['6', 'Expert Categories'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-[#f8faf8] p-4 text-center">
                  <p className="text-2xl font-black text-[#0f172a]">{value}</p>
                  <p className="mt-1 text-xs font-semibold leading-snug text-[#64748b]">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {supportRows.map(({ title, description, icon: Icon }) => (
                <div key={title} className="flex items-start gap-3 rounded-2xl border border-[#e2e8f0] p-4">
                  <div className="rounded-xl bg-[#ecfdf5] p-2.5 text-[#0f766e]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[#0f172a]">{title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-[#475569]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-[#d7ddd3] bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">The Flow</p>
            <h2 className="mt-2 text-3xl font-black text-[#0f172a] sm:text-4xl">Plan first, then work through the setup in order</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <HoverGlowBorder key={step.title} radius={16} className="h-full">
                <article className="h-full rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0f766e]/30 hover:shadow-[0_18px_35px_rgba(15,118,110,0.12)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#0f766e]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-black text-[#64748b]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-black text-[#0f172a]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#475569]">{step.description}</p>
                </article>
              </HoverGlowBorder>
            );
          })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-3xl bg-[#111827] p-8 text-white sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5eead4]">Free Account</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">Keep the checklist, tools, and dashboard together.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              Save progress as your move changes, then use the directory or forum when a step needs more context.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link
              to="/frankfurt-first-30-days-checklist"
              className="inline-flex items-center justify-center rounded-xl bg-[#14b8a6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d9488]"
            >
              Open Checklist
            </Link>
            <Link
              to="/directory"
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-500"
            >
              Browse Directory
            </Link>
          </div>
        </div>
      </section>
    </div>
  </>
);

export default HowItWorksPage;
