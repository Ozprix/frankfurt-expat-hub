import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, Clock, Eye, Loader2, MessageSquare, Send, ThumbsUp,
} from '@/lib/icons';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import SEOHead from '@/components/SEOHead';
import LinkifiedUserContent from '@/components/LinkifiedUserContent';
import { schemaBreadcrumb } from '@/utils/structuredData';
import { forumPostsData } from '@/data/forumPostsData';

const isSeedId = (id) => typeof id === 'string' && id.startsWith('seed-');

// ---------------------------------------------------------------------------
// Reply card
// ---------------------------------------------------------------------------
const ReplyCard = ({ reply, onUpvote, currentUserId }) => (
  <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ecfdf5] text-xs font-black text-[#0f766e]">
        {reply.user_id?.slice(0, 2).toUpperCase() || 'U'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
          <span className="font-semibold text-[#334155]">Community Member</span>
          <span>·</span>
          <span>{new Date(reply.created_at).toLocaleDateString()}</span>
          {reply.is_marked_helpful && (
            <span className="rounded-full bg-[#ecfdf5] px-2 py-0.5 text-xs font-bold text-[#0f766e]">
              ✓ Helpful
            </span>
          )}
          {reply.pending && (
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
              Pending review
            </span>
          )}
        </div>
        <LinkifiedUserContent
          text={reply.content}
          className="mt-2 text-sm leading-relaxed text-[#334155]"
        />
        <button
          type="button"
          onClick={() => onUpvote(reply)}
          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#64748b] transition hover:text-[#0f766e]"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          {reply.upvotes || 0}
        </button>
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
const ForumPostDetailPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [upvoting, setUpvoting] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const viewTracked = useRef(false);

  // ── Load post + replies + vote status ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      // Fetch post
      const { data: postData, error: postErr } = await supabaseClient
        .from('forum_posts')
        .select('*, forum_categories(name)')
        .eq('id', id)
        .single();

      if (cancelled) return;

      if (postErr) {
        const fallback = forumPostsData.find((p) => p.id === id);
        setError(fallback ? null : postErr);
        setPost(fallback ? { ...fallback, _isSeed: true } : null);
        setUpvoteCount(fallback?.upvotes || 0);
      } else {
        const enriched = { ...postData, category: postData.forum_categories?.name || 'General' };
        setPost(enriched);
        setUpvoteCount(enriched.upvotes || 0);
      }

      // Fetch approved replies
      const { data: repliesData } = await supabaseClient
        .from('forum_replies')
        .select('*')
        .eq('post_id', id)
        .eq('moderation_status', 'approved')
        .order('created_at', { ascending: true });

      if (!cancelled) setReplies(repliesData || []);

      // Check existing vote
      if (user && !isSeedId(id)) {
        const { data: voteData } = await supabaseClient
          .from('forum_votes')
          .select('id')
          .eq('post_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        if (!cancelled) setUpvoted(!!voteData);
      }

      if (!cancelled) setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [id, user]);

  // ── Increment view count once ───────────────────────────────────────────
  useEffect(() => {
    if (viewTracked.current || loading || !post || isSeedId(id)) return;
    viewTracked.current = true;
    supabaseClient
      .from('forum_posts')
      .update({ views: (post.views || 0) + 1 })
      .eq('id', id)
      .then(() => {});
  }, [loading, post, id]);

  // ── Upvote ──────────────────────────────────────────────────────────────
  const handleUpvote = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Sign in to upvote', description: 'Create a free account to vote on posts.' });
      return;
    }
    if (upvoting || isSeedId(id)) return;

    setUpvoting(true);
    if (upvoted) {
      await supabaseClient.from('forum_votes').delete()
        .eq('post_id', id).eq('user_id', user.id);
      const next = Math.max(0, upvoteCount - 1);
      await supabaseClient.from('forum_posts').update({ upvotes: next }).eq('id', id);
      setUpvoteCount(next);
      setUpvoted(false);
    } else {
      await supabaseClient.from('forum_votes').insert({ post_id: id, user_id: user.id, vote_type: 1 });
      const next = upvoteCount + 1;
      await supabaseClient.from('forum_posts').update({ upvotes: next }).eq('id', id);
      setUpvoteCount(next);
      setUpvoted(true);
    }
    setUpvoting(false);
  };

  // ── Upvote a reply ──────────────────────────────────────────────────────
  const handleReplyUpvote = async (reply) => {
    if (!isAuthenticated) {
      toast({ title: 'Sign in to upvote', description: 'Create a free account to vote.' });
      return;
    }
    if (isSeedId(id) || reply.pending) return;

    const { data: existing } = await supabaseClient
      .from('forum_votes')
      .select('id')
      .eq('reply_id', reply.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      await supabaseClient.from('forum_votes').delete().eq('id', existing.id);
      await supabaseClient.from('forum_replies').update({ upvotes: Math.max(0, (reply.upvotes || 0) - 1) }).eq('id', reply.id);
      setReplies((prev) => prev.map((r) => r.id === reply.id ? { ...r, upvotes: Math.max(0, (r.upvotes || 0) - 1) } : r));
    } else {
      await supabaseClient.from('forum_votes').insert({ reply_id: reply.id, user_id: user.id, vote_type: 1 });
      await supabaseClient.from('forum_replies').update({ upvotes: (reply.upvotes || 0) + 1 }).eq('id', reply.id);
      setReplies((prev) => prev.map((r) => r.id === reply.id ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r));
    }
  };

  // ── Submit reply ────────────────────────────────────────────────────────
  const handleReply = async (e) => {
    e.preventDefault();
    const content = replyText.trim();

    if (content.length < 10) {
      toast({ title: 'Too short', description: 'Write at least 10 characters.', variant: 'destructive' });
      return;
    }
    if (content.length > 2000) {
      toast({ title: 'Too long', description: 'Keep replies under 2000 characters.', variant: 'destructive' });
      return;
    }
    if (isSeedId(id)) {
      toast({ title: 'Demo post', description: 'Replies are disabled on demo content.', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    const { data, error: replyErr } = await supabaseClient
      .from('forum_replies')
      .insert({ post_id: id, user_id: user.id, content })
      .select('*')
      .single();
    setSubmitting(false);

    if (replyErr) {
      toast({ title: 'Could not post reply', description: 'Please try again.', variant: 'destructive' });
      return;
    }

    setReplies((prev) => [...prev, { ...data, pending: data.moderation_status !== 'approved' }]);
    setReplyText('');
    toast({
      title: data.moderation_status === 'pending' ? 'Reply submitted for review' : 'Reply posted',
      description: data.moderation_status === 'pending'
        ? 'Your reply will appear after moderation.'
        : 'Your reply is now visible to the community.',
    });
  };

  // ── Breadcrumbs ─────────────────────────────────────────────────────────
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Forum', path: '/forum' },
    ...(post ? [{ name: post.category || 'General', path: '/forum' }] : []),
    ...(post ? [{ name: post.title, path: `/forum/post/${id}` }] : []),
  ];

  return (
    <>
      <SEOHead
        title={post?.title ? `${post.title} | Frankfurt Expat Forum` : 'Forum Post | Frankfurt Expat Services'}
        description={post?.content ? `${post.content.slice(0, 155)}…` : 'Read Frankfurt expat forum discussions.'}
        canonical={`/forum/post/${id}`}
        noindex={!post || (post.content || '').length < 120}
      >
        {post && (
          <script type="application/ld+json">
            {JSON.stringify(schemaBreadcrumb(breadcrumbs))}
          </script>
        )}
      </SEOHead>

      <div className="min-h-screen bg-[#f3f4ef] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">

          <Link
            to="/forum"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] transition hover:text-[#115e59]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to forum
          </Link>

          {/* ── Loading ── */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[#0f766e]" />
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">
              This forum post could not be loaded.{' '}
              <Link to="/forum" className="font-bold underline">Browse all posts</Link>
            </div>
          )}

          {/* ── Post ── */}
          {!loading && !error && post && (
            <>
              <article className="rounded-xl border border-[#dbe1d8] bg-white p-6 shadow-sm sm:p-8">

                {/* Category + seed notice */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#ecfdf5] px-3 py-1 text-xs font-bold text-[#0f766e]">
                    {post.category}
                  </span>
                  {isSeedId(id) && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      Demo content
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-2xl font-black leading-tight text-[#0f172a] sm:text-3xl">
                  {post.title}
                </h1>

                {/* Meta row */}
                <div className="mt-4 flex flex-wrap items-center gap-4 border-b border-[#f1f5f9] pb-5 text-xs text-[#64748b]">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views || 0} views
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  </span>

                  {/* Upvote button */}
                  <button
                    type="button"
                    onClick={handleUpvote}
                    disabled={upvoting}
                    title={isAuthenticated ? (upvoted ? 'Remove upvote' : 'Upvote this post') : 'Sign in to upvote'}
                    className={[
                      'inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold transition',
                      upvoted
                        ? 'bg-[#ecfdf5] text-[#0f766e]'
                        : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#ecfdf5] hover:text-[#0f766e]',
                    ].join(' ')}
                  >
                    {upvoting
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <ThumbsUp className="h-3.5 w-3.5" />}
                    {upvoteCount}
                  </button>
                </div>

                {/* Body */}
                <LinkifiedUserContent
                  text={post.content}
                  className="mt-6 whitespace-pre-line text-sm leading-7 text-[#334155]"
                />
              </article>

              {/* ── Replies ── */}
              <div className="mt-8">
                <h2 className="mb-4 text-lg font-black text-[#0f172a]">
                  {replies.length === 0 ? 'No replies yet' : `${replies.length} ${replies.length === 1 ? 'Reply' : 'Replies'}`}
                </h2>

                {replies.length > 0 && (
                  <div className="space-y-4">
                    {replies.map((reply) => (
                      <ReplyCard
                        key={reply.id}
                        reply={reply}
                        onUpvote={handleReplyUpvote}
                        currentUserId={user?.id}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* ── Reply form / CTA ── */}
              <div className="mt-6">
                {isAuthenticated ? (
                  <form
                    onSubmit={handleReply}
                    className="rounded-xl border border-[#dbe1d8] bg-white p-6"
                  >
                    <h3 className="mb-3 font-bold text-[#0f172a]">Post a reply</h3>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={4}
                      maxLength={2000}
                      placeholder="Share your experience or answer…"
                      className="w-full rounded-lg border border-[#dbe1d8] px-3 py-2 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8] focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/10"
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-[#94a3b8]">{replyText.length}/2000</span>
                      <button
                        type="submit"
                        disabled={submitting || replyText.trim().length < 10}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#0f766e] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Post reply
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="rounded-xl border border-[#d1fae5] bg-[#ecfdf5] p-6 text-center">
                    <h3 className="font-bold text-[#0f172a]">Have an answer or a similar question?</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#475569]">
                      Sign up free to reply, upvote, and keep useful answers in your account.
                    </p>
                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                      <Link
                        to="/signup"
                        className="inline-flex items-center rounded-lg bg-[#0f766e] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#115e59]"
                      >
                        Create free account
                      </Link>
                      <Link
                        to="/login"
                        className="inline-flex items-center rounded-lg border border-[#dbe1d8] bg-white px-5 py-2 text-sm font-bold text-[#334155] transition hover:bg-[#f8faf8]"
                      >
                        Log in
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ForumPostDetailPage;
