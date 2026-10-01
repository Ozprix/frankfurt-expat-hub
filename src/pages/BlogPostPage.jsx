import React from 'react';
import SEOHead from '@/components/SEOHead';
import { schemaArticle, schemaHowTo } from '@/utils/structuredData';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays } from '@/lib/icons';
import { blogPosts as staticBlogPosts, getBlogPostBySlug } from '@/data/blogPosts';
import { fetchPostBySlug, fetchAllPosts } from '@/services/contentful';
import { supabaseClient } from '@/config/supabaseClient';
import PartnerOffersSection from '@/components/PartnerOffersSection';
import { findPartnerSlugsForText } from '@/utils/partnerReferrals';
import { getDirectoryCtaForPost } from '@/utils/directoryGuideCtas';

/* ── Related posts: same-category first, up to 4 total ──────────────────── */
const getRelatedPosts = (post, allPosts, count = 4) => {
  const sameCategory = allPosts.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  );
  const others = allPosts.filter(
    (p) => p.slug !== post.slug && p.category !== post.category
  );
  return [...sameCategory, ...others].slice(0, count);
};

/* ── Checklist slugs eligible for HowTo schema ──────────────────────────── */
const CHECKLIST_SLUGS = new Set([
  'anmeldung-frankfurt-checklist',
  'frankfurt-apartment-viewing-checklist',
]);

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = React.useState(() => getBlogPostBySlug(slug));
  const [allPosts, setAllPosts] = React.useState(staticBlogPosts);
  const [loadingPost, setLoadingPost] = React.useState(true);
  const [partners, setPartners] = React.useState([]);

  // Try Contentful first; fall back to static data
  React.useEffect(() => {
    let cancelled = false;
    setLoadingPost(true);
    Promise.all([fetchPostBySlug(slug), fetchAllPosts()]).then(([ctfPost, ctfAll]) => {
      if (cancelled) return;
      if (ctfPost) setPost(ctfPost);
      if (ctfAll && ctfAll.length > 0) {
        const ctfSlugs = new Set(ctfAll.map((p) => p.slug));
        const staticOnly = staticBlogPosts.filter((p) => !ctfSlugs.has(p.slug));
        setAllPosts([...ctfAll, ...staticOnly]);
      }
      setLoadingPost(false);
    });
    return () => { cancelled = true; };
  }, [slug]);

  React.useEffect(() => {
    if (!post) return undefined;
    let cancelled = false;

    const loadPartners = async () => {
      const text = [
        post.title,
        post.description,
        post.category,
        ...post.sections.map((section) => `${section.heading} ${section.body}`),
      ].join(' ');
      const partnerSlugs = findPartnerSlugsForText(text);
      if (!partnerSlugs.length) {
        setPartners([]);
        return;
      }

      const { data, error } = await supabaseClient
        .from('partner_referrals')
        .select('*')
        .eq('active', true)
        .in('slug', partnerSlugs)
        .order('display_order', { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error('Blog partner fetch error:', error);
        setPartners([]);
      } else {
        setPartners(data || []);
      }
    };

    loadPartners();

    return () => {
      cancelled = true;
    };
  }, [post]);

  // Still loading from Contentful — show spinner, avoid premature redirect
  if (!post && loadingPost) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#dbe1d8] border-t-[#0f766e]" />
      </div>
    );
  }

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedPosts = getRelatedPosts(post, allPosts);
  const isChecklist = CHECKLIST_SLUGS.has(post.slug);
  const directoryCta = getDirectoryCtaForPost(post);
  // ponytail: keyword match; swap for an explicit post.advisorCta flag if it misfires
  const showAdvisorCta = /rente|pension|retirement|insurance/i.test(`${post.category} ${post.title}`);
  const advisorMailto = `mailto:hello@frankfurtexpatservices.com?subject=${encodeURIComponent(`Intro call request: ${post.title}`)}`;

  return (
    <>
      <SEOHead
        title={`${post.title} | Frankfurt Expat Services`}
        description={post.description}
        canonical={`/blog/${post.slug}`}
        ogType="article"
        ogImage={post.imageUrl}
      >
        <script type="application/ld+json">
          {JSON.stringify(schemaArticle({
            title: post.title,
            description: post.description,
            slug: post.slug,
            datePublished: post.date,
            image: post.imageUrl,
          }))}
        </script>
        {isChecklist && (
          <script type="application/ld+json">
            {JSON.stringify(schemaHowTo({
              name: post.title,
              description: post.description,
              path: `/blog/${post.slug}`,
              steps: post.sections.map((s) => ({
                title: s.heading,
                description: s.body,
              })),
            }))}
          </script>
        )}
      </SEOHead>

      <main className="bg-[#f3f4ef] text-[#0f172a]">
        <article>
          <section className="px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#0f766e]">
                <ArrowLeft className="h-4 w-4" />
                Guides
              </Link>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">{post.category}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl">{post.title}</h1>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-semibold text-[#64748b]">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          </section>

          <img src={post.imageUrl} alt={post.imageAlt} className="h-[420px] w-full object-cover" />

          <section className="px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-9">
              <p className="text-xl font-semibold leading-relaxed text-[#334155]">{post.description}</p>
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-black text-[#0f172a]">{section.heading}</h2>
                  <p className="mt-3 text-base leading-8 text-[#475569]">{section.body}</p>
                </section>
              ))}

              {post.links && post.links.length > 0 && (
                <section className="rounded-xl border border-[#dbe1d8] bg-white p-6">
                  <h2 className="text-xl font-black text-[#0f172a]">Useful next steps</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {post.links.map((link) => (
                      <Link
                        key={`${link.href}-${link.label}`}
                        to={link.href}
                        className="inline-flex items-center justify-between gap-3 rounded-lg border border-[#e2e8f0] px-4 py-3 text-sm font-bold text-[#0f766e] transition hover:border-[#99f6e4] hover:bg-[#ecfdf5]"
                      >
                        {link.label}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {directoryCta ? (
                <section className="rounded-xl border border-[#99f6e4] bg-[#f0fdfa] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">When you need personal help</p>
                  <h2 className="mt-2 text-xl font-black text-[#0f172a]">Talk to an English-speaking specialist</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">Use our directory to compare service providers serving Frankfurt newcomers. Check credentials, scope, availability, and fees directly before you engage.</p>
                  <Link to={directoryCta.href} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#0f766e] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#115e59]">{directoryCta.label} <ArrowRight className="h-4 w-4" /></Link>
                </section>
              ) : null}

              {showAdvisorCta ? (
                <section className="rounded-xl border border-[#fde68a] bg-[#fffbeb] p-6">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b45309]">Personal guidance</p>
                  <h2 className="mt-2 text-xl font-black text-[#0f172a]">Book a free intro call</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">Questions about retirement planning, liability or other cover? Send us a short message about your situation and we will set up an intro call on Zoom.</p>
                  <a href={advisorMailto} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#b45309] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#92400e]">Message us your interest <ArrowRight className="h-4 w-4" /></a>
                </section>
              ) : null}

              <section className="rounded-xl border border-[#dbe1d8] bg-white p-6">
                <h2 className="text-xl font-black text-[#0f172a]">Questions or experiences to share?</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#475569]">Discuss this guide with other Frankfurt newcomers in our community forum.</p>
                <Link to="/forum/create" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0f766e] hover:text-[#115e59]">Start a discussion <ArrowRight className="h-4 w-4" /></Link>
              </section>

              <PartnerOffersSection
                partners={partners}
                sourcePage={`/blog/${post.slug}`}
                title="Offers related to this guide"
              />
            </div>
          </section>
        </article>

        {/* ── Related posts ─────────────────────────────────────────────── */}
        <section className="border-t border-[#d7ddd3] bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-[#0f172a]">More Frankfurt guides</h2>
              <Link
                to="/blog"
                className="hidden items-center gap-1.5 text-sm font-bold text-[#0f766e] hover:text-[#115e59] sm:inline-flex"
              >
                All guides <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="flex flex-col rounded-lg border border-[#dbe1d8] bg-[#f8faf8] p-5 transition hover:border-[#b6cfc9] hover:bg-white"
                >
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f766e]">{related.category}</p>
                  <h3 className="mt-2 flex-1 text-base font-black leading-snug text-[#0f172a]">{related.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748b] line-clamp-2">{related.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0f766e]">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>

            <Link
              to="/blog"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-[#0f766e] hover:text-[#115e59] sm:hidden"
            >
              View all guides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default BlogPostPage;
