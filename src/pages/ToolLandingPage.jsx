/**
 * ToolLandingPage.jsx
 * Public SEO landing page for each tool.
 * Explains the tool, answers FAQs, then CTAs to /tools (or signup gate).
 * Route: /tools/:toolSlug
 */

import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronRight } from '@/lib/icons';
import SEOHead from '@/components/SEOHead';
import { schemaFAQ, schemaBreadcrumb, schemaSoftwareApp } from '@/utils/structuredData';
import { getToolPageBySlug } from '@/data/toolLandingPages';
import { useAuth } from '@/context/AuthContext';

/* ── FAQ accordion ───────────────────────────────────────────────────────── */
const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-[#e5e7eb] last:border-0">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 py-4 text-left"
      aria-expanded={isOpen}
    >
      <span className="text-sm font-bold text-[#0f172a]">{question}</span>
      <ChevronDown
        className={`h-4 w-4 shrink-0 text-[#64748b] transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && <p className="pb-4 text-sm leading-relaxed text-[#475569]">{answer}</p>}
  </div>
);

/* ── Main component ──────────────────────────────────────────────────────── */
const ToolLandingPage = () => {
  const { toolSlug } = useParams();
  const tool = getToolPageBySlug(toolSlug);
  const [openFaq, setOpenFaq] = useState(0);
  const { isAuthenticated } = useAuth();

  if (!tool) return <Navigate to="/tools" replace />;

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
    { name: tool.heading, path: `/tools/${tool.slug}` },
  ];

  return (
    <>
      <SEOHead
        title={tool.title}
        description={tool.metaDescription}
        canonical={`/tools/${tool.slug}`}
      >
        <script type="application/ld+json">
          {JSON.stringify(schemaBreadcrumb(breadcrumbs))}
        </script>
        {tool.faqs?.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify(schemaFAQ(tool.faqs))}
          </script>
        )}
        <script type="application/ld+json">
          {JSON.stringify(schemaSoftwareApp())}
        </script>
      </SEOHead>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <div className="bg-[#f3f4ef] px-4 pb-14 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f766e] hover:text-[#115e59]"
          >
            <ArrowLeft className="h-4 w-4" />
            All free tools
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <span className="text-4xl" aria-hidden="true">{tool.icon}</span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">Free Tool</p>
              <h1 className="mt-2 text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl">
                {tool.heading}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#475569]">
                {tool.tagline}
              </p>
            </div>
          </div>

          {/* Primary CTA — jump straight to the tool */}
	          <Link
	            to={isAuthenticated ? `/tools#${tool.toolId}` : '/signup'}
	            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#0f766e] px-6 py-3 text-sm font-bold text-white shadow hover:bg-[#115e59]"
	          >
	            {isAuthenticated ? 'Use the tool now' : 'Create free account to use tool'} <ArrowRight className="h-4 w-4" />
	          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_260px]">

          {/* ── Main column ──────────────────────────────────────────────── */}
          <div>
            {/* Explainer questions */}
            {tool.questions?.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-[#0f172a]">What you need to know</h2>
                <div className="mt-6 space-y-8">
                  {tool.questions.map((q) => (
                    <div key={q.heading}>
                      <h3 className="text-lg font-black text-[#0f172a]">{q.heading}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#475569]">{q.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Signup CTA mid-page */}
            <div className="my-10 rounded-xl border border-[#dbe1d8] bg-[#ecfdf5] p-6">
              <h3 className="text-lg font-black text-[#0f172a]">{tool.ctaHeading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#475569]">{tool.ctaBody}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0f766e] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#115e59]"
                >
                  Create free account <ArrowRight className="h-4 w-4" />
                </Link>
	                <Link
	                  to={isAuthenticated ? `/tools#${tool.toolId}` : '/login'}
	                  className="inline-flex items-center gap-2 rounded-lg border border-[#0f766e] px-5 py-2.5 text-sm font-bold text-[#0f766e] hover:bg-[#f0fdf4]"
	                >
	                  {isAuthenticated ? 'Open tool' : 'Log in to use tool'}
	                </Link>
              </div>
            </div>

            {/* FAQ section */}
            {tool.faqs?.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-[#0f172a]">Frequently asked questions</h2>
                <div className="mt-5 rounded-xl border border-[#dbe1d8] bg-white px-6">
                  {tool.faqs.map((faq, i) => (
                    <FAQItem
                      key={i}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openFaq === i}
                      onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-5">
            {/* Use the tool */}
            <div className="rounded-xl bg-[#0c2622] p-6 text-white">
              <span className="text-3xl" aria-hidden="true">{tool.icon}</span>
              <h3 className="mt-3 text-lg font-black">Try it now</h3>
	              <p className="mt-2 text-sm text-[#94a3b8]">
	                Free with an account. Sensitive inputs stay in your browser.
	              </p>
	              <Link
	                to={isAuthenticated ? `/tools#${tool.toolId}` : '/signup'}
	                className="mt-4 block rounded-lg bg-[#0f766e] px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-[#0d9488]"
	              >
	                {isAuthenticated ? 'Open tool' : 'Create account'}
	              </Link>
              <Link
                to="/signup"
                className="mt-2 block rounded-lg border border-[#1e3a35] px-4 py-2.5 text-center text-sm font-medium text-[#94a3b8] hover:text-white"
              >
                Create free account
              </Link>
            </div>

            {/* Related directory */}
            {tool.relatedDirectory && (
              <div className="rounded-xl border border-[#dbe1d8] bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#64748b]">Expert help</p>
                <Link
                  to={tool.relatedDirectory.path}
                  className="mt-3 flex items-center gap-1.5 text-sm font-bold text-[#0f766e] hover:text-[#115e59]"
                >
                  <ChevronRight className="h-4 w-4 shrink-0" />
                  {tool.relatedDirectory.label}
                </Link>
              </div>
            )}

            {/* Related blog */}
            {tool.relatedBlog?.length > 0 && (
              <div className="rounded-xl border border-[#dbe1d8] bg-white p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#64748b]">Related guides</p>
                <ul className="mt-3 space-y-2">
                  {tool.relatedBlog.map((post) => (
                    <li key={post.slug}>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="flex items-start gap-1.5 text-sm font-medium text-[#0f766e] hover:text-[#115e59]"
                      >
                        <ChevronRight className="mt-0.5 h-4 w-4 shrink-0" />
                        {post.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Other tools */}
            <div className="rounded-xl border border-[#dbe1d8] bg-white p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#64748b]">All free tools</p>
              <Link
                to="/tools"
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#475569] hover:text-[#0f172a]"
              >
                <ArrowLeft className="h-4 w-4" />
                Browse all tools
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default ToolLandingPage;
