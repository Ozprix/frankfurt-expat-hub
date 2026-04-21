import React, { useState } from 'react';
import { Loader2 } from '@/lib/icons';
import { Link } from 'react-router-dom';
import { useContactForm } from '@/hooks/useContactForm';

const baseFields = {
  name: '',
  email: '',
  company: '',
  category: '',
  message: '',
};

const inputClass =
  'w-full rounded-lg border border-[#dbe1d8] bg-white px-3 py-2 text-sm text-[#0f172a] outline-none ring-[#0f766e] focus:ring-2';

const LeadCaptureForm = ({
  intent,
  title,
  description,
  submitLabel = 'Send Request',
  compact = false,
  showCompany = false,
  showCategory = false,
  messageLabel = 'What should we know?',
  messagePlaceholder = 'Tell us what you need...',
}) => {
  const [fields, setFields] = useState(baseFields);
  const [status, setStatus] = useState({ type: '', message: '' });
  const { loading, submitContactForm } = useContactForm();

  const updateField = (event) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
    setStatus({ type: '', message: '' });
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!fields.email || (!compact && !fields.name)) {
      setStatus({ type: 'error', message: compact ? 'Enter your email address.' : 'Enter your name and email address.' });
      return;
    }

    const subject = `${intent}: ${fields.category || fields.company || fields.email}`;
    const result = await submitContactForm({
      name: fields.name || 'Website visitor',
      email: fields.email,
      subject,
      message: [
        fields.company ? `Company: ${fields.company}` : '',
        fields.category ? `Category: ${fields.category}` : '',
        fields.message ? `Message: ${fields.message}` : '',
      ].filter(Boolean).join('\n') || intent,
      source: intent,
    });

    if (!result.success) {
      setStatus({ type: 'error', message: `${result.message} Email hello@frankfurtexpatservices.com if this keeps happening.` });
      return;
    }

    setFields(baseFields);
    setStatus({ type: 'success', message: 'Thanks. We received your request and will follow up shortly.' });
  };

  return (
    <form onSubmit={submit} className="rounded-lg border border-[#dbe1d8] bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-xl font-black text-[#0f172a]">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-relaxed text-[#475569]">{description}</p> : null}
      </div>

      <div className={`mt-5 grid gap-3 ${compact ? 'sm:grid-cols-[1fr_auto]' : 'sm:grid-cols-2'}`}>
        {!compact ? (
          <div>
            <label htmlFor={`${intent}-name`} className="mb-1 block text-sm font-semibold text-[#0f172a]">Name</label>
            <input id={`${intent}-name`} name="name" type="text" value={fields.name} onChange={updateField} className={inputClass} autoComplete="name" />
          </div>
        ) : null}
        <div className={compact ? '' : undefined}>
          <label htmlFor={`${intent}-email`} className="mb-1 block text-sm font-semibold text-[#0f172a]">Email</label>
          <input id={`${intent}-email`} name="email" type="email" value={fields.email} onChange={updateField} className={inputClass} autoComplete="email" spellCheck={false} />
        </div>
        {compact ? (
          <button type="submit" disabled={loading} className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#0f766e] px-4 text-sm font-bold text-white transition-colors hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {submitLabel}
          </button>
        ) : null}
        {showCompany ? (
          <div>
            <label htmlFor={`${intent}-company`} className="mb-1 block text-sm font-semibold text-[#0f172a]">Business Name</label>
            <input id={`${intent}-company`} name="company" type="text" value={fields.company} onChange={updateField} className={inputClass} autoComplete="organization" />
          </div>
        ) : null}
        {showCategory ? (
          <div>
            <label htmlFor={`${intent}-category`} className="mb-1 block text-sm font-semibold text-[#0f172a]">Category</label>
            <select id={`${intent}-category`} name="category" value={fields.category} onChange={updateField} className={inputClass}>
              <option value="">Select a category</option>
              <option value="Tax & Accounting">Tax & Accounting</option>
              <option value="Housing & Relocation">Housing & Relocation</option>
              <option value="Banking & Financial Planning">Banking & Financial Planning</option>
              <option value="Legal & Visa Support">Legal & Visa Support</option>
              <option value="Healthcare & Insurance">Healthcare & Insurance</option>
              <option value="Other">Other</option>
            </select>
          </div>
        ) : null}
        {!compact ? (
          <div className="sm:col-span-2">
            <label htmlFor={`${intent}-message`} className="mb-1 block text-sm font-semibold text-[#0f172a]">{messageLabel}</label>
            <textarea
              id={`${intent}-message`}
              name="message"
              rows="4"
              value={fields.message}
              onChange={updateField}
              className={inputClass}
              placeholder={messagePlaceholder}
            />
          </div>
        ) : null}
      </div>

      {!compact ? (
        <button type="submit" disabled={loading} className="mt-4 inline-flex items-center rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {submitLabel}
        </button>
      ) : null}

      <p className="mt-3 text-xs leading-relaxed text-[#64748b]">
        By submitting this form, you allow us to process your details to respond to this request. See our{' '}
        <Link to="/privacy-policy" className="font-semibold text-[#0f766e] underline-offset-2 hover:underline">
          Privacy Policy
        </Link>.
      </p>

      {status.message ? (
        <p className={`mt-3 text-sm font-semibold ${status.type === 'error' ? 'text-red-600' : 'text-emerald-700'}`} aria-live="polite">
          {status.message}
        </p>
      ) : null}
    </form>
  );
};

export default LeadCaptureForm;
