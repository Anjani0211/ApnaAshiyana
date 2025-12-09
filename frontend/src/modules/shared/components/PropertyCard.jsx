import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/userService';
import { 
  MapPinIcon,
  CurrencyRupeeIcon,
  HomeIcon,
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
  isFavorited: propIsFavorited = false,
  showActions = true,
  className = "",
  hasPaid = false,
  isAuthenticated = false
}) => {
  const { isAuthenticated: authIsAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(propIsFavorited);
  const [isFlipped, setIsFlipped] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);

  // Check favorite status on mount
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (authIsAuthenticated && property?.id) {
        try {
          const response = await userService.checkFavorite(property.id);
          setIsFavorited(response.isFavorite);
        } catch (error) {
          // Silently fail - user might not be logged in
          setIsFavorited(false);
        }
      }
    };
    checkFavoriteStatus();
  }, [authIsAuthenticated, property?.id]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((event.clientX - centerX) / rect.width);
    y.set((event.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    
    if (!authIsAuthenticated) {
      if (onFavorite) {
        onFavorite(property.id);
      }
      return;
    }
    
    try {
      if (isFavorited) {
        await userService.removeFromFavorites(property.id);
        setIsFavorited(false);
      } else {
        await userService.addToFavorites(property.id);
        setIsFavorited(true);
      }
      
      // Call parent callback if provided
      if (onFavorite) {
        onFavorite(property.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert state on error
      setIsFavorited(!isFavorited);
    }
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
      whileHover={{ y: -12, scale: 1.03 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group ${className}`}
      onClick={handleViewDetails}
    >
      {/* 3D Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-terracotta-500/20 via-ochre-400/10 to-forest-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl -z-10"></div>
      
      {/* Property Image with Parallax */}
      <div className="relative overflow-hidden h-56 bg-earth-100">
        <motion.img
          src={
            property.images && property.images.length > 0
              ? (property.images[0].startsWith('http') || property.images[0].startsWith('/')
                  ? property.images[0]
                  : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/properties/${property.images[0]}`)
              : property.image
              ? (property.image.startsWith('http') || property.image.startsWith('/')
                  ? property.image
                  : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/properties/${property.image}`)
              : '/images/property-1.jpg'
          }
          alt={property.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            transformStyle: 'preserve-3d',
          }}
          onError={(e) => {
            e.target.src = '/images/property-1.jpg';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Verification Badge with 3D Effect */}
        {property.verified && (
          <motion.div 
            className="absolute top-3 right-3 bg-gradient-to-br from-forest-500 to-forest-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center shadow-2xl backdrop-blur-sm border border-forest-400/50"
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: '0 8px 16px rgba(45, 80, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            }}
          >
            <CheckCircleIcon className="w-3.5 h-3.5 mr-1" />
            Verified
          </motion.div>
        )}

        {/* Action Buttons with 3D Effect */}
        {showActions && (
          <motion.div 
            className="absolute top-3 left-3 flex space-x-2 opacity-0 group-hover:opacity-100"
            initial={{ x: -20, opacity: 0 }}
            whileHover={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleFavorite}
              className={`p-2.5 rounded-full transition-all duration-200 backdrop-blur-md ${
                isFavorited 
                  ? 'bg-red-500 text-white shadow-2xl' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              style={{
                boxShadow: isFavorited ? '0 4px 12px rgba(239, 68, 68, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <HeartIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/90 text-gray-600 hover:bg-white hover:text-terracotta-600 transition-all duration-200 backdrop-blur-md"
              whileHover={{ scale: 1.15, rotate: -10 }}
              whileTap={{ scale: 0.9 }}
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
            >
              <ShareIcon className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}

        {/* 3D Price Badge with Glassmorphism */}
        <motion.div 
          className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md rounded-xl px-4 py-2.5 shadow-2xl border border-white/50"
          whileHover={{ scale: 1.05, y: -2 }}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
        >
          <div className="flex items-center text-terracotta-700 font-bold text-lg">
            <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
            {property.rent?.toLocaleString() || 'N/A'}
            <span className="text-gray-600 text-sm font-normal ml-1">/month</span>
          </div>
        </motion.div>
      </div>

      {/* Property Details */}
      <div className="p-6 bg-white relative" style={{ transformStyle: 'preserve-3d' }}>
        <div className="mb-3">
          <motion.h3 
            className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-terracotta-600 transition-colors duration-200"
            whileHover={{ x: 2 }}
          >
            {property.title}
          </motion.h3>
        </div>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <motion.div whileHover={{ scale: 1.2, rotate: 15 }}>
            <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0 text-terracotta-500" />
          </motion.div>
          {hasPaid && isAuthenticated ? (
            <span className="text-sm line-clamp-1">{property.location}</span>
          ) : (
            <span className="text-sm line-clamp-1 blur-sm select-none">Location hidden</span>
          )}
        </div>

        {/* Property Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-gray-600">
            <motion.div whileHover={{ scale: 1.2, rotate: -15 }}>
              <HomeIcon className="w-4 h-4 mr-2 text-terracotta-500" />
            </motion.div>
            <span className="text-sm capitalize font-medium">{property.type}</span>
            {property.bedrooms && (
              <span className="text-sm text-gray-500 ml-2">• {property.bedrooms} BHK</span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {property.description}
        </p>

        {/* Amenities with 3D Effect */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <motion.span
                key={amenity}
                className="text-xs bg-gradient-to-br from-earth-50 to-earth-100 text-earth-700 px-2.5 py-1 rounded-full font-medium border border-earth-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                style={{
                  boxShadow: '0 2px 4px rgba(139, 69, 19, 0.1)',
                }}
              >
                {amenity.replace('_', ' ')}
              </motion.span>
            ))}
            {property.amenities.length > 3 && (
              <motion.span 
                className="text-xs bg-gradient-to-br from-terracotta-100 to-terracotta-50 text-terracotta-700 px-2.5 py-1 rounded-full font-medium border border-terracotta-200"
                whileHover={{ scale: 1.1, y: -2 }}
                style={{
                  boxShadow: '0 2px 4px rgba(194, 65, 12, 0.15)',
                }}
              >
                +{property.amenities.length - 3} more
              </motion.span>
            )}
          </div>
        )}

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            Deposit: <span className="font-semibold text-gray-700">₹{property.deposit?.toLocaleString() || 'N/A'}</span>
          </div>
          {showActions && (
            <motion.button
              onClick={handleViewDetails}
              className="bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white px-5 py-2.5 rounded-xl hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 flex items-center text-sm font-semibold shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: '0 4px 12px rgba(194, 65, 12, 0.3)',
              }}
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View Details
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
