import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon,
  CurrencyRupeeIcon,
  HomeIcon,
  StarIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const PropertyCard = ({ 
  property, 
  onViewDetails, 
  onFavorite, 
  onShare, 
  isFavorited = false,
  showActions = true,
  className = ""
}) => {
  const handleFavorite = (e) => {
    e.stopPropagation();
    onFavorite?.(property.id);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    onShare?.(property);
  };

  const handleViewDetails = () => {
    onViewDetails?.(property.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group ${className}`}
      onClick={handleViewDetails}
    >
      {/* Property Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.image || '/images/property-1.jpg'}
          alt={property.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Verification Badge */}
        {property.verified && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center shadow-lg">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Verified
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100 hover:text-red-500'
              }`}
            >
              <HeartIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white bg-opacity-90 text-gray-600 hover:bg-opacity-100 hover:text-primary-600 transition-all duration-200"
            >
              <ShareIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-3 left-3 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center text-primary-600 font-bold text-lg">
            <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
            {property.rent?.toLocaleString() || 'N/A'}
            <span className="text-gray-500 text-sm font-normal ml-1">/month</span>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
            {property.title}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0 text-primary-500" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>

        {/* Property Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <HomeIcon className="w-4 h-4 mr-2 text-primary-500" />
            <span className="text-sm capitalize font-medium">{property.type}</span>
            {property.bedrooms && (
              <span className="text-sm text-gray-500 ml-2">• {property.bedrooms} BHK</span>
            )}
          </div>
          {property.ratings && (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-gray-700">{property.ratings}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {property.description}
        </p>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium"
              >
                {amenity.replace('_', ' ')}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full font-medium">
                +{property.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Deposit: <span className="font-semibold text-gray-700">₹{property.deposit?.toLocaleString() || 'N/A'}</span>
          </div>
          {showActions && (
            <button
              onClick={handleViewDetails}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center text-sm font-medium"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View Details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
