import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, MessageSquare, ThumbsUp } from '@/lib/icons';
import { supabaseClient } from '@/config/supabaseClient';
import SEOHead from '@/components/SEOHead';
import LinkifiedUserContent from '@/components/LinkifiedUserContent';
import { schemaBreadcrumb } from '@/utils/structuredData';
import { forumPostsData } from '@/data/forumPostsData';

const ForumPostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabaseClient
        .from('forum_posts')
        .select('*, forum_categories(name)')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Forum post fetch error:', fetchError);
        const fallbackPost = forumPostsData.find((item) => item.id === id);
        setError(fallbackPost ? null : fetchError);
        setPost(fallbackPost || null);
      } else {
        setPost({
          ...data,
          category: data.forum_categories?.name || 'General',
        });
      }

      setLoading(false);
    };

    fetchPost();
  }, [id]);

  return (
    <>
      <SEOHead
        title={post?.title ? `${post.title} | Frankfurt Expat Forum` : 'Forum Post | Frankfurt Expat Services'}
        description={post?.content ? `${post.content.slice(0, 150)}${post.content.length > 150 ? '...' : ''}` : 'Read Frankfurt expat forum discussions about Anmeldung, housing, tax, visas, healthcare, and local setup.'}
        canonical={`/forum/post/${id}`}
        noindex={!post || !post.content || post.content.length < 120}
      >
        {post && (
          <>
            <script type="application/ld+json">
              {JSON.stringify(schemaBreadcrumb([
                { name: 'Home', path: '/' },
                { name: 'Forum', path: '/forum' },
                { name: post.category, path: '/forum' },
                { name: post.title, path: `/forum/post/${id}` },
              ]))}
            </script>
            <script type="application/ld+json">
              {JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'DiscussionForumPosting',
                headline: post.title,
                text: post.content,
                datePublished: post.created_at,
                url: `https://frankfurtexpatservices.com/forum/post/${id}`,
                interactionStatistic: [
                  {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/ViewAction',
                    userInteractionCount: post.views || 0,
                  },
                  {
                    '@type': 'InteractionCounter',
                    interactionType: 'https://schema.org/LikeAction',
                    userInteractionCount: post.upvotes || 0,
                  },
                ],
              })}
            </script>
          </>
        )}
      </SEOHead>

      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/forum"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to forum
          </Link>

          {loading ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
              Loading post...
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
              This forum post could not be loaded.
            </div>
          ) : (
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-800">
                {post.category}
              </span>
              <h1 className="mt-4 text-3xl font-black leading-tight text-gray-900">{post.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-gray-100 pb-5 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="h-3.5 w-3.5" />
                  {post.upvotes || 0}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Replies
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views || 0}
                </span>
              </div>

              <LinkifiedUserContent text={post.content} className="mt-6 whitespace-pre-line text-sm leading-7 text-gray-700" />

              <div className="mt-8 rounded-xl border border-teal-100 bg-teal-50 p-5">
                <h2 className="font-bold text-gray-900">Have an answer or a similar question?</h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  Sign up to reply, post your own Frankfurt question, and keep useful answers in your account.
                </p>
                <Link
                  to="/signup"
                  className="mt-4 inline-flex items-center rounded-lg bg-teal-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-teal-800"
                >
                  Sign up to participate
                </Link>
              </div>
            </article>
          )}
        </div>
      </div>
    </>
  );
};

export default ForumPostDetailPage;
