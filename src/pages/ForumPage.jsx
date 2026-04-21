
import React from 'react';
import SEOHead from '@/components/SEOHead';
import { useForum } from '@/hooks/useForum';
import ForumCategoryCard from '@/components/ForumCategoryCard';
import ForumPostCard from '@/components/ForumPostCard';
import { Search, PlusCircle } from '@/lib/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { forumCategoryPages } from '@/data/forumCategories';

const ForumPage = () => {
  const { categories, recentPosts, loading, error } = useForum();
  const { isAuthenticated } = useAuth();
  const displayCategories = categories.length > 0
    ? categories
    : forumCategoryPages.map((category) => ({
      id: category.slug,
      slug: category.slug,
      name: category.name,
      description: category.description,
      post_count: 0,
    }));

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
                placeholder="Search topics..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
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

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Discussions</h2>
              <div className="flex gap-2">
                 <button className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Newest</button>
                 <button className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-1">Popular</button>
              </div>
            </div>

            <div>
              {loading ? (
                <p className="text-sm text-gray-500">Loading discussions...</p>
              ) : recentPosts.length === 0 ? (
                <p className="text-sm text-gray-500">No discussions have been published yet.</p>
              ) : recentPosts.map(post => (
                <ForumPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-teal-600 rounded-xl p-6 text-white text-center">
              <h3 className="font-bold text-xl mb-2">Have a question?</h3>
              <p className="text-teal-100 mb-4 text-sm">Start a new discussion and get help from the community.</p>
              <Link to={isAuthenticated ? '/forum/create' : '/signup'} className="inline-flex items-center bg-white text-teal-700 font-bold py-2 px-6 rounded-lg hover:bg-teal-50 transition-colors w-full justify-center">
                <PlusCircle className="w-5 h-5 mr-2" />
                {isAuthenticated ? 'Create Post' : 'Sign up to post'}
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Top Contributors</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                      U{i}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">User {i}</p>
                      <p className="text-xs text-gray-500">1.2k Reputation</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumPage;
