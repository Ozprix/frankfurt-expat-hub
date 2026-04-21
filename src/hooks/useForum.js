
import { useState, useEffect } from 'react';
import { supabaseClient } from '@/config/supabaseClient';
import { forumCategoryPages } from '@/data/forumCategories';
import { forumPostsData } from '@/data/forumPostsData';

const fallbackCategories = forumCategoryPages.map((category) => ({
  id: category.slug,
  slug: category.slug,
  name: category.name,
  description: category.description,
  post_count: forumPostsData.filter((post) => post.category === category.name).length,
}));

const fallbackPosts = forumPostsData
  .slice()
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  .slice(0, 5);

export const useForum = () => {
  const [categories, setCategories] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForumCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesResult, postsResult] = await Promise.all([
        supabaseClient
          .from('forum_categories')
          .select('*')
          .order('name'),
        supabaseClient
          .from('forum_posts')
          .select('*, forum_categories(name)')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (postsResult.error) throw postsResult.error;

      setCategories(categoriesResult.data?.length ? categoriesResult.data : fallbackCategories);
      setRecentPosts((postsResult.data?.length ? postsResult.data : fallbackPosts).map((post) => ({
        ...post,
        category: post.forum_categories?.name || post.category || 'General',
      })));
    } catch (err) {
      console.error('Forum fetch error:', err);
      setError(null);
      setCategories(fallbackCategories);
      setRecentPosts(fallbackPosts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForumCategories();
  }, []);

  return {
    categories,
    recentPosts,
    loading,
    error,
    fetchForumCategories
  };
};
