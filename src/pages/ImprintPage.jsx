import React from 'react';
import SEOHead from '@/components/SEOHead';

const ImprintPage = () => {
  return (
    <>
	      <SEOHead
	        title="Imprint | Frankfurt Expat Services"
	        description="Legal imprint and company information for Frankfurt Expat Services."
	        canonical="/imprint"
	      />

      <div className="bg-[#f3f4ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-12">
          <h1 className="text-4xl font-black text-[#0f172a]">Imprint</h1>
          <p className="mt-3 text-sm text-[#64748b]">
            Information required under § 5 DDG (German Digital Services Act)
          </p>

	          <div className="mt-10 space-y-8">
	            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
	              <h2 className="text-xl font-black text-amber-950">Address Notice</h2>
	              <p className="mt-3 text-sm leading-relaxed text-amber-950">
	                Frankfurt Expat Services is operated as a registered solo online side business. A separate
	                public business office is not currently maintained. A serviceable postal address will be added
	                when a privacy-preserving business address is available.
	              </p>
	            </section>

	            <section>
	              <h2 className="text-xl font-black text-[#0f172a]">Service Provider</h2>
	              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
	                Frankfurt Expat Services<br />
	                Michael K. A., sole proprietor<br />
	                Frankfurt am Main<br />
	                Germany
	              </p>
	            </section>

            <section>
              <h2 className="text-xl font-black text-[#0f172a]">Contact</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                Email: hello@frankfurtexpatservices.com
              </p>
            </section>

	            <section>
	              <h2 className="text-xl font-black text-[#0f172a]">Responsible for Content</h2>
	              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
	                Michael K. A.<br />
	                Frankfurt Expat Services
	              </p>
	            </section>

	            <section>
	              <h2 className="text-xl font-black text-[#0f172a]">Commercial Register</h2>
	              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
	                Not entered in the commercial register.
	              </p>
	            </section>

	            <section>
	              <h2 className="text-xl font-black text-[#0f172a]">VAT Identification Number</h2>
	              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
	                DE460747696
	              </p>
	            </section>

            <section>
              <h2 className="text-xl font-black text-[#0f172a]">Disclaimer</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                The content of this website has been compiled with care and to the best of our knowledge.
                We cannot assume liability for the accuracy, completeness, or up-to-dateness of any page.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                Frankfurt Expat Services provides tools and directory information only. We do not provide
                legal, tax, or financial advice. All information should be verified with official authorities
                or qualified professionals.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                Housing resources are informational links and original guidance only. We do not broker
                rental contracts, republish third-party apartment listings, or guarantee availability,
                suitability, pricing, or landlord identity.
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
};

export default ImprintPage;
