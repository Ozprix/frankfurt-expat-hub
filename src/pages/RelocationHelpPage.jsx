import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useContactForm } from '@/hooks/useContactForm';
import { ArrowLeft, BadgeCheck, Banknote, CheckCircle, Loader2, MapPin, ShieldCheck } from '@/lib/icons';

// Distraction-free landing page for paid/organic referral traffic.
// ponytail: reuses the existing `contact-form` edge function (DB insert + admin
// alert + auto-reply) via source='relocation-help'. No new table/function until
// lead volume justifies a dedicated `leads` table + dashboard.

const NEEDS = [
  'Visa / Anmeldung & paperwork',
  'Apartment hunting',
  'Tax / finance setup',
  'Banking & insurance',
  'Something else',
];

const TRUST = [
  { icon: BadgeCheck, title: '100% English-speaking', desc: 'No German required. Every specialist works fluently in English.' },
  { icon: MapPin, title: 'Local Frankfurt experts', desc: 'People who actually know the Bürgeramt, the districts, and the process.' },
  { icon: Banknote, title: 'Free to get matched', desc: 'Tell us what you need — getting connected costs you nothing.' },
];

const FAQ = [
  {
    q: 'How much does this cost?',
    a: 'Getting matched is free. Each specialist sets their own transparent fees, which they share with you up front before you commit to anything.',
  },
  {
    q: 'Who will I be connected with?',
    a: 'Vetted English-speaking relocation specialists, advisors, and service providers based in and around Frankfurt — matched to whatever you selected above.',
  },
  {
    q: 'How fast will I hear back?',
    a: 'You will get an email confirmation immediately, and we aim to connect you with the right specialist within 24–48 business hours.',
  },
];

const initialForm = { name: '', email: '', need: '', website: '' };

const RelocationHelpPage = () => {
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
    if (!form.name || !form.email || !form.need) {
      setError('Please add your first name, email, and what you need help with.');
      return;
    }

    const result = await submitContactForm({
      name: form.name,
      email: form.email,
      subject: `Relocation match request: ${form.need}`,
      message: `New relocation lead from /relocation-help.\nNeeds: ${form.need}`,
      source: 'relocation-help',
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
        title="Get Matched With a Vetted English-Speaking Frankfurt Expert"
        description="Relocating to Frankfurt? Tell us what you need — visa & Anmeldung, apartment hunting, or tax setup — and we'll connect you with a trusted English-speaking local specialist. Free."
        canonical="/relocation-help"
        noindex
      />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          {/* ── Pitch ──────────────────────────────────────────── */}
          <section>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Frankfurt Expat Services</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl">
              Relocating to Frankfurt? Get matched with a vetted English-speaking expert.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#475569]">
              Skip the confusing German paperwork and the guesswork. Tell us what you need — Anmeldung &amp; visa,
              apartment hunting, or tax setup — and we&apos;ll connect you with the right trusted local specialist.
            </p>

            <div className="mt-8 space-y-4">
              {TRUST.map(({ icon: Icon, title, desc }) => (
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
          </section>

          {/* ── Form ───────────────────────────────────────────── */}
          <section className="rounded-3xl border border-[#dbe1d8] bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8 lg:sticky lg:top-8">
            {done ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle className="h-12 w-12 text-[#0f766e]" />
                <h2 className="mt-4 text-2xl font-black text-[#0f172a]">You&apos;re matched into the queue.</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                  Check your inbox for a confirmation. We&apos;ll connect you with the right Frankfurt specialist
                  within 24–48 business hours.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-[#0f172a]">Get matched — free</h2>
                <p className="mt-1 text-sm text-[#475569]">Takes 30 seconds. No obligation.</p>

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

                  <div>
                    <label htmlFor="need" className="mb-1 block text-sm font-semibold text-[#0f172a]">What do you need help with?</label>
                    <select
                      id="need" name="need" value={form.need} onChange={onChange}
                      className="w-full rounded-xl border border-[#dbe1d8] px-4 py-3 text-sm outline-none ring-[#0f766e] focus:ring-2"
                    >
                      <option value="">Select one…</option>
                      {NEEDS.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>

                  {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

                  <button
                    type="submit" disabled={loading}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-[#0f766e] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loading ? 'Sending…' : 'Get my free match'}
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

export default RelocationHelpPage;
