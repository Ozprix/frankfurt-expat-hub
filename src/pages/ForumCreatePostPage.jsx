import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Send } from '@/lib/icons';
import { supabaseClient } from '@/config/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  forumPostCooldownActive,
  recordForumPostAttempt,
  validateForumPost,
} from '@/utils/forumModeration';
import { trackConversionEvent } from '@/utils/conversionTracking';

const ForumCreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    category_id: '',
    title: '',
    content: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const { data, error } = await supabaseClient
        .from('forum_categories')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Forum category fetch error:', error);
        toast({
          title: 'Categories unavailable',
          description: 'Please try again in a moment.',
          variant: 'destructive',
        });
      } else {
        setCategories(data || []);
        setForm((current) => ({
          ...current,
          category_id: current.category_id || data?.[0]?.id || '',
        }));
      }
      setLoadingCategories(false);
    };

    fetchCategories();
  }, [toast]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const content = form.content.trim();

    trackConversionEvent('forum_create_attempt', {
      category_id: form.category_id || null,
      has_title: Boolean(title),
      content_length: content.length,
    }, { userId: user?.id });

    if (!title || !content) {
      toast({
        title: 'Missing details',
        description: 'Add a title and question before publishing.',
        variant: 'destructive',
      });
      return;
    }

    if (forumPostCooldownActive()) {
      toast({
        title: 'Please wait a minute',
        description: 'This helps keep the forum useful and reduces duplicate posts.',
        variant: 'destructive',
      });
      return;
    }

    const moderationError = validateForumPost({ title, content });
    if (moderationError) {
      toast({
        title: 'Post needs a quick edit',
        description: moderationError,
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    recordForumPostAttempt();
	    const { data, error } = await supabaseClient
	      .from('forum_posts')
	      .insert({
        user_id: user.id,
        category_id: form.category_id || null,
        title,
	        content,
	      })
	      .select('id, moderation_status')
	      .single();

    setSubmitting(false);

    if (error) {
      console.error('Forum post create error:', error);
      trackConversionEvent('forum_create_failed', {
        category_id: form.category_id || null,
        error_code: error.code || 'unknown',
      }, { userId: user?.id });
      toast({
        title: 'Could not publish post',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      });
      return;
    }

    trackConversionEvent('forum_create_success', {
      category_id: form.category_id || null,
      moderation_status: data?.moderation_status || 'unknown',
    }, { userId: user?.id });

	    toast({
	      title: data?.moderation_status === 'pending' ? 'Post submitted for review' : 'Post published',
	      description: data?.moderation_status === 'pending'
	        ? 'Your question is saved and will appear publicly after moderation.'
	        : 'Your question is now in the forum.',
	    });
    navigate(data?.id ? `/forum/post/${data.id}` : '/forum');
  };

  return (
    <>
      <Helmet>
        <title>Create Forum Post - Frankfurt Expat Services</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <button
            type="button"
            onClick={() => navigate('/forum')}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to forum
          </button>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-teal-700">Community Forum</p>
            <h1 className="mt-2 text-3xl font-black text-gray-900">Create a post</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Ask a clear question, include relevant Frankfurt context, and avoid sharing private documents or sensitive personal data.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="forum-category" className="block text-sm font-bold text-gray-900">
                  Category
                </label>
                <select
                  id="forum-category"
                  value={form.category_id}
                  onChange={(event) => updateField('category_id', event.target.value)}
                  disabled={loadingCategories || categories.length === 0}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 disabled:bg-gray-100"
                >
                  {loadingCategories ? (
                    <option>Loading categories...</option>
                  ) : categories.length === 0 ? (
                    <option value="">General</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label htmlFor="forum-title" className="block text-sm font-bold text-gray-900">
                  Title
                </label>
                <input
                  id="forum-title"
                  type="text"
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  maxLength={140}
                  placeholder="e.g. How long did Anmeldung appointments take this month?"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label htmlFor="forum-content" className="block text-sm font-bold text-gray-900">
                  Question or discussion
                </label>
                <textarea
                  id="forum-content"
                  value={form.content}
                  onChange={(event) => updateField('content', event.target.value)}
                  rows={8}
                  placeholder="Share the situation, what you have already tried, and what kind of help you need."
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Publish post
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumCreatePostPage;
