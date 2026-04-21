import React from 'react';
import SEOHead from '@/components/SEOHead';

const privacySections = [
  {
    title: '1. Controller',
    body: [
      'Frankfurt Expat Services is responsible for this website. The full legal operator details must match the Imprint before public launch.',
      'Privacy requests can be sent to privacy@frankfurtexpatservices.com.',
    ],
  },
  {
    title: '2. Data We Collect',
    body: [
      'We collect information you submit through contact, forum, directory, housing-resource, guide-update, account, and profile workflows. This may include name, email address, subject, message, business name, provider category, account profile details, and submitted listing information.',
      'We may process technical and usage data such as browser type, device information, pages viewed, referral sources, form source labels, product events, timestamps, and security logs.',
    ],
  },
  {
    title: '3. Purposes And Legal Bases',
    body: [
      'We use submitted data to respond to requests, operate accounts and forum features, review provider submissions, maintain fraud and abuse controls, improve reliability, and comply with legal obligations.',
      'Where the GDPR applies, processing may rely on contract necessity, consent, legitimate interests, or legal obligations depending on the workflow. Legitimate interests include site security, abuse prevention, product improvement, and responding to voluntarily submitted inquiries.',
    ],
  },
  {
    title: '4. Forms, Forum, And Directory Submissions',
    body: [
      'Contact and lead forms are sent to us so we can reply. Do not submit confidential client details, special-category data, or documents unless we specifically request them.',
      'Forum posts and profile content may be visible to other users depending on the feature. Directory applicants confirm that submitted business details are accurate and may be prepared for public display after approval.',
    ],
  },
	  {
	    title: '5. Tools, Cookies, And Local Storage',
	    body: [
	      'The relocation tools require a free account. Salary calculator inputs and generated passwords are processed in your browser. Checklist progress, onboarding answers, document checklist status, and reminder preferences may be saved to your account so they work across devices.',
	      'The currency converter loads exchange-rate data from an external API. The QR generator sends the entered QR content to an external QR-code service to create the preview image, so sensitive information should not be entered there.',
	      'Non-essential analytics, advertising, affiliate tracking, or similar cookies and local storage should only be enabled after a valid consent choice where required. You can reopen the consent controls from Cookie Settings in the footer.',
	    ],
  },
	  {
	    title: '6. Service Providers And Recipients',
	    body: [
	      'We may use hosting, database, authentication, email, analytics, security, and support providers to operate the site. These providers process data only for the platform purposes described here.',
	      'Current and planned processors include Vercel for hosting and deployment, Supabase for authentication, database, storage, and edge functions, and email providers such as Resend, Brevo, Postmark, or an SMTP relay if transactional emails are enabled. Stripe code remains paused, but Stripe may be used later if paid checkout returns.',
	      'Analytics providers, advertising networks, affiliate platforms, and remarketing pixels are not treated as essential. They should only load after the relevant consent choice allows them.',
	      'We do not sell personal data. We may disclose data if required by law, to enforce our rights, to protect users, or as part of a business transfer with appropriate safeguards.',
	    ],
	  },
  {
    title: '7. Third-Party Links And Housing Portals',
    body: [
      'The apartment page links to third-party housing portals. Their listings, contact flows, cookies, and privacy practices are controlled by those portals, not by Frankfurt Expat Services.',
      'We do not copy or republish third-party apartment photos, descriptions, prices, or availability data.',
    ],
  },
  {
    title: '8. Retention',
    body: [
      'We keep personal data only as long as needed for the purpose collected, unless a longer period is required for legal, accounting, security, fraud-prevention, or dispute-resolution reasons.',
      'You can ask us to delete or correct personal data where applicable law gives you that right.',
    ],
  },
  {
    title: '9. International Transfers',
    body: [
      'Some providers may process data outside Germany or the European Economic Area. Where required, we use appropriate safeguards such as adequacy decisions, standard contractual clauses, or equivalent transfer protections.',
    ],
  },
  {
    title: '10. Your Rights',
    body: [
      'Where the GDPR applies, you may have rights to access, rectification, erasure, restriction, data portability, objection, and withdrawal of consent. Withdrawal does not affect processing that happened before withdrawal.',
      'You also have the right to lodge a complaint with a competent data protection supervisory authority.',
    ],
  },
  {
    title: '11. Security',
    body: [
      'We use technical and organizational measures designed to protect personal data from unauthorized access, loss, misuse, or alteration. No internet service can be guaranteed to be completely secure.',
    ],
  },
  {
    title: '12. Sponsored Content And Ads',
    body: [
      'Directory placements are editorial unless clearly labelled otherwise. Sponsored placements, affiliate links, or advertisements should be clearly labelled as Sponsored, Advertisement, or Affiliate before a user clicks.',
      'Advertising and affiliate tracking should remain disabled unless the relevant consent choice allows it.',
    ],
  },
  {
    title: '13. Updates',
    body: [
      'We may update this policy as the platform changes. Material changes will be reflected by updating the date on this page.',
    ],
  },
];

const PrivacyPolicyPage = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Frankfurt Expat Services"
        description="How Frankfurt Expat Services collects, uses, and protects your personal data in line with GDPR."
        canonical="/privacy-policy"
      />

      <div className="bg-[#f3f4ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-12">
          <h1 className="text-4xl font-black text-[#0f172a]">Privacy Policy</h1>
          <p className="mt-3 text-sm text-[#64748b]">Last updated: April 15, 2026</p>

          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-xl font-black text-amber-950">Required Before Public Launch</h2>
	            <p className="mt-3 text-sm leading-relaxed text-amber-950">
	              Add the final legal controller details, confirm the exact processor list, confirm the
	              cookie/analytics configuration, and add data protection officer details if one is required.
	              This page is a stronger working draft, not a substitute for legal review.
	            </p>
          </div>

          <div className="mt-8 space-y-7 text-sm leading-relaxed text-[#475569]">
            {privacySections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-black text-[#0f172a]">{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-2">{paragraph}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
