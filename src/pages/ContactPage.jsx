import React, { useMemo, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { Handshake, Inbox, Loader2, Mail } from '@/lib/icons';
import { Link } from 'react-router-dom';
import { useContactForm } from '@/hooks/useContactForm';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

const ContactPage = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { loading, submitContactForm } = useContactForm();

  const fallbackMailto = useMemo(() => {
    const body = [
      `Name: ${form.name || '[Your name]'}`,
      `Email: ${form.email || '[Your email]'}`,
      `Subject: ${form.subject || '[Subject]'}`,
      '',
      form.message || '[Your message]',
    ].join('\n');

    return `mailto:hello@frankfurtexpatservices.com?subject=${encodeURIComponent(`Contact Form: ${form.subject || 'General Inquiry'}`)}&body=${encodeURIComponent(body)}`;
  }, [form]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.subject || !form.message) {
      setError('Please complete all fields before sending.');
      return;
    }

    setError('');
    setSuccess('');

    const result = await submitContactForm({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
      source: 'contact-page',
    });

    if (!result.success) {
      setError(`${result.message} You can use direct email fallback below.`);
      return;
    }

    setSuccess('Thanks. Your message has been submitted and we will respond within 24-48 business hours.');
    setForm(initialForm);
  };

  return (
    <>
      <SEOHead
        title="Contact Us | Frankfurt Expat Services"
        description="Get in touch with Frankfurt Expat Services for tool support, listing requests, partnerships, or general relocation questions."
        canonical="/contact"
      />

      <div className="bg-[#f3f4ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Contact</p>
            <h1 className="mt-3 text-4xl font-black text-[#0f172a]">Let&apos;s build your Frankfurt plan together</h1>
            <p className="mt-4 text-sm text-[#475569]">Reach out for tool support, provider listings, or partnership ideas.</p>

            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-semibold text-[#0f172a]">Name</label>
                <input id="name" name="name" type="text" value={form.name} onChange={onChange} className="w-full rounded-xl border border-[#dbe1d8] px-4 py-3 text-sm outline-none ring-[#0f766e] focus:ring-2" />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-semibold text-[#0f172a]">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} className="w-full rounded-xl border border-[#dbe1d8] px-4 py-3 text-sm outline-none ring-[#0f766e] focus:ring-2" />
              </div>

              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-semibold text-[#0f172a]">Subject</label>
                <select id="subject" name="subject" value={form.subject} onChange={onChange} className="w-full rounded-xl border border-[#dbe1d8] px-4 py-3 text-sm outline-none ring-[#0f766e] focus:ring-2">
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="List My Business">List My Business</option>
                  <option value="Tool Support">Tool Support</option>
                  <option value="Partnership Opportunity">Partnership Opportunity</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="mb-1 block text-sm font-semibold text-[#0f172a]">Message</label>
                <textarea id="message" name="message" rows="5" value={form.message} onChange={onChange} className="w-full rounded-xl border border-[#dbe1d8] px-4 py-3 text-sm outline-none ring-[#0f766e] focus:ring-2" />
              </div>

              {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
              {success && <p className="text-sm font-semibold text-emerald-700">{success}</p>}

              <button type="submit" disabled={loading} className="inline-flex items-center rounded-xl bg-[#0f766e] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-70">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Sending...' : 'Send message'}
              </button>

              <p className="text-xs leading-relaxed text-[#64748b]">
                By sending this message, you allow us to process your details to respond to your request. See our{' '}
                <Link to="/privacy-policy" className="font-semibold text-[#0f766e] underline-offset-2 hover:underline">
                  Privacy Policy
                </Link>.
              </p>
            </form>
          </section>

          <aside className="space-y-4">
            <article className="rounded-3xl border border-[#dbe1d8] bg-white p-6">
              <div className="inline-flex rounded-xl bg-[#ecfdf5] p-3 text-[#0f766e]">
                <Inbox className="h-5 w-5" />
              </div>
              <h2 className="mt-3 text-xl font-black text-[#0f172a]">Contact details</h2>
              <p className="mt-3 text-sm text-[#475569]"><strong>Email:</strong><br />hello@frankfurtexpatservices.com</p>
              <p className="mt-3 text-sm text-[#475569]"><strong>Response time:</strong><br />24-48 business hours</p>
              <a href={fallbackMailto} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#dbe1d8] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#334155] hover:bg-[#f8fafc]">
                <Mail className="h-3.5 w-3.5" />
                Email fallback
              </a>
            </article>

            <article className="rounded-3xl border border-[#dbe1d8] bg-white p-6">
              <div className="inline-flex rounded-xl bg-[#fff7ed] p-3 text-[#c2410c]">
                <Handshake className="h-5 w-5" />
              </div>
              <h2 className="mt-3 text-xl font-black text-[#0f172a]">Partnerships</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">We are onboarding verified partners in tax, relocation, legal, and financial categories.</p>
            </article>
          </aside>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
