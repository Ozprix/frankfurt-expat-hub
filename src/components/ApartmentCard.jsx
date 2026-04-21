
import React from 'react';
import { MapPin, Maximize, Home, Heart } from '@/lib/icons';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/utils/apartmentUtils';

const ApartmentCard = ({ apartment }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
      <div className="relative aspect-[4/3] bg-gray-200">
        <img 
          src={apartment.images?.[0] || 'https://via.placeholder.com/400x300'} 
          alt={apartment.title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-gray-400 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
        <div className="absolute bottom-3 left-3 bg-teal-600 text-white text-sm font-bold px-3 py-1 rounded shadow-sm">
          {formatPrice(apartment.price)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-teal-600 transition-colors">
          {apartment.title}
        </h3>
        <div className="flex items-center text-gray-500 text-xs mb-3">
          <MapPin className="w-3 h-3 mr-1" />
          {apartment.neighborhood}
        </div>
        
        <div className="flex items-center justify-between py-3 border-t border-gray-100 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Home className="w-4 h-4 text-gray-400" />
            {apartment.rooms} Rooms
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-4 h-4 text-gray-400" />
            {apartment.size_sqm} m²
          </div>
        </div>
        
        <Link 
          to={`/apartments/${apartment.id}`}
          className="block w-full text-center bg-gray-50 hover:bg-teal-50 text-gray-700 hover:text-teal-700 font-medium py-2 rounded-lg mt-2 transition-colors text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ApartmentCard;
