
import React from 'react';
import { Play, Clock, Star } from '@/lib/icons';
import { Link } from 'react-router-dom';
import { formatDuration } from '@/utils/videoUtils';

const VideoCard = ({ video }) => {
  return (
    <Link to={`/tutorials/${video.id}`} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100">
      <div className="relative aspect-video bg-gray-200">
        <img 
          src={video.thumbnail_url} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="bg-white/90 p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-teal-600 fill-current" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">{video.category}</span>
          <div className="flex items-center text-amber-500 text-xs">
            <Star className="w-3 h-3 fill-current mr-1" />
            {video.rating}
          </div>
        </div>
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-teal-600 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <Clock className="w-3 h-3 mr-1" />
          <span>{video.views} views</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
