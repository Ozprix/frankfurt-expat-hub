import React, { useState, useMemo, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from '@/lib/icons';
import { blogPosts as staticBlogPosts } from '@/data/blogPosts';
import { fetchAllPosts } from '@/services/contentful';

/* ── Category tabs config ─────────────────────────────────────────────────── */
const CATEGORIES = [
  { label: 'All guides',          value: 'all' },
  { label: 'Bureaucracy',         value: 'Bureaucracy' },
  { label: 'Housing',             value: 'Housing' },
  { label: 'Banking',             value: 'Banking' },
  { label: 'Tax',                 value: 'Tax' },
  { label: 'Healthcare',          value: 'Healthcare' },
  { label: 'Insurance',           value: 'Insurance' },
  { label: 'Visa & Work',         value: 'Visa' },
];

/* ── Card components ──────────────────────────────────────────────────────── */
const BlogCard = ({ post }) => (
  <article className="overflow-hidden rounded-lg border border-[#dbe1d8] bg-white">
    <img src={post.imageUrl} alt={post.imageAlt} className="h-52 w-full object-cover" loading="lazy" />
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wide text-[#64748b]">
        <span className="text-[#0f766e]">{post.category}</span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date(post.date).toLocaleDateString()}
        </span>
        <span>{post.readingTime}</span>
      </div>
      <h2 className="mt-3 text-2xl font-black text-[#0f172a]">{post.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#475569]">{post.description}</p>
      <Link
        to={`/blog/${post.slug}`}
        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0f766e] transition hover:text-[#115e59]"
      >
        Read guide
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </article>
);

const FeaturedCard = ({ post }) => (
  <article className="overflow-hidden rounded-lg border border-[#dbe1d8] bg-white">
    <div className="grid md:grid-cols-[0.95fr_1.05fr]">
      <img src={post.imageUrl} alt={post.imageAlt} className="h-full min-h-[320px] w-full object-cover" />
      <div className="p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">Start Here</p>
        <h2 className="mt-3 text-3xl font-black text-[#0f172a]">{post.title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-[#475569]">{post.description}</p>
        <Link
          to={`/blog/${post.slug}`}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#0f766e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#115e59]"
        >
          Read guide
        </Link>
      </div>
    </div>
  </article>
);

/* ── Main component ───────────────────────────────────────────────────────── */
const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [posts, setPosts] = useState(staticBlogPosts);
  const [loadingCms, setLoadingCms] = useState(true);

  // Attempt to hydrate from Contentful; fall back silently to static data
  useEffect(() => {
    let cancelled = false;
    fetchAllPosts().then((livePosts) => {
      if (!cancelled && livePosts && livePosts.length > 0) {
        // Merge: Contentful posts first, then any static posts whose slug
        // isn't already in Contentful (keeps existing URLs working)
        const ctfSlugs = new Set(livePosts.map((p) => p.slug));
        const staticOnly = staticBlogPosts.filter((p) => !ctfSlugs.has(p.slug));
        setPosts([...livePosts, ...staticOnly]);
      }
      if (!cancelled) setLoadingCms(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'all') return posts;
    return posts.filter((p) => p.category === activeCategory);
  }, [posts, activeCategory]);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);
  const isAllView = activeCategory === 'all';

  return (
    <>
      <SEOHead
        title="Frankfurt Expat Guides & Relocation Tips | Frankfurt Expat Services"
        description="Practical guides for expats moving to Frankfurt: Anmeldung appointments, German salary calculation, health insurance, neighbourhood comparisons, and more."
        canonical="/blog"
      />

      <main className="bg-[#f3f4ef] text-[#0f172a]">
        {/* ── Page header ─────────────────────────────────────────────── */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0f766e]">Frankfurt Guides</p>
            <div className="mt-4 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-black leading-tight text-[#0f172a] sm:text-5xl">
                  Practical answers for your first months in Frankfurt.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
                  Step-by-step guides for registration, housing, tax, and everyday setup, written for international residents.
                </p>
              </div>
              {isAllView && posts[0] && (
                <img
                  src={posts[0].imageUrl}
                  alt={posts[0].imageAlt}
                  className="h-72 w-full rounded-lg object-cover shadow-sm"
                />
              )}
            </div>
          </div>
        </section>

        {/* ── Category filter tabs ─────────────────────────────────────── */}
        <div className="sticky top-0 z-10 border-b border-[#dbe1d8] bg-[#f3f4ef]/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <nav
              className="flex gap-0 overflow-x-auto scrollbar-none"
              aria-label="Blog categories"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`shrink-0 border-b-2 px-4 py-3.5 text-sm font-bold transition-colors ${
                    activeCategory === cat.value
                      ? 'border-[#0f766e] text-[#0f766e]'
                      : 'border-transparent text-[#64748b] hover:text-[#0f172a]'
                  }`}
                  aria-current={activeCategory === cat.value ? 'page' : undefined}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Posts grid ──────────────────────────────────────────────── */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {filteredPosts.length === 0 ? (
              <div className="rounded-xl border border-[#dbe1d8] bg-white p-12 text-center">
                <p className="text-sm font-semibold text-[#475569]">No guides in this category yet. Check back soon.</p>
              </div>
            ) : isAllView ? (
              /* "All" layout: featured hero + side grid */
              <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                {featuredPost && <FeaturedCard post={featuredPost} />}
                <div className="grid gap-6">
                  {remainingPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            ) : (
              /* Category layout: uniform 3-column grid */
              <>
                <p className="mb-6 text-sm font-semibold text-[#64748b]">
                  {filteredPosts.length} guide{filteredPosts.length !== 1 ? 's' : ''} in this category
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default BlogPage;
