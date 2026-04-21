import React from 'react';
import SEOHead from '@/components/SEOHead';
import { Bolt, ShieldCheck, Users } from '@/lib/icons';

const AboutPage = () => {
  const values = [
    {
      title: 'Trust first',
      description: 'Every provider we feature is vetted for English proficiency, transparency, and proven expat experience.',
      icon: ShieldCheck,
    },
    {
      title: 'Speed to clarity',
      description: 'Our browser-based tools are built for quick answers after signup, with saved progress and no unnecessary friction.',
      icon: Bolt,
    },
    {
      title: 'Community input',
      description: 'We collect feedback from Frankfurt newcomers and continuously refine the platform based on real relocation pain points.',
      icon: Users,
    },
  ];

  return (
    <>
      <SEOHead
        title="About Us | Frankfurt Expat Services"
        description="Learn how Frankfurt Expat Services helps international residents navigate German bureaucracy with free tools and a vetted directory of English-speaking service partners."
        canonical="/about"
      />

      <div className="bg-[#f3f4ef] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          <section className="rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">About</p>
            <h1 className="mt-3 text-4xl font-black text-[#0f172a] sm:text-5xl">Helping Frankfurt&apos;s international community thrive</h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#475569]">
              Frankfurt Expat Services is built by expats for expats. We combine free professional tools with a curated network of English-speaking specialists so newcomers can settle in with confidence.
            </p>
          </section>

          <section className="rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-12">
            <h2 className="text-2xl font-black text-[#0f172a]">Our Story</h2>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              We launched Frankfurt Expat Services in 2025 after facing the same challenge many international residents encounter: translating Germany&apos;s complex systems into clear, confident action. Our team has lived the relocation journey, from tax appointments and housing to bank setup and registration.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              The mission is simple: reduce uncertainty and connect people to vetted support when they need human help.
            </p>
          </section>

          <section className="rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-12">
            <h2 className="text-2xl font-black text-[#0f172a]">What Drives Us</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              {values.map((value) => (
                <article key={value.title} className="rounded-2xl border border-[#e5e7eb] bg-[#fafaf7] p-5">
                  <div className="inline-flex rounded-xl bg-[#ecfdf5] p-3 text-[#0f766e]">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[#0f172a]">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">{value.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#dbe1d8] bg-white p-8 sm:p-12">
            <h2 className="text-2xl font-black text-[#0f172a]">Looking Ahead</h2>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              We&apos;re investing in deeper resources, including relocation playbooks, visa workflows, and partnerships across finance, health, and education.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#475569]">
              If you&apos;re an English-speaking professional serving expats in Frankfurt, we&apos;d love to hear from you.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
