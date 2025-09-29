import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  PlusIcon,
  HomeIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { PropertyCard } from '../../shared/components';
import { propertyService } from '../../../services/propertyService';
import { bookingService } from '../../../services/bookingService';

const RentOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [showAddProperty, setShowAddProperty] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo - replace with actual API calls
      const mockProperties = [
        {
          id: 1,
          title: '2BHK Apartment near BIT Mesra',
          type: 'apartment',
          rent: 12000,
          deposit: 24000,
          location: 'Mesra, Ranchi',
          area: 'mesra',
          image: '/images/apartment-placeholder.svg',
          verified: true,
          description: 'Beautiful 2BHK apartment located in the heart of Mesra',
          status: 'available',
          views: 45,
          bookings: 3,
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          title: 'Cozy PG Room in Bariatu',
          type: 'pg',
          rent: 5000,
          deposit: 10000,
          location: 'Bariatu, Ranchi',
          area: 'bariatu',
          image: '/images/apartment-placeholder.svg',
          verified: true,
          description: 'Comfortable PG accommodation with all facilities',
          status: 'occupied',
          views: 32,
          bookings: 1,
          createdAt: '2024-01-05'
        }
      ];

      const mockBookings = [
        {
          id: 1,
          property: {
            id: 1,
            title: '2BHK Apartment near BIT Mesra',
            image: '/images/apartment-placeholder.svg'
          },
          tenant: {
            name: 'Rajesh Kumar',
            phone: '+91 9876543210',
            email: 'rajesh@example.com'
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
            image: '/images/apartment-placeholder.svg'
          },
          tenant: {
            name: 'Priya Sharma',
            phone: '+91 9876543211',
            email: 'priya@example.com'
          },
          status: 'approved',
          requestedDate: '2024-01-10',
          moveInDate: '2024-01-20',
          message: 'Looking for PG accommodation near my workplace.'
        }
      ];

      const mockStats = {
        totalProperties: 2,
        activeBookings: 2,
        totalRevenue: 17000,
        occupancyRate: 50
      };

      setProperties(mockProperties);
      setBookings(mockBookings);
      setStats(mockStats);

      // const propertiesResponse = await propertyService.getUserProperties();
      // const bookingsResponse = await bookingService.getPropertyBookings();
      // const statsResponse = await propertyService.getUserStats();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (propertyId) => {
    window.location.href = `/properties/${propertyId}`;
  };

  const handleEditProperty = (propertyId) => {
    window.location.href = `/properties/edit/${propertyId}`;
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        // await propertyService.deleteProperty(propertyId);
        setProperties(prev => prev.filter(p => p.id !== propertyId));
        console.log('Property deleted successfully');
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      // await bookingService.updateBookingStatus(bookingId, status);
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status } : booking
      ));
      console.log('Booking status updated successfully');
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      case 'available': return 'text-green-600 bg-green-100';
      case 'occupied': return 'text-blue-600 bg-blue-100';
      case 'maintenance': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return ClockIcon;
      case 'approved': return CheckCircleIcon;
      case 'rejected': return XCircleIcon;
      case 'available': return CheckCircleIcon;
      case 'occupied': return UserIcon;
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Rent Owner Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your properties and bookings efficiently
              </p>
            </div>
            <button
              onClick={() => setShowAddProperty(true)}
              className="btn-primary flex items-center"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Property
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Properties', value: stats.totalProperties, icon: HomeIcon, color: 'text-blue-600' },
            { label: 'Active Bookings', value: stats.activeBookings, icon: CalendarIcon, color: 'text-green-600' },
            { label: 'Monthly Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: CurrencyRupeeIcon, color: 'text-purple-600' },
            { label: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: ChartBarIcon, color: 'text-orange-600' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center">
                  <div className={`w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'properties', name: 'My Properties', icon: HomeIcon },
                { id: 'bookings', name: 'Booking Requests', icon: CalendarIcon },
                { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
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
          transition={{ delay: 0.3 }}
        >
          {/* My Properties Tab */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  My Properties ({properties.length})
                </h3>
              </div>

              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => {
                    const StatusIcon = getStatusIcon(property.status);
                    return (
                      <motion.div
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card overflow-hidden"
                      >
                        <div className="relative">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(property.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {property.title}
                          </h4>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            <span className="text-sm">{property.location}</span>
                          </div>
                          <div className="text-xl font-bold text-primary-600 mb-3">
                            ₹{property.rent.toLocaleString()}/month
                          </div>
                          
                          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                            <div className="flex items-center">
                              <EyeIcon className="w-4 h-4 mr-1" />
                              <span>{property.views} views</span>
                            </div>
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              <span>{property.bookings} bookings</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(property.id)}
                              className="flex-1 btn-secondary text-sm"
                            >
                              <EyeIcon className="w-4 h-4 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleEditProperty(property.id)}
                              className="flex-1 btn-primary text-sm"
                            >
                              <PencilIcon className="w-4 h-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
                              className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <HomeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Yet</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first property to begin earning rental income.</p>
                  <button
                    onClick={() => setShowAddProperty(true)}
                    className="btn-primary"
                  >
                    Add Your First Property
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Booking Requests Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Booking Requests ({bookings.length})
                </h3>
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
                            
                            <div className="mb-3">
                              <h5 className="font-medium text-gray-900 mb-1">Tenant Information</h5>
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center">
                                  <UserIcon className="w-4 h-4 mr-2" />
                                  <span>{booking.tenant.name}</span>
                                </div>
                                <div className="flex items-center">
                                  <PhoneIcon className="w-4 h-4 mr-2" />
                                  <span>{booking.tenant.phone}</span>
                                </div>
                                <div className="flex items-center">
                                  <EnvelopeIcon className="w-4 h-4 mr-2" />
                                  <span>{booking.tenant.email}</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-3">
                              {booking.message}
                            </p>

                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <CalendarIcon className="w-4 h-4 mr-1" />
                              <span>Requested: {new Date(booking.requestedDate).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>Move-in: {new Date(booking.moveInDate).toLocaleDateString()}</span>
                            </div>

                            {booking.status === 'pending' && (
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'approved')}
                                  className="btn-primary text-sm"
                                >
                                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleBookingStatusUpdate(booking.id, 'rejected')}
                                  className="btn-secondary text-sm"
                                >
                                  <XCircleIcon className="w-4 h-4 mr-1" />
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Booking Requests</h3>
                  <p className="text-gray-600 mb-6">Booking requests from potential tenants will appear here.</p>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Property Analytics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h4>
                  <div className="space-y-3">
                    {properties.map((property) => (
                      <div key={property.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{property.title}</p>
                          <p className="text-sm text-gray-600">{property.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{property.views} views</p>
                          <p className="text-sm text-gray-600">{property.bookings} bookings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Properties</span>
                      <span className="font-semibold">{stats.totalProperties}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monthly Revenue</span>
                      <span className="font-semibold text-green-600">₹{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Occupancy Rate</span>
                      <span className="font-semibold text-blue-600">{stats.occupancyRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RentOwnerDashboard;
