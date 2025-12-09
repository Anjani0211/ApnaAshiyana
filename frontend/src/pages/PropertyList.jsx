import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  LockClosedIcon,
  UserPlusIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { PROPERTY_TYPES, BUDGET_RANGES, FURNISHING_TYPES, RANCHI_AREAS } from '../constants';
import PropertyCard from '../modules/shared/components/PropertyCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import { getRandomPropertyImages } from '../utils/images';
import { propertyService } from '../services/propertyService';
import { toast } from 'react-toastify';

const PropertyList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { hasPaid, handlePayment } = usePayment();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    area: searchParams.get('area') || '',
    budget: searchParams.get('budget') || '',
    furnished: searchParams.get('furnished') || '',
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      
      // Build API query params
      const queryParams = {
        isAvailable: true,
        ...(filters.type && { propertyType: filters.type }),
        ...(filters.area && { 'address.area': filters.area }),
        ...(filters.budget && { rent: { $lte: parseInt(filters.budget) } }),
        ...(filters.furnished && { furnishingStatus: filters.furnished })
      };
      
      try {
        const response = await propertyService.getProperties(queryParams);
        const apiProperties = response.data?.data || response.data || [];
        
        // Transform API data and remove duplicates by ID
        const uniquePropertiesMap = new Map();
        
        apiProperties.forEach(prop => {
          const id = prop._id?.toString() || prop.id?.toString();
          if (id && !uniquePropertiesMap.has(id)) {
            uniquePropertiesMap.set(id, {
              id: id,
              title: prop.title,
              type: prop.propertyType,
              rent: prop.rent,
              deposit: prop.deposit,
              location: prop.address ? `${prop.address.area}, ${prop.address.city}` : prop.location || 'Ranchi',
              area: prop.address?.area || prop.area,
              coordinates: prop.location?.coordinates || [85.3096, 23.3441], // Default Ranchi
              images: prop.images && prop.images.length > 0 ? prop.images : getRandomPropertyImages(4),
              verified: prop.isVerified || false,
              description: prop.description,
              bedrooms: prop.bedrooms,
              bathrooms: prop.bathrooms,
              furnished: prop.furnishingStatus || 'unfurnished',
              availableFrom: prop.availableFrom,
              amenities: prop.amenities ? Object.keys(prop.amenities).filter(k => prop.amenities[k]) : []
            });
          }
        });
        
        let transformedProperties = Array.from(uniquePropertiesMap.values());
        
        // Apply search filter if any
        if (filters.search) {
          transformedProperties = transformedProperties.filter(p => 
            p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            p.location.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        setProperties(transformedProperties);
      } catch (apiError) {
        console.error('API error:', apiError);
        // Fallback to empty array
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      area: '',
      budget: '',
      furnished: '',
      search: ''
    });
    setSearchParams({});
  };

  const handleViewDetails = (propertyId) => {
    if (!isAuthenticated) {
      toast.info('Please login to continue');
      navigate('/login', { state: { from: `/properties/${propertyId}` } });
      return;
    }
    if (!hasPaid) {
      toast.info('Please pay ₹199 to view property details');
      navigate(`/properties/${propertyId}`);
      return;
    }
    navigate(`/properties/${propertyId}`);
  };

  const handleFavorite = (propertyId) => {
    if (!isAuthenticated) {
      toast.info('Please sign up to save favorites');
      navigate('/register');
      return;
    }
    toast.success('Property added to favorites!');
  };

  const handleShare = (property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: `${window.location.origin}/properties/${property.id}`
      }).then(() => toast.success('Property shared successfully!'))
        .catch(() => toast.error('Error sharing property.'));
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/properties/${property.id}`);
      toast.info('Property link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 earth-texture">
      {/* Payment Banner */}
      {!hasPaid && isAuthenticated && (
        <motion.div 
          className="bg-gradient-to-r from-terracotta-600 via-ochre-500 to-terracotta-600 text-white shadow-2xl"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <CreditCardIcon className="w-6 h-6 mr-3" />
                </motion.div>
                <div>
                  <h3 className="font-bold">Pay ₹199 to unlock all property details</h3>
                  <p className="text-sm text-white/90">Get owner contact info, detailed photos, amenities and more</p>
                </div>
              </div>
              <motion.button
                onClick={handlePayment}
                className="flex items-center bg-white text-terracotta-700 px-6 py-2.5 rounded-xl hover:bg-ochre-50 transition-all duration-200 font-bold shadow-2xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <CreditCardIcon className="w-5 h-5 mr-2" />
                Pay Now - ₹199
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Authentication Banner */}
      {!isAuthenticated && (
        <motion.div 
          className="bg-gradient-to-r from-forest-600 to-forest-700 text-white shadow-2xl"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <LockClosedIcon className="w-6 h-6 mr-3" />
                </motion.div>
                <div>
                  <h3 className="font-bold">Sign up to save favorites and contact owners</h3>
                  <p className="text-sm text-white/90">Create your free account today!</p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate('/register')}
                className="flex items-center bg-white text-forest-700 px-6 py-2.5 rounded-xl hover:bg-forest-50 transition-all duration-200 font-bold shadow-2xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Sign Up Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-white via-earth-50 to-white shadow-lg border-b-2 border-earth-200 pt-24"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <motion.h1 
                className="text-3xl font-black text-gray-900"
                style={{
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Properties in <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-ochre-600">Ranchi</span>
              </motion.h1>
              <p className="text-gray-600 mt-1 font-medium">
                {loading ? 'Loading...' : `${properties.length} properties found`}
              </p>
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white px-5 py-2.5 rounded-xl hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-200 font-bold shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar with 3D Effect */}
          <motion.div 
            className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="bg-white rounded-2xl shadow-2xl p-6 sticky top-8 border-2 border-earth-100"
              whileHover={{ y: -2 }}
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <AdjustmentsHorizontalIcon className="w-5 h-5 text-terracotta-600" />
                  Filters
                </h2>
                <motion.button
                  onClick={clearFilters}
                  className="text-sm text-terracotta-600 hover:text-terracotta-700 font-semibold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Clear All
                </motion.button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-terracotta-500" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border-2 border-earth-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all duration-200 shadow-sm"
                    placeholder="Search properties..."
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-earth-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all duration-200 shadow-sm bg-white"
                >
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Area</label>
                <select
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-earth-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all duration-200 shadow-sm bg-white"
                >
                  <option value="">All Areas</option>
                  {RANCHI_AREAS.map((area) => (
                    <option key={area.value} value={area.value}>
                      {area.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Budget</label>
                <select
                  value={filters.budget}
                  onChange={(e) => handleFilterChange('budget', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-earth-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all duration-200 shadow-sm bg-white"
                >
                  <option value="">Any Budget</option>
                  {BUDGET_RANGES.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Furnishing */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Furnishing</label>
                <select
                  value={filters.furnished}
                  onChange={(e) => handleFilterChange('furnished', e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-earth-200 rounded-xl focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 transition-all duration-200 shadow-sm bg-white"
                >
                  <option value="">Any Furnishing</option>
                  {FURNISHING_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </motion.div>

          {/* Properties Grid with 3D Layout */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                <SkeletonLoader type="card" count={6} />
              </div>
            ) : properties.length > 0 ? (
              <motion.div 
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <PropertyCard
                      property={property}
                      onViewDetails={handleViewDetails}
                      onFavorite={handleFavorite}
                      onShare={handleShare}
                      hasPaid={hasPaid}
                      isAuthenticated={isAuthenticated}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState
                icon={HomeIcon}
                title="No Properties Found"
                description="Try adjusting your filters or search criteria to find more properties."
                action={clearFilters}
                actionLabel="Clear Filters"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;