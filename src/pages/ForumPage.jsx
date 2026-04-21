
import React, { useState, useMemo } from 'react';
import SEOHead from '@/components/SEOHead';
import { useForum } from '@/hooks/useForum';
import ForumCategoryCard from '@/components/ForumCategoryCard';
import ForumPostCard from '@/components/ForumPostCard';
import { Search, PlusCircle, FileText, HelpCircle, Users, BookOpen } from '@/lib/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { forumCategoryPages } from '@/data/forumCategories';

const QUICK_LINKS = [
  { icon: FileText, label: 'First 30 Days Checklist', to: '/frankfurt-first-30-days-checklist' },
  { icon: BookOpen, label: 'Expat Tools & Calculators', to: '/tools' },
  { icon: Users, label: 'Service Directory', to: '/directory' },
  { icon: HelpCircle, label: 'FAQ for New Arrivals', to: '/faq' },
];

const ForumPage = () => {
  const { categories, recentPosts, loading, error } = useForum();
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const displayCategories = categories.length > 0
    ? categories
    : forumCategoryPages.map((category) => ({
      id: category.slug,
      slug: category.slug,
      name: category.name,
      description: category.description,
      post_count: 0,
    }));

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return recentPosts;
    const q = searchQuery.toLowerCase();
    return recentPosts.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.content?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  }, [recentPosts, searchQuery]);

  return (
    <>
      <SEOHead
        title="Expat Community Forum Frankfurt | Frankfurt Expat Services"
        description="Ask questions, share experiences, and connect with fellow Frankfurt expats in our English-speaking community forum."
        canonical="/forum"
      />

      <div className="bg-gradient-to-b from-teal-50 to-white pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Expat Community Forum</h1>
            <p className="text-lg text-gray-600 mb-8">Connect, ask questions, and share experiences with fellow Frankfurt residents.</p>

            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Only show categories when not searching */}
            {!searchQuery && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {loading ? (
                    <p>Loading categories...</p>
                  ) : error ? (
                    <p className="text-sm text-red-600">Forum categories are unavailable right now.</p>
                  ) : displayCategories.length === 0 ? (
                    <p className="text-sm text-gray-500">No categories have been published yet.</p>
                  ) : (
                    displayCategories.map(cat => (
                      <ForumCategoryCard key={cat.id} category={cat} onClick={() => {}} />
                    ))
                  )}
                </div>
              </>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchQuery ? `Results for "${searchQuery}"` : 'Recent Discussions'}
              </h2>
            </div>

            <div>
              {loading ? (
                <p className="text-sm text-gray-500">Loading discussions...</p>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="font-medium mb-2">
                    {searchQuery ? 'No posts matched your search.' : 'No discussions yet.'}
                  </p>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-teal-600 text-sm font-semibold hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : filteredPosts.map(post => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* CTA */}
            <div className="bg-teal-600 rounded-xl p-6 text-white text-center">
              <h3 className="font-bold text-xl mb-2">Have a question?</h3>
              <p className="text-teal-100 mb-4 text-sm">Start a new discussion and get help from the community.</p>
              <Link
                to={isAuthenticated ? '/forum/create' : '/signup'}
                className="inline-flex items-center bg-white text-teal-700 font-bold py-2 px-6 rounded-lg hover:bg-teal-50 transition-colors w-full justify-center"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                {isAuthenticated ? 'Create Post' : 'Sign up to post'}
              </Link>
            </div>

            {/* Quick Links — replaces fake Top Contributors */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Helpful Resources</h3>
              <ul className="space-y-3">
                {QUICK_LINKS.map(({ icon: Icon, label, to }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="flex items-center gap-3 text-sm text-gray-700 hover:text-teal-700 transition-colors group"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 group-hover:bg-teal-100 transition-colors flex-shrink-0">
                        <Icon className="h-4 w-4 text-teal-600" />
                      </span>
                      <span className="font-medium">{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community guidelines nudge */}
            <div className="rounded-xl border border-teal-100 bg-teal-50 p-5 text-sm text-teal-800">
              <p className="font-semibold mb-1">Community guidelines</p>
              <p className="text-teal-700 leading-relaxed">
                Be respectful, share what you know, and keep discussions helpful.
                Posts are reviewed before appearing publicly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumPage;
