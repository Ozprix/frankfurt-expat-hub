import React from 'react';
import SEOHead from '@/components/SEOHead';
import { schemaWebSite, schemaOrganization } from '@/utils/structuredData';
import { Link } from 'react-router-dom';
import { motion } from '@/lib/motion';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { HeroCanvas, TypeWriter, ShineBorder, HoverGlowBorder } from '@/components/ui/hero-canvas';
import { AuroraBackground } from '@/components/ui/aurora-background';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calculator,
  Clock3,
  Euro,
  FileCheck,
  Globe,
  Home,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from '@/lib/icons';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const HomePage = () => {
  const servicePillars = [
    {
      title: 'Tax Consultants',
      detail: 'English-speaking experts for German and cross-border filings.',
      icon: FileCheck,
    },
    {
      title: 'Housing & Relocation',
      detail: 'Trusted partners for apartment search, relocation, and onboarding.',
      icon: Home,
    },
    {
      title: 'Banking & Planning',
      detail: 'Advisors for financial setup, pension planning, and investments.',
      icon: Euro,
    },
  ];

  const toolkit = [
    {
      title: 'Salary & Currency Tools',
      desc: 'Estimate German net pay and convert relocation budgets before you commit.',
      icon: Calculator,
      to: '/tools',
    },
    {
      title: 'Apartment Finder',
      desc: 'Explore districts and housing options tailored for newcomers.',
      icon: Building2,
      to: '/apartments',
    },
    {
      title: 'Forum',
      desc: 'Get answers from expats and local professionals in one place.',
      icon: MessageSquare,
      to: '/forum',
    },
    {
      title: 'Video Tutorials',
      desc: 'Step-by-step bureaucracy guides you can follow at your own pace.',
      icon: Video,
      to: '/tutorials',
    },
  ];

  const trustSignals = [
    { value: 'Free', label: 'Account Saves Progress' },
    { value: '6', label: 'Service Categories' },
    { value: '<24h', label: 'Partner Response Goal' },
  ];

  return (
    <>
      <SEOHead
        title="Frankfurt Expat Services | Free Tools & Trusted English-Speaking Experts"
        description="Free browser-based tools and a vetted directory of English-speaking tax consultants, housing agents, and financial advisors for expats settling in Frankfurt, Germany."
        canonical="/"
      >
        <script type="application/ld+json">{JSON.stringify(schemaWebSite())}</script>
        <script type="application/ld+json">{JSON.stringify(schemaOrganization())}</script>
      </SEOHead>

      <div className="bg-[#f3f4ef] text-[#0f172a]">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative min-h-[88vh] overflow-hidden px-4 pb-24 pt-20 sm:px-6 lg:px-8">
          {/* Aurora animated background — teal/emerald wash concentrated top-right */}
          <AuroraBackground asLayer showRadialGradient />

          {/* Canvas mouse-trail (purely decorative) */}
          <HeroCanvas className="pointer-events-none opacity-60" />

          {/* Radial gradient overlay */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(15,118,110,0.14),transparent)]" />

          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">

            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <ShineBorder
                borderRadius={999}
                borderWidth={1.5}
                duration={8}
                color={['#0f766e', '#14b8a6', '#6ee7b7', '#0f766e']}
                className="rounded-full"
              >
                <span className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#134e4a]">
                  <Sparkles className="h-3.5 w-3.5 text-[#0f766e]" />
                  Frankfurt's Expat Resource Hub
                </span>
              </ShineBorder>
            </motion.div>

            {/* Headline with typewriter */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-4xl text-balance text-5xl font-black leading-[1.05] tracking-tight text-[#0f172a] sm:text-6xl lg:text-7xl"
            >
              Settle in Frankfurt.{' '}
              <span className="text-[#0f766e]">
                <TypeWriter
                  strings={[
                    'Faster.',
                    'Smarter.',
                    'With the right experts.',
                    'Without the paperwork chaos.',
                  ]}
                />
              </span>
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl text-lg leading-relaxed text-[#475569]"
            >
              Free tools for salary, tax, and currency — plus a vetted directory of English-speaking
              experts for the moments you can't afford to get wrong.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <HoverGlowBorder radius={12} className="inline-flex">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(15,118,110,0.38)] transition hover:-translate-y-0.5 hover:bg-[#115e59] hover:shadow-[0_16px_32px_rgba(15,118,110,0.45)]"
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </HoverGlowBorder>
              <HoverGlowBorder radius={12} className="inline-flex">
                <Link
                  to="/tools"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#1e293b]/20 bg-white/90 px-7 py-3.5 text-sm font-bold text-[#1e293b] backdrop-blur-sm transition hover:border-[#0f766e]/40 hover:bg-white"
                >
                  Use Free Tools
                </Link>
              </HoverGlowBorder>
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-4 grid w-full max-w-lg grid-cols-3 gap-3"
            >
              {trustSignals.map((signal) => (
                <HoverGlowBorder key={signal.label} radius={16}>
                  <div className="rounded-2xl border border-[#dbe1d8] bg-white/80 p-4 backdrop-blur-sm">
                    <p className="text-2xl font-black text-[#0f172a]">{signal.value}</p>
                    <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[#64748b]">{signal.label}</p>
                  </div>
                </HoverGlowBorder>
              ))}
            </motion.div>

            {/* Feature cards row */}
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.55 }}
              className="mt-2 grid w-full max-w-3xl grid-cols-1 items-stretch gap-3 sm:grid-cols-3"
            >
              {[
                { label: 'Anmeldung Guide', desc: 'Step-by-step registration help', to: '/blog/anmeldung-frankfurt-checklist' },
                { label: 'Tax Calculator', desc: 'Estimate your German net pay', to: '/tools/german-tax-calculator-frankfurt' },
                { label: 'Service Directory', desc: 'Vetted English-speaking experts', to: '/directory' },
              ].map((card) => (
                <HoverGlowBorder key={card.label} radius={16} className="h-full">
                  <Link
                    to={card.to}
                    className="group flex h-full flex-col rounded-2xl border border-[#dbe1d8] bg-white/80 p-4 text-left backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#0f766e]/30 hover:shadow-[0_12px_24px_rgba(15,118,110,0.12)]"
                  >
                    <p className="text-sm font-bold text-[#0f172a]">{card.label}</p>
                    <p className="mt-0.5 flex-1 text-xs leading-relaxed text-[#64748b]">{card.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0f766e] opacity-0 transition-opacity group-hover:opacity-100">
                      Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </HoverGlowBorder>
              ))}
            </motion.div>

          </div>
        </section>

        <section className="border-y border-[#d7ddd3] bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Toolkit</p>
                <h2 className="text-3xl font-black text-[#0f172a] sm:text-4xl">Your relocation stack in one place</h2>
              </div>
              <Link to="/tools" className="hidden text-sm font-bold text-[#0f766e] hover:text-[#115e59] sm:inline-flex">
                Open free tools
              </Link>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
            >
              {toolkit.map((tool) => (
                <motion.div key={tool.title} variants={item}>
                  <HoverGlowBorder radius={16} className="h-full">
                    <Link
                      to={tool.to}
                      className="group block h-full rounded-2xl border border-[#dde4da] bg-white p-5 transition hover:-translate-y-1 hover:border-[#0f766e]/30 hover:shadow-[0_18px_35px_rgba(15,118,110,0.16)]"
                    >
                      <div className="mb-4 inline-flex rounded-xl bg-[#ecfdf5] p-3 text-[#0f766e]">
                        <tool.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-bold text-[#0f172a]">{tool.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#475569]">{tool.desc}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-[#0f766e]">
                        Open
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </HoverGlowBorder>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="border-y border-[#d7ddd3] bg-[#f8faf8] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Frankfurt Updates</p>
              <h2 className="text-3xl font-black text-[#0f172a] sm:text-4xl">Get the next Frankfurt guides first</h2>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-[#475569]">
                Practical guides for salary negotiation, apartment viewings, healthcare setup, and banking. Sign up to receive new guides and tool updates.
              </p>
            </div>
            <LeadCaptureForm
              intent="guide-updates"
              title="Get Frankfurt Guide Updates"
              description="Tell us where to send new guides and tool updates."
              submitLabel="Send Me Updates"
              compact
            />
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Directory</p>
              <h2 className="text-3xl font-black text-[#0f172a] sm:text-4xl">Vetted partners for the moments that matter</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#475569]">
                Use self-serve tools first, then switch to trusted experts when your case gets complex. This keeps costs under control and avoids avoidable delays.
              </p>

              <div className="mt-8 space-y-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#334155]">
                  <ShieldCheck className="h-4 w-4 text-[#0f766e]" />
                  Screening includes transparency, language support, and response speed.
                </p>
                <p className="flex items-center gap-2 text-sm font-semibold text-[#334155]">
                  <Clock3 className="h-4 w-4 text-[#0f766e]" />
                  Designed to cut decision time and reduce migration admin overhead.
                </p>
                <p className="flex items-center gap-2 text-sm font-semibold text-[#334155]">
                  <Users className="h-4 w-4 text-[#0f766e]" />
                  Built for professionals, students, and families relocating to Frankfurt.
                </p>
              </div>
              <HoverGlowBorder radius={12} className="mt-8 inline-flex">
                <Link
                  to="/directory"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#115e59]"
                >
                  Browse the Directory
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </HoverGlowBorder>
            </div>

            <div className="space-y-4">
              {servicePillars.map((pillar) => (
                <HoverGlowBorder key={pillar.title} radius={16}>
                  <div className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-[#fff7ed] p-3 text-[#c2410c]">
                        <pillar.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0f172a]">{pillar.title}</h3>
                        <p className="mt-1 text-sm text-[#475569]">{pillar.detail}</p>
                      </div>
                    </div>
                  </div>
                </HoverGlowBorder>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-3xl bg-[#111827] p-8 text-white sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#5eead4]">Free Account</p>
                <h2 className="text-3xl font-black sm:text-4xl">Ready to plan your Frankfurt move?</h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
                  Create an account to save your checklist progress, use the tools, ask the forum, and continue from your dashboard.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <HoverGlowBorder radius={12}>
                  <Link
                    to="/signup"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#14b8a6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d9488]"
                  >
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </HoverGlowBorder>
                <HoverGlowBorder radius={12}>
                  <Link
                    to="/pricing"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-transparent px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-400"
                  >
                    View Free Access
                  </Link>
                </HoverGlowBorder>
                <HoverGlowBorder radius={12}>
                  <Link
                    to="/faq"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-500"
                  >
                    <Globe className="h-4 w-4" />
                    FAQ
                  </Link>
                </HoverGlowBorder>
                <HoverGlowBorder radius={12}>
                  <Link
                    to="/how-it-works"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-500"
                  >
                    <BadgeCheck className="h-4 w-4" />
                    Process Overview
                  </Link>
                </HoverGlowBorder>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
