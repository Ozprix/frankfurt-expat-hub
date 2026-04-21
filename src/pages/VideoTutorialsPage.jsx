
import React from 'react';
import SEOHead from '@/components/SEOHead';
import VideoCard from '@/components/VideoCard';
import { useVideoTutorials } from '@/hooks/useVideoTutorials';
import { Search } from '@/lib/icons';

const VideoTutorialsPage = () => {
  const { videos, loading, error } = useVideoTutorials();

  return (
    <>
      <SEOHead
        title="Video Tutorials | Frankfurt Expat Services"
        description="Watch step-by-step video guides covering Anmeldung, opening a German bank account, health insurance, and other Frankfurt relocation essentials."
        canonical="/tutorials"
      />

      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Video Guides</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Step-by-step video tutorials to help you navigate bureaucracy, housing, and life in Frankfurt.
          </p>
          <div className="relative max-w-xl mx-auto">
            <input 
              type="text" 
              placeholder="Search tutorials..." 
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
            <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex overflow-x-auto gap-2 pb-6 mb-4 hide-scrollbar">
          {['All', 'Bureaucracy', 'Housing', 'Health', 'Transport', 'Lifestyle'].map((cat, i) => (
            <button 
              key={cat} 
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${i === 0 ? 'bg-teal-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading videos...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">Video guides are unavailable right now.</div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No video guides have been published yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default VideoTutorialsPage;
