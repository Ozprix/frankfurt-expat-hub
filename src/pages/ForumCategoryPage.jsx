import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from '@/lib/icons';
import SEOHead from '@/components/SEOHead';
import ForumPostCard from '@/components/ForumPostCard';
import { getForumCategoryBySlug } from '@/data/forumCategories';
import { forumPostsData } from '@/data/forumPostsData';
import { supabaseClient } from '@/config/supabaseClient';
import { schemaBreadcrumb } from '@/utils/structuredData';
import { useAuth } from '@/context/AuthContext';

const ForumCategoryPage = () => {
  const { categorySlug } = useParams();
  const category = getForumCategoryBySlug(categorySlug);
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!category) return;
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseClient
        .from('forum_posts')
        .select('*, forum_categories(name)')
        .order('created_at', { ascending: false })
        .limit(30);

      const keywords = category.keywords.map((keyword) => keyword.toLowerCase());
      const categoryFallbackPosts = forumPostsData
        .filter((post) => {
          const haystack = `${post.category} ${post.title} ${post.content}`.toLowerCase();
          return keywords.some((keyword) => haystack.includes(keyword));
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (fetchError) {
        console.error('Forum category fetch error:', fetchError);
        setError(null);
        setPosts(categoryFallbackPosts);
      } else {
        const livePosts = (data || [])
          .map((post) => ({
            ...post,
            category: post.forum_categories?.name || 'General',
          }))
          .filter((post) => {
            const haystack = `${post.category} ${post.title} ${post.content}`.toLowerCase();
            return keywords.some((keyword) => haystack.includes(keyword));
          });
        setPosts(livePosts.length ? livePosts : categoryFallbackPosts);
      }

      setLoading(false);
    };

    fetchPosts();
  }, [category]);

  const noindex = !loading && posts.length < 2;
  const breadcrumbs = useMemo(() => category ? [
    { name: 'Home', path: '/' },
    { name: 'Forum', path: '/forum' },
    { name: category.name, path: `/forum/${category.slug}` },
  ] : [], [category]);

  if (!category) return <Navigate to="/forum" replace />;

  return (
    <>
      <SEOHead
        title={category.title}
        description={category.description}
        canonical={`/forum/${category.slug}`}
        noindex={noindex}
      >
        <script type="application/ld+json">
          {JSON.stringify(schemaBreadcrumb(breadcrumbs))}
        </script>
      </SEOHead>

      <main className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/forum"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            <ArrowLeft className="h-4 w-4" />
            All forum categories
          </Link>

          <section className="mt-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Forum Category</p>
            <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-black leading-tight text-gray-900">{category.name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">{category.description}</p>
              </div>
              <Link
                to={isAuthenticated ? '/forum/create' : '/signup'}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
              >
                <PlusCircle className="h-4 w-4" />
                {isAuthenticated ? 'Ask in this category' : 'Sign up to ask'}
              </Link>
            </div>
          </section>

          <section className="mt-8">
            {loading ? (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                Loading discussions...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
                Discussions could not be loaded right now.
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                <h2 className="font-bold text-gray-900">No useful discussions are indexed here yet.</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600">
                  Start the first high-quality question in this category. Thin forum category pages stay out
                  of search until there is enough useful content.
                </p>
              </div>
            ) : (
              <div>
                {posts.map((post) => (
                  <ForumPostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
};

export default ForumCategoryPage;
