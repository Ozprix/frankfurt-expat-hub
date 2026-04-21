
import React from 'react';
import { MessageCircle } from '@/lib/icons';
import { motion } from '@/lib/motion';
import { Link } from 'react-router-dom';
import { forumCategorySlugForName } from '@/data/forumCategories';

const ForumCategoryCard = ({ category, onClick }) => {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <Link to={`/forum/${category.slug || forumCategorySlugForName(category.name)}`} className="block">
        <div className="flex items-start justify-between">
          <div className="bg-teal-50 p-3 rounded-lg text-2xl mb-4">
            {category.icon || '💬'}
          </div>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full flex items-center">
            <MessageCircle className="w-3 h-3 mr-1" />
            {category.post_count || 0}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 mb-2">{category.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
      </Link>
    </motion.article>
  );
};

export default ForumCategoryCard;
