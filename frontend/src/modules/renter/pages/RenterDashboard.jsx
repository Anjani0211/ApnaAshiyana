import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { PropertySearchForm, PropertyCard } from '../../shared/components';
import { propertyService } from '../../../services/propertyService';
import { bookingService } from '../../../services/bookingService';

const RenterDashboard = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Load user's bookings and favorites
      // const bookingsResponse = await bookingService.getUserBookings();
      // const favoritesResponse = await propertyService.getUserFavorites();
      
      // Mock data for demo
      const mockBookings = [
        {
          id: 1,
          property: {
            id: 1,
            title: '2BHK Apartment near BIT Mesra',
            location: 'Mesra, Ranchi',
            rent: 12000,
            image: '/images/apartment-placeholder.svg'
          },
          status: 'pending',
          requestedDate: '2024-01-15',
          moveInDate: '2024-02-01',
          message: 'Interested in this property for my studies at BIT Mesra.'
        },
        {
          id: 2,
          property: {
            id: 2,
            title: 'Cozy PG Room in Bariatu',
            location: 'Bariatu, Ranchi',
            rent: 5000,
            image: '/images/apartment-placeholder.svg'
          },
          status: 'approved',
          requestedDate: '2024-01-10',
          moveInDate: '2024-01-20',
          message: 'Looking for PG accommodation near my workplace.'
        }
      ];

      const mockFavorites = [
        {
          id: 3,
          title: '1BHK Flat near Ranchi University',
          location: 'Morabadi, Ranchi',
          rent: 8000,
          image: '/images/apartment-placeholder.svg',
          type: 'flat'
        },
        {
          id: 4,
          title: 'Independent House in Kanke',
          location: 'Kanke, Ranchi',
          rent: 15000,
          image: '/images/apartment-placeholder.svg',
          type: 'house'
        }
      ];

      setBookings(mockBookings);
      setFavorites(mockFavorites);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchData) => {
    try {
      setLoading(true);
      setSearchFilters(searchData);
      
      // Mock search results - replace with actual API call
      const mockResults = [
        {
          id: 5,
          title: 'Modern Apartment in Harmu',
          type: 'apartment',
          rent: 10000,
          deposit: 20000,
          location: 'Harmu, Ranchi',
          area: 'harmu',
          image: '/images/apartment-placeholder.svg',
          verified: true,
          description: 'Modern apartment with all amenities',
          ratings: 4.4,
          bedrooms: 2,
          furnished: 'furnished'
        },
        {
          id: 6,
          title: 'PG Room near Doranda',
          type: 'pg',
          rent: 4500,
          deposit: 9000,
          location: 'Doranda, Ranchi',
          area: 'doranda',
          image: '/images/apartment-placeholder.svg',
          verified: true,
          description: 'Comfortable PG with good facilities',
          ratings: 4.1,
          bedrooms: 1,
          furnished: 'furnished'
        }
      ];
      
      setProperties(mockResults);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleFavorite = (propertyId) => {
    // Toggle favorite status
    setFavorites(prev => {
      const isFavorited = prev.some(fav => fav.id === propertyId);
      if (isFavorited) {
        return prev.filter(fav => fav.id !== propertyId);
      } else {
        const property = properties.find(p => p.id === propertyId);
        if (property) {
          return [...prev, property];
        }
        return prev;
      }
    });
  };

  const handleShare = (property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: property.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'approved': return CheckCircleIcon;
      case 'rejected': return XCircleIcon;
      default: return ClockIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Renter Dashboard
          </h1>
          <p className="text-gray-600">
            Find your perfect home in Ranchi with our verified properties
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'search', name: 'Search Properties', icon: MagnifyingGlassIcon },
                { id: 'bookings', name: 'My Bookings', icon: CalendarIcon },
                { id: 'favorites', name: 'Favorites', icon: HeartIcon }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search Properties Tab */}
          {activeTab === 'search' && (
            <div className="space-y-8">
              <PropertySearchForm onSearch={handleSearch} />
              
              {properties.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Search Results ({properties.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {properties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        onViewDetails={handleViewDetails}
                        onFavorite={handleFavorite}
                        onShare={handleShare}
                        isFavorited={favorites.some(fav => fav.id === property.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-64"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* My Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  My Booking Requests
                </h3>
                <span className="text-sm text-gray-500">
                  {bookings.length} total bookings
                </span>
              </div>

              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const StatusIcon = getStatusIcon(booking.status);
                    return (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card p-6"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={booking.property.image}
                            alt={booking.property.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {booking.property.title}
                              </h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
                                <StatusIcon className="w-4 h-4 mr-1" />
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPinIcon className="w-4 h-4 mr-1" />
                              <span className="text-sm">{booking.property.location}</span>
                            </div>
                            <div className="text-lg font-semibold text-primary-600 mb-2">
                              ₹{booking.property.rent.toLocaleString()}/month
                            </div>
                            <p className="text-gray-600 text-sm mb-3">
                              {booking.message}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              <span>Requested: {new Date(booking.requestedDate).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>Move-in: {new Date(booking.moveInDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                  <p className="text-gray-600 mb-6">Start searching for properties to make your first booking request.</p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="btn-primary"
                  >
                    Search Properties
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  My Favorite Properties
                </h3>
                <span className="text-sm text-gray-500">
                  {favorites.length} saved properties
                </span>
              </div>

              {favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favorites.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onViewDetails={handleViewDetails}
                      onFavorite={handleFavorite}
                      onShare={handleShare}
                      isFavorited={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Favorites Yet</h3>
                  <p className="text-gray-600 mb-6">Properties you favorite will appear here for easy access.</p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="btn-primary"
                  >
                    Search Properties
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RenterDashboard;
