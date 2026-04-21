
import React from 'react';
import { MessageSquare, ThumbsUp, Eye, Clock } from '@/lib/icons';
import { Link } from 'react-router-dom';
import LinkifiedUserContent from '@/components/LinkifiedUserContent';

const ForumPostCard = ({ post }) => {
  return (
    <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="inline-block bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full mb-2 font-medium">
            {post.category || 'General'}
          </span>
          <Link to={`/forum/post/${post.id}`} className="block">
            <h3 className="text-lg font-bold text-gray-900 hover:text-teal-600 transition-colors">
              {post.title}
            </h3>
          </Link>
        </div>
      </div>
      
      <LinkifiedUserContent text={post.content} className="text-gray-600 text-sm mb-4 line-clamp-2" />
      
      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 hover:text-teal-600 cursor-pointer">
            <ThumbsUp className="w-3 h-3" /> {post.upvotes || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" /> {post.replies || 0}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {post.views || 0}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(post.created_at || Date.now()).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ForumPostCard;
