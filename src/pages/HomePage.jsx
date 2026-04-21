import React from 'react';
import SEOHead from '@/components/SEOHead';
import { schemaWebSite, schemaOrganization } from '@/utils/structuredData';
import { Link } from 'react-router-dom';
import { motion } from '@/lib/motion';
import LeadCaptureForm from '@/components/LeadCaptureForm';
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
        <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,#f59e0b_0%,rgba(245,158,11,0.22)_22%,rgba(255,255,255,0)_46%),radial-gradient(circle_at_top_left,#0f766e_0%,rgba(15,118,110,0.2)_25%,rgba(255,255,255,0)_45%)]" />
          <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <motion.div variants={container} initial="hidden" animate="visible" className="space-y-8">
              <motion.p variants={item} className="inline-flex items-center gap-2 rounded-full border border-[#0f766e]/30 bg-white/75 px-4 py-2 text-sm font-semibold text-[#134e4a]">
                <Sparkles className="h-4 w-4" />
                Frankfurt's Expat Resource Hub
              </motion.p>

              <motion.h1 variants={item} className="max-w-3xl text-balance text-5xl font-black leading-[0.95] tracking-tight text-[#111827] sm:text-6xl lg:text-7xl">
                Free relocation tools and trusted English-speaking experts.
              </motion.h1>

              <motion.p variants={item} className="max-w-2xl text-lg leading-relaxed text-[#334155]">
                Frankfurt Expat Services combines practical planning tools with a vetted service directory so newcomers can move faster with fewer mistakes.
              </motion.p>

              <motion.div variants={item} className="flex flex-wrap items-center gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_25px_rgba(15,118,110,0.35)] transition hover:-translate-y-0.5 hover:bg-[#115e59]"
                >
                  Start Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/tools"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#1e293b]/20 bg-white px-6 py-3 text-sm font-bold text-[#1e293b] transition hover:border-[#1e293b]/40"
                >
                  Use Free Tools
                </Link>
              </motion.div>

              <motion.div variants={item} className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                {trustSignals.map((signal) => (
                  <div key={signal.label} className="rounded-xl border border-[#dbe1d8] bg-white/85 p-4">
                    <p className="text-2xl font-black text-[#0f172a]">{signal.value}</p>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#475569]">{signal.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="rounded-3xl border border-[#dbe1d8] bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.12)]"
            >
              <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0f766e]">Why People Choose Us</p>
              <div className="space-y-4">
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="font-semibold text-[#0f172a]">Free account before using tools</p>
                  <p className="mt-1 text-sm text-[#475569]">Create an account to save progress and use the relocation tools.</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="font-semibold text-[#0f172a]">Vetted service directory</p>
                  <p className="mt-1 text-sm text-[#475569]">Partners are reviewed for responsiveness and expat support quality.</p>
                </div>
                <div className="rounded-2xl bg-[#f8fafc] p-4">
                  <p className="font-semibold text-[#0f172a]">Built for Frankfurt realities</p>
                  <p className="mt-1 text-sm text-[#475569]">Focused on bureaucracy, housing, and financial setup for newcomers.</p>
                </div>
              </div>
            </motion.aside>
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
              <Link
                to="/directory"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#115e59]"
              >
                Browse the Directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {servicePillars.map((pillar) => (
                <div key={pillar.title} className="rounded-2xl border border-[#dbe1d8] bg-white p-6 shadow-sm">
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
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#14b8a6] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0d9488]"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-slate-400"
                >
                  View Free Access
                </Link>
                <Link
                  to="/faq"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-500"
                >
                  <Globe className="h-4 w-4" />
                  FAQ
                </Link>
                <Link
                  to="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-slate-500"
                >
                  <BadgeCheck className="h-4 w-4" />
                  Process Overview
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
