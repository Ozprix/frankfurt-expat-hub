import React from 'react';
import SEOHead from '@/components/SEOHead';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using frankfurtexpatservices.com, you agree to these Terms of Service. If you disagree with any part, please discontinue use of the site.',
  },
  {
    title: '2. Description of Service',
    body: 'We provide free browser-based tools, an English-speaking service directory, and business listing opportunities for professionals serving Frankfurt expats.',
  },
	  {
	    title: '3. Free Tools Usage',
	    body: 'Our tools are provided "as is" for personal and lawful use. Free account access may be required. You agree not to automate abusive access, infringe intellectual property, scrape protected areas, bypass access controls, or misuse the platform.',
	  },
  {
    title: '4. Service Directory',
    body: 'The directory is informational. We do not guarantee provider availability, licensing, outcomes, or commercial results from third-party engagements. Users should verify providers before entering into any contract.',
  },
  {
    title: '5. Business Listings',
    body: 'Businesses submitting listings must provide accurate information, hold the rights to submitted names, logos, descriptions, and images, and comply with local regulations. We may decline or remove listings at our discretion.',
  },
  {
    title: '6. Housing Resources',
    body: 'Housing resources are provided as original guidance and outbound links. We do not broker rental contracts, copy third-party apartment listings, guarantee availability, or verify landlord identity.',
  },
  {
    title: '7. No Professional Advice',
    body: 'Content and tools are general information only and are not legal, tax, immigration, financial, medical, insurance, or real-estate brokerage advice. Verify important decisions with official authorities or qualified professionals.',
  },
	  {
	    title: '8. Sponsored And Affiliate Content',
	    body: 'If paid placements, affiliate links, sponsored recommendations, or advertisements are introduced, they must be clearly labelled as Sponsored, Advertisement, or Affiliate before users click. Sponsored status may affect placement or visibility only where a clear label appears. Listings should not be interpreted as endorsements unless expressly stated.',
	  },
	  {
	    title: '9. Forum And User Content',
	    body: 'Forum posts, replies, reviews, listing submissions, and profile content remain the responsibility of the submitting user. By submitting content, you confirm that you have the right to post it and grant Frankfurt Expat Services a non-exclusive, worldwide, royalty-free licence to host, display, moderate, edit for formatting, and remove that content as needed to operate the platform.',
	  },
	  {
	    title: '10. Moderation Rules',
	    body: 'We may remove, hide, down-rank, or hold for review content that is unlawful, misleading, defamatory, discriminatory, spam-like, promotional without permission, privacy-invasive, or irrelevant to Frankfurt relocation. We may suspend accounts used for abuse, repeated spam, impersonation, or attempts to evade moderation. User-submitted links may be marked with rel="ugc" or similar attributes.',
	  },
	  {
	    title: '11. Intellectual Property',
	    body: 'All platform content, including design, code, and copy, is owned by Frankfurt Expat Services or its licensors and may not be reused without permission.',
	  },
	  {
	    title: '12. Limitation of Liability',
	    body: 'Frankfurt Expat Services is not liable for direct or indirect losses arising from site usage, service interruptions, or reliance on third-party listings.',
	  },
	  {
	    title: '13. Indemnification',
	    body: 'You agree to indemnify Frankfurt Expat Services and its team from claims resulting from your use of the site or violation of these terms.',
	  },
	  {
	    title: '14. Modifications',
	    body: 'We may update these terms periodically. Continued use after updates constitutes acceptance of the revised terms.',
	  },
	  {
	    title: '15. Governing Law',
	    body: 'These terms are governed by the laws of Germany. Disputes fall under the jurisdiction of courts in Frankfurt am Main.',
	  },
];

const TermsPage = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service | Frankfurt Expat Services"
        description="Terms of service covering use of tools, directory listings, and community features on Frankfurt Expat Services."
        canonical="/terms"
      />

      <div className="bg-[#f3f4ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-12">
          <h1 className="text-4xl font-black text-[#0f172a]">Terms of Service</h1>
          <p className="mt-3 text-sm text-[#64748b]">Last updated: April 2026</p>

          <div className="mt-8 space-y-7">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-black text-[#0f172a]">{section.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">{section.body}</p>
              </section>
            ))}
          </div>

          <section className="mt-8 border-t border-[#e5e7eb] pt-7">
	            <h2 className="text-xl font-black text-[#0f172a]">16. Contact</h2>
            <p className="mt-2 text-sm text-[#475569]">Questions about these terms can be sent to legal@frankfurtexpatservices.com.</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
