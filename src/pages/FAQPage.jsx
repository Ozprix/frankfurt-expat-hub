import React, { useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { schemaFAQ } from '@/utils/structuredData';
import { ChevronDown } from '@/lib/icons';

const faqs = [
	  {
	    question: 'Are all tools on your website really free?',
	    answer:
	      'Yes. The planning tools are free, but you need a free account to use them. Public landing pages and guides remain readable without login.',
	  },
	  {
	    question: 'Do I need an account to use the calculators?',
	    answer:
	      'Yes. Calculator access now requires a free account so we can focus on real users, retention, and better saved planning workflows.',
	  },
  {
    question: 'How accurate is the German wage tax calculator?',
    answer:
      'It is an estimate using simplified 2025 assumptions for income tax, social insurance, church tax, and common contribution limits. It is useful for planning, but it is not binding tax, payroll, legal, or financial advice.',
  },
  {
    question: 'How do you verify service providers?',
    answer:
      'Each provider goes through manual review. We check English support quality, business credibility, relevant expat experience, transparent pricing, and responsiveness before listing.',
  },
  {
    question: 'How can I list my business?',
    answer:
      'Use the directory page and submit the listing form. We review submissions and respond within two business days when there is a fit for the current provider categories.',
  },
  {
    question: 'What categories are you onboarding?',
    answer:
      'We are prioritizing tax and accounting, housing and relocation, banking and financial planning, legal and visa support, healthcare, and insurance providers serving Frankfurt expats.',
  },
  {
    question: 'Can I receive new Frankfurt guides?',
    answer:
      'Yes. The homepage includes a guide updates form for upcoming salary negotiation, apartment visit, healthcare, banking, and bureaucracy guides. Newsletter-style updates remain an explicit opt-in.',
  },
  {
    question: 'Do you provide tax or legal advice?',
    answer:
      'No. We provide tools and curated connections to professionals. We do not provide legal, tax, or investment advice directly.',
  },
  {
    question: 'Is my personal information safe?',
    answer:
      'We collect only the information needed to respond to inquiries, process listing requests, and operate account features. Review the Privacy Policy page for details on data rights, retention, and contact options.',
  },
  {
    question: 'Who is Frankfurt Expat Services for?',
    answer:
      'The platform is built for international professionals, students, families, digital nomads, and service providers navigating Frankfurt relocation, bureaucracy, housing, finance, and local setup.',
  },
  {
    question: 'Do you only support expats in Frankfurt?',
    answer:
      'The directory focuses on Frankfurt-based providers, while the public tools can help anyone planning a move to Germany. Expansion to other German cities depends on community demand and partner coverage.',
  },
  {
    question: 'How can I contact you?',
    answer:
      'Use the Contact page or email hello@frankfurtexpatservices.com. We typically respond within 24-48 business hours.',
  },
  {
    question: 'How often do you update tools and directory listings?',
    answer:
      'Directory listings are updated as qualified partners join, and existing listings are reviewed regularly. Tools and guides receive rolling improvements as rules, user needs, and product coverage change.',
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <SEOHead
        title="FAQ | Frankfurt Expat Services"
        description="Answers about our free tools, service directory, verification process, and pricing for Frankfurt expats."
        canonical="/faq"
      >
        <script type="application/ld+json">{JSON.stringify(schemaFAQ(faqs))}</script>
      </SEOHead>

      <div className="bg-[#f3f4ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-12">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">FAQ</p>
          <h1 className="mt-3 text-4xl font-black text-[#0f172a] sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#475569]">
            Quick answers about our free toolkit, trusted directory, and how we support Frankfurt&apos;s expat community.
          </p>

          <div className="mt-8 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <article key={faq.question} className="rounded-2xl border border-[#e2e8f0] bg-[#fafaf7]">
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-[#0f172a] sm:text-base">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 text-[#0f766e] transition ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <p className="px-5 pb-5 text-sm leading-relaxed text-[#475569]">{faq.answer}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default FAQPage;
