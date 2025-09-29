import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  StarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  LockClosedIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { PROPERTY_TYPES, BUDGET_RANGES, FURNISHING_TYPES, RANCHI_AREAS } from '../constants';
import PropertyCard from '../modules/shared/components/PropertyCard';
import { toast } from 'react-toastify';

const PropertyList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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
      // Mock data - replace with actual API call
      const mockProperties = [
        {
          id: 1,
          title: 'Beautiful 2BHK Apartment near BIT Mesra',
          type: 'apartment',
          rent: 12000,
          deposit: 24000,
          location: 'Mesra, Ranchi',
          area: 'mesra',
          coordinates: [23.4067, 85.4375],
          images: ['/images/property-1.jpg', '/images/property-2.jpg'],
          verified: true,
          description: 'Beautiful 2BHK apartment located in the heart of Mesra, just 5 minutes walk from BIT Mesra campus.',
          ratings: 4.5,
          reviews: 23,
          bedrooms: 2,
          bathrooms: 2,
          furnished: 'furnished',
          availableFrom: '2024-02-01',
          amenities: ['wifi', 'parking', 'security', 'power_backup', 'water_supply']
        },
        {
          id: 2,
          title: 'Cozy PG Room for Students',
          type: 'pg',
          rent: 5000,
          deposit: 10000,
          location: 'Bariatu, Ranchi',
          area: 'bariatu',
          coordinates: [23.3833, 85.3333],
          images: ['/images/property-3.jpg', '/images/property-4.jpg'],
          verified: true,
          description: 'Perfect PG accommodation for students with all modern amenities.',
          ratings: 4.2,
          reviews: 15,
          bedrooms: 1,
          bathrooms: 1,
          furnished: 'furnished',
          availableFrom: '2024-01-15',
          amenities: ['wifi', 'security', 'water_supply']
        },
        {
          id: 3,
          title: 'Spacious 3BHK House in Morabadi',
          type: 'house',
          rent: 18000,
          deposit: 36000,
          location: 'Morabadi, Ranchi',
          area: 'morabadi',
          coordinates: [23.3500, 85.3167],
          images: ['/images/property-5.jpg', '/images/property-6.jpg'],
          verified: false,
          description: 'Large family house with garden and parking space.',
          ratings: 4.0,
          reviews: 8,
          bedrooms: 3,
          bathrooms: 3,
          furnished: 'semi-furnished',
          availableFrom: '2024-03-01',
          amenities: ['parking', 'garden', 'security', 'water_supply']
        },
        {
          id: 4,
          title: 'Modern Flat near Ranchi University',
          type: 'flat',
          rent: 15000,
          deposit: 30000,
          location: 'Kanke, Ranchi',
          area: 'kanke',
          coordinates: [23.4167, 85.3167],
          images: ['/images/property-7.jpg', '/images/property-8.jpg'],
          verified: true,
          description: 'Modern flat with all amenities, perfect for working professionals.',
          ratings: 4.7,
          reviews: 31,
          bedrooms: 2,
          bathrooms: 2,
          furnished: 'furnished',
          availableFrom: '2024-02-15',
          amenities: ['wifi', 'parking', 'security', 'power_backup', 'water_supply', 'gym']
        }
      ];

      // Apply filters
      let filteredProperties = mockProperties;
      
      if (filters.type) {
        filteredProperties = filteredProperties.filter(p => p.type === filters.type);
      }
      
      if (filters.area) {
        filteredProperties = filteredProperties.filter(p => p.area === filters.area);
      }
      
      if (filters.budget) {
        const budget = parseInt(filters.budget);
        filteredProperties = filteredProperties.filter(p => p.rent <= budget);
      }
      
      if (filters.furnished) {
        filteredProperties = filteredProperties.filter(p => p.furnished === filters.furnished);
      }
      
      if (filters.search) {
        filteredProperties = filteredProperties.filter(p => 
          p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.location.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setProperties(filteredProperties);
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

  const PropertyCard = ({ property }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative">
        <img
          src={property.images[0] || '/images/property-1.jpg'}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          {property.verified && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              ✓ Verified
            </span>
          )}
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={() => {
              if (!isAuthenticated) {
                toast.info('Please sign up to save favorites');
                navigate('/register');
                return;
              }
              toast.success('Property added to favorites!');
            }}
            className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
          >
            <HeartIcon className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: property.title,
                  text: `Check out this property: ${property.title}`,
                  url: `${window.location.origin}/properties/${property.id}`
                }).then(() => toast.success('Property shared successfully!'))
                  .catch((error) => toast.error('Error sharing property.'));
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/properties/${property.id}`);
                toast.info('Property link copied to clipboard!');
              }
            }}
            className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all duration-200"
          >
            <ShareIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
            {property.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{property.ratings}</span>
            <span className="ml-1">({property.reviews})</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPinIcon className="w-4 h-4 mr-2" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-primary-600 font-bold text-lg">
            <CurrencyRupeeIcon className="w-5 h-5 mr-1" />
            {property.rent.toLocaleString()}
            <span className="text-gray-500 text-sm font-normal ml-1">/month</span>
          </div>
          <div className="text-sm text-gray-600">
            {property.bedrooms} BHK • {property.bathrooms} Bath
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {property.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
            >
              {amenity.replace('_', ' ')}
            </span>
          ))}
          {property.amenities.length > 3 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              +{property.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.info('Please sign up to view property details');
              navigate('/register');
              return;
            }
            navigate(`/properties/${property.id}`);
          }}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
        >
          <EyeIcon className="w-4 h-4 mr-2" />
          {isAuthenticated ? 'View Details' : 'Sign Up to View'}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Authentication Banner */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <LockClosedIcon className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="font-semibold">Sign up to unlock full property details</h3>
                  <p className="text-sm text-primary-100">Get owner contact info, detailed photos, and more</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/register')}
                className="flex items-center bg-white text-primary-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                <UserPlusIcon className="w-5 h-5 mr-2" />
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Properties in Ranchi</h1>
              <p className="text-gray-600 mt-1">
                {properties.length} properties found
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Search properties..."
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <select
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget</label>
                <select
                  value={filters.budget}
                  onChange={(e) => handleFilterChange('budget', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing</label>
                <select
                  value={filters.furnished}
                  onChange={(e) => handleFilterChange('furnished', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Any Furnishing</option>
                  {FURNISHING_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search criteria
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyList;