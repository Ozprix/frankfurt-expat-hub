
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles } from '@/lib/icons';

const FeatureAnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>New tools available! Check out our Forum, Video Tutorials, and Cost Calculator.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/features" className="text-xs bg-white text-teal-700 px-3 py-1.5 rounded-full font-bold hover:bg-teal-50 transition-colors whitespace-nowrap">
            Explore Features
          </Link>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-teal-200 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureAnnouncementBanner;
