import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useContactForm } from '@/hooks/useContactForm';
import { ArrowLeft, BadgeCheck, CheckCircle, FileCheck, Sparkles, Loader2, ShieldCheck } from '@/lib/icons';

// Public SEO acquisition front door for the (login-gated) Creator Records tool.
// Indexable — this is the organic traffic catch. CTA splits two ways:
//   1. free signup -> /creator-records (the tool)
//   2. lead form -> get matched with an English-speaking Steuerberater (revenue)
// ponytail: reuses the existing `contact-form` edge function via
// source='creator-taxes'. No new table/function until lead volume justifies it.

const PAINS = [
  { icon: Sparkles, title: 'Gifted products & PR samples count', desc: 'In Germany, free products and collaborations can be taxable income. Logging them as you go beats reconstructing a year at deadline.' },
  { icon: FileCheck, title: 'Your Steuerberater needs it organized', desc: 'Advisors charge by the hour. A clean, categorized pack of income, samples and expenses means less back-and-forth and a lower bill.' },
  { icon: BadgeCheck, title: 'Built for English-speaking creators', desc: 'No German accounting jargon. Track TikTok, Instagram and YouTube income and evidence in plain English.' },
];

const FAQ = [
  {
    q: 'Are gifted products and PR samples really taxable in Germany?',
    a: 'They often are. Products received in exchange for content or promotion can count as income at their market value, and some gifts are taxed at the source by the brand. This tool helps you record and evidence them — it does not calculate tax or replace advice from a qualified Steuerberater.',
  },
  {
    q: 'Is the tool free?',
    a: 'Yes. Create a free account and start logging income, samples, expenses and supporting files right away. You can export a preparation pack whenever you like.',
  },
  {
    q: 'Does this file my taxes or tell me what I owe?',
    a: 'No. Creator Records is a preparation and organizing tool only. It does not calculate tax, decide tax treatment, or replace qualified advice. When you are ready, export your pack and hand it to a Steuerberater.',
  },
  {
    q: 'Can you connect me with a tax advisor for creators?',
    a: 'Yes — tell us below and we will aim to match you with a vetted English-speaking Steuerberater who works with creators and freelancers in Germany.',
  },
];

const initialForm = { name: '', email: '', website: '' };

const CreatorTaxesPage = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const { loading, submitContactForm } = useContactForm();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError('Please add your first name and email.');
      return;
    }

    const result = await submitContactForm({
      name: form.name,
      email: form.email,
      subject: 'Creator tax advisor match request',
      message: `New creator-tax lead from /creator-taxes. Wants matching with an English-speaking Steuerberater for creators.`,
      source: 'creator-taxes',
      website: form.website, // honeypot — bots fill this, humans don't see it
    });

    if (!result.success) {
      setError(result.message || 'Something went wrong. Please try again.');
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4ef]">
      <SEOHead
        title="Content Creator Taxes in Germany — Track Income, PR Gifts & Expenses"
        description="Free tool for English-speaking creators in Germany to organize TikTok, Instagram and YouTube income, gifted PR samples, and business expenses — ready to hand to a Steuerberater. Not tax advice."
        canonical="/creator-taxes"
      />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* ── Pitch ──────────────────────────────────────────── */}
          <section>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Frankfurt Expat Services</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl">
              Content creator taxes in Germany, finally organized.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#475569]">
              If you make content in Germany, your income, brand collaborations and gifted PR samples can all matter at tax
              time. <strong>Creator Records</strong> is a free tool to log it as you go — income, samples, business expenses
              and evidence — so your year is ready to hand to a Steuerberater instead of reconstructed in a panic.
            </p>

            <div className="mt-8 space-y-4">
              {PAINS.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-3">
                  <div className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#0f766e]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">{title}</p>
                    <p className="text-sm leading-relaxed text-[#475569]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-xl bg-[#0f766e] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#115e59]"
              >
                Start organizing free
              </Link>
              <Link
                to="/creator-records"
                className="inline-flex items-center justify-center rounded-xl border border-[#0f766e] px-6 py-3.5 text-sm font-bold text-[#0f766e] transition hover:bg-[#ecfdf5]"
              >
                Open the tool
              </Link>
            </div>
            <p className="mt-3 text-xs text-[#64748b]">
              Preparation tool only. It does not calculate tax, decide tax treatment, or replace qualified advice.
            </p>
          </section>

          {/* ── Lead form: match with a Steuerberater ──────────── */}
          <section className="rounded-3xl border border-[#dbe1d8] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8 lg:sticky lg:top-8">
            {done ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle className="h-12 w-12 text-[#0f766e]" />
                <h2 className="mt-4 text-2xl font-black text-[#0f172a]">You&apos;re in the queue.</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                  Check your inbox for a confirmation. We&apos;ll aim to connect you with an English-speaking Steuerberater
                  for creators within 24–48 business hours. In the meantime, start logging your records free.
                </p>
                <Link to="/signup" className="mt-5 text-sm font-bold text-[#0f766e] hover:underline">
                  Create your free account →
                </Link>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-[#0f172a]">Want a tax advisor for creators?</h2>
                <p className="mt-1 text-sm text-[#475569]">
                  Get matched with a vetted English-speaking Steuerberater. Free to get matched — no obligation.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                  {/* honeypot: hidden from users, catches bots */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={onChange}
                    tabIndex={-1}
                    autoComplete="off"
                    className="hidden"
                    aria-hidden="true"
                  />

                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-semibold text-[#0f172a]">First name</label>
                    <input
                      id="name" name="name" type="text" value={form.name} onChange={onChange}
                      className="w-full rounded-xl border border-[#dbe1d8] px-4 py-3 text-sm outline-none ring-[#0f766e] focus:ring-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-semibold text-[#0f172a]">Email</label>
                    <input
                      id="email" name="email" type="email" value={form.email} onChange={onChange}
                      className="w-full rounded-xl border border-[#dbe1d8] px-4 py-3 text-sm outline-none ring-[#0f766e] focus:ring-2"
                    />
                  </div>

                  {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

                  <button
                    type="submit" disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#0f766e] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loading ? 'Sending…' : 'Match me with an advisor'}
                  </button>

                  <p className="flex items-center gap-1.5 text-xs text-[#64748b]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#0f766e]" />
                    We only use your details to connect you. See our{' '}
                    <Link to="/privacy-policy" className="font-semibold text-[#0f766e] hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              </>
            )}
          </section>
        </div>

        {/* ── FAQ (native details — no JS, no dependency) ──────── */}
        <section className="mx-auto mt-16 max-w-2xl">
          <h2 className="text-center text-2xl font-black text-[#0f172a]">Common questions</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group rounded-2xl border border-[#dbe1d8] bg-white px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-bold text-[#0f172a]">
                  {q}
                  <span className="ml-4 text-[#0f766e] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Tiny back link ───────────────────────────────────── */}
        <div className="mt-14 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748b] transition hover:text-[#0f766e]">
            <ArrowLeft className="h-3.5 w-3.5" />
            Looking for free tools &amp; guides instead? Visit our main site
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CreatorTaxesPage;
