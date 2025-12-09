import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  ShieldCheckIcon,
  UserIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { PropertySearchForm, PropertyCard } from '../../shared/components';
import RanchiMap from '../../../components/RanchiMap';
import AnimatedHouse from '../../../components/AnimatedHouse';
import { propertyService } from '../../../services/propertyService';
import { getRandomPropertyImage } from '../../../utils/images';
import { useAuth } from '../../../context/AuthContext';
import { usePayment } from '../../../context/PaymentContext';
import { toast } from 'react-toastify';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { hasPaid, handlePayment } = usePayment();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  // Results are now handled on the /properties page via navigation

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      // Load featured properties from API
      const response = await propertyService.getFeaturedProperties();
      const properties = response.data || [];
      
      // Transform API data to match component expectations and remove duplicates
      const uniquePropertiesMap = new Map();
      
      properties.forEach(prop => {
        const id = prop._id?.toString() || prop.id?.toString();
        if (id && !uniquePropertiesMap.has(id)) {
          uniquePropertiesMap.set(id, {
            id: id,
            title: prop.title,
            type: prop.propertyType || prop.type,
            rent: prop.rent,
            deposit: prop.deposit,
            location: prop.address 
              ? `${prop.address.area || ''}, ${prop.address.city || 'Ranchi'}`
              : prop.location || 'Ranchi',
            area: prop.address?.area || prop.area,
            coordinates: prop.location?.coordinates || [85.3096, 23.3441], // [lng, lat] for map
            image: prop.images && prop.images.length > 0
              ? (prop.images[0].startsWith('http') || prop.images[0].startsWith('/')
                  ? prop.images[0]
                  : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/uploads/properties/${prop.images[0]}`)
              : getRandomPropertyImage(),
            verified: prop.isVerified || false,
            description: prop.description,
            views: prop.views || 0,
            likes: prop.likes || 0,
            bedrooms: prop.furnishingDetails?.beds || prop.bedrooms,
            furnished: prop.furnishingStatus,
            address: prop.address, // Keep address for map component
            propertyType: prop.propertyType || prop.type
          });
        }
      });
      
      const transformedProperties = Array.from(uniquePropertiesMap.values());
      // Limit to 4 featured properties
      setFeaturedProperties(transformedProperties.slice(0, 4));
    } catch (error) {
      console.error('Error loading featured properties:', error);
      setFeaturedProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {};

  const handleViewDetails = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleFavorite = async (propertyId) => {
    if (!isAuthenticated) {
      toast.info('Please login to add to favorites');
      navigate('/login');
      return;
    }
    
    try {
      const { userService } = await import('../../../services/userService');
      const checkResponse = await userService.checkFavorite(propertyId);
      
      if (checkResponse.isFavorite) {
        await userService.removeFromFavorites(propertyId);
        toast.success('Removed from favorites');
      } else {
        await userService.addToFavorites(propertyId);
        toast.success('Added to favorites');
      }
      
      // Reload featured properties to update favorite status
      loadFeaturedProperties();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
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

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'No Broker Policy',
      description: 'Direct owner-tenant connection. No middlemen, no hidden fees.',
      color: 'text-green-600'
    },
    {
      icon: UserIcon,
      title: 'Verified Properties',
      description: 'Every property and owner is thoroughly verified for your safety.',
      color: 'text-blue-600'
    },
    {
      icon: HeartIcon,
      title: 'Trusted Platform',
      description: 'Join thousands of satisfied tenants who found their perfect home.',
      color: 'text-red-600'
    }
  ];

  const stats = [
    { number: `${featuredProperties.length * 25}+`, label: 'Properties Listed', icon: HomeIcon },
    { number: `${featuredProperties.length * 50}+`, label: 'Happy Tenants', icon: UserIcon },
    { number: `${featuredProperties.length * 5}+`, label: 'Verified Owners', icon: ShieldCheckIcon },
    { number: '98%', label: 'Satisfaction Rate', icon: ShieldCheckIcon }
  ];

  return (
    <div className="min-h-screen bg-earth-50 earth-texture">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center" style={{ marginTop: '-96px', paddingTop: '96px' }}>
        {/* Dynamic Background with Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-700 via-ochre-600 to-forest-700"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-ochre-500/40 via-transparent to-terracotta-600/40"></div>
        <div className="absolute inset-0 tribal-pattern opacity-30"></div>
        
        {/* Animated Tribal Circles */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-ochre-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-terracotta-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        ></motion.div>
        
        {/* Floating Tribal Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-ochre-300/40 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.span 
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl border-2 border-ochre-300/50"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-lg">🏠</span>
                  <span>No Broker • Direct Owner Connection</span>
                </motion.span>
              </motion.div>
              
              <motion.h1 
                className="text-4xl md:text-6xl font-black mb-6 leading-tight perspective-1000"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.span 
                  className="block text-white drop-shadow-2xl"
                  style={{
                    textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)',
                    transform: 'translateZ(20px)',
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    textShadow: '0 6px 12px rgba(0,0,0,0.4), 0 12px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  Find Your Perfect
                </motion.span>
                <motion.span 
                  className="block text-white drop-shadow-2xl"
                  style={{
                    textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)',
                    transform: 'translateZ(20px)',
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    textShadow: '0 6px 12px rgba(0,0,0,0.4), 0 12px 24px rgba(0,0,0,0.3)',
                  }}
                >
                  Home in
                </motion.span>
                <motion.span 
                  className="block bg-gradient-to-r from-ochre-300 via-ochre-200 to-ochre-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0%', '100%', '0%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ 
                    backgroundSize: '200%',
                    textShadow: '0 4px 8px rgba(212, 160, 23, 0.4), 0 8px 16px rgba(212, 160, 23, 0.3)',
                    transform: 'translateZ(30px)',
                    filter: 'drop-shadow(0 0 20px rgba(212, 160, 23, 0.5))',
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    filter: 'drop-shadow(0 0 30px rgba(212, 160, 23, 0.7))',
                  }}
                >
                  Ranchi
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-base md:text-lg text-white/95 mb-6 leading-relaxed max-w-xl font-medium drop-shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Kirayedar connects students, professionals, and families with verified property owners 
                through a transparent, broker-free process. Your dream home awaits in Jharkhand's capital.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.a 
                  href="#search" 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative inline-flex items-center justify-center bg-white text-terracotta-700 hover:bg-ochre-50 px-6 py-3 text-base font-bold rounded-xl shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-ochre-400 to-ochre-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2 relative z-10 group-hover:rotate-90 transition-transform" />
                  <span className="relative z-10">Search Properties</span>
                  <ArrowRightIcon className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.a>
                <motion.a 
                  href="/about" 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group inline-flex items-center justify-center bg-transparent text-white border-2 border-white/80 hover:border-white hover:bg-white/10 backdrop-blur-sm px-6 py-3 text-base font-bold rounded-xl transition-all duration-300 shadow-xl"
                >
                  Learn More
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex flex-wrap items-center gap-3 text-white/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[
                  { icon: ShieldCheckIcon, text: 'Verified Properties', color: 'text-ochre-300' },
                  { icon: UserIcon, text: 'Direct Owner Contact', color: 'text-ochre-300' },
                      { icon: ShieldCheckIcon, text: '98% Satisfaction', color: 'text-ochre-300' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className={`w-4 h-4 mr-1.5 ${item.color}`} />
                    <span className="text-xs font-semibold">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 80, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className="relative w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
                {/* Glowing Background Circle */}
                <motion.div
                  className="absolute w-96 h-96 bg-ochre-300/30 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                ></motion.div>
                
                <div className="relative z-10">
                  <AnimatedHouse />
                </div>
                
                {/* Enhanced Floating Elements */}
                <motion.div
                  animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 bg-gradient-to-br from-white/30 to-ochre-200/30 backdrop-blur-md rounded-2xl p-5 shadow-2xl border-2 border-white/40"
                >
                  <div className="text-white text-base font-bold flex items-center gap-2">
                    <HomeIcon className="w-5 h-5 text-ochre-300" />
                    <span>500+ Properties</span>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ y: [15, -15, 15], rotate: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-20 left-10 bg-gradient-to-br from-white/30 to-terracotta-200/30 backdrop-blur-md rounded-2xl p-5 shadow-2xl border-2 border-white/40"
                >
                  <div className="text-white text-base font-bold flex items-center gap-2">
                    <HeartIcon className="w-5 h-5 text-terracotta-300" />
                    <span>1000+ Happy Tenants</span>
                  </div>
                </motion.div>
                
                {/* Additional Floating Badge */}
                <motion.div
                  animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute top-1/2 right-5 bg-gradient-to-br from-forest-400/40 to-forest-500/40 backdrop-blur-md rounded-xl p-4 shadow-xl border-2 border-forest-300/50"
                >
                  <div className="text-white text-sm font-bold">Verified Owners</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section id="search" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Search Properties in Ranchi
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Use our advanced search to find the perfect property that matches your needs and budget.
            </p>
          </motion.div>

          <PropertySearchForm navigateOnSearch={true} />
        </div>
      </section>

      {/* Search Results moved to /properties page for cleaner flow */}

      {/* Featured Properties */}
      <section className="py-20 bg-gradient-to-br from-earth-50 via-white to-earth-50 earth-texture">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div 
              className="inline-block bg-gradient-to-r from-ochre-100 to-ochre-50 text-terracotta-700 px-5 py-2.5 rounded-full text-sm font-bold mb-4 border border-ochre-200 shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              ✨ Featured Properties
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              style={{ transformStyle: 'preserve-3d' }}
            >
              Handpicked Properties in{' '}
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-ochre-600"
                style={{
                  textShadow: '0 2px 4px rgba(194, 65, 12, 0.2)',
                  transform: 'translateZ(10px)',
                }}
                whileHover={{ scale: 1.05 }}
              >
                Prime Locations
              </motion.span>
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated selection of verified properties in the best areas of Ranchi. 
              Each property is personally verified for quality and authenticity.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="animate-pulse"
                >
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-gray-200 h-48"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group"
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
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16"
          >
            <motion.a 
              href="/properties" 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-gradient-to-r from-terracotta-600 to-terracotta-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:from-terracotta-700 hover:to-terracotta-800 transition-all duration-300"
              style={{
                boxShadow: '0 8px 24px rgba(194, 65, 12, 0.4)',
              }}
            >
              View All Properties
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-white via-earth-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-ochre-600">Kirayedar</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the rental experience in Ranchi with transparency, trust, and technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="text-center group perspective-1000"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-white to-earth-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border-2 border-earth-200 group-hover:shadow-2xl transition-all duration-300"
                    whileHover={{ rotateY: 10, rotateX: 5, scale: 1.1 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      <Icon className={`w-10 h-10 ${feature.color === 'text-green-600' ? 'text-forest-600' : feature.color === 'text-blue-600' ? 'text-terracotta-600' : 'text-terracotta-600'}`} />
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-700 via-ochre-600 to-forest-700"></div>
        <div className="absolute inset-0 tribal-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="text-center text-white perspective-1000"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div 
                    className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white/30 shadow-2xl"
                    whileHover={{ rotateY: 15, rotateX: 5, scale: 1.1 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <motion.div 
                    className="text-4xl font-black mb-2"
                    style={{ 
                      textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                      transform: 'translateZ(20px)',
                    }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Properties Across Ranchi
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our properties on the interactive map. Find the perfect location for your needs.
            </p>
          </motion.div>

          <div className="card p-6">
            <div className="h-96 rounded-lg overflow-hidden">
              <RanchiMap 
                properties={featuredProperties}
                onPaymentClick={() => {
                  if (isAuthenticated) {
                    handlePayment();
                  } else {
                    navigate('/register');
                  }
                }}
              />
            </div>
            {!hasPaid && isAuthenticated && (
              <motion.div 
                className="mt-4 p-6 bg-gradient-to-r from-ochre-50 via-ochre-100 to-terracotta-50 border-2 border-ochre-300 rounded-2xl text-center shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-base text-gray-800 mb-4 font-semibold">
                  💡 Pay ₹199 to unlock property locations, contact details, and list your own properties!
                </p>
                <motion.button
                  onClick={handlePayment}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300"
                  style={{
                    boxShadow: '0 8px 24px rgba(194, 65, 12, 0.4)',
                  }}
                >
                  <span>Unlock Premium Access - ₹199</span>
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </motion.button>
              </motion.div>
            )}
            {!isAuthenticated && (
              <div className="h-96 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative">
                <div className="text-center p-8">
                  <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Map Location Locked</h3>
                  <p className="text-gray-600 mb-4">
                    {!isAuthenticated 
                      ? 'Register and pay ₹199 to view property locations on map'
                      : 'Pay ₹199 to view property locations on map'}
                  </p>
                  {!isAuthenticated ? (
                    <button
                      onClick={() => navigate('/register')}
                      className="btn-primary"
                    >
                      Register Now
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/properties')}
                      className="btn-primary"
                    >
                      Go to Properties & Pay
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta-700 via-ochre-600 to-forest-700"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-ochre-500/30 via-transparent to-terracotta-600/30"></div>
        <div className="absolute inset-0 tribal-pattern opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-black mb-4 text-white"
              style={{
                textShadow: '0 4px 8px rgba(0,0,0,0.3), 0 8px 16px rgba(0,0,0,0.2)',
                transform: 'translateZ(20px)',
              }}
            >
              Ready to Find Your Perfect Home?
            </motion.h2>
            <p className="text-xl text-white/95 mb-8 max-w-3xl mx-auto font-medium">
              Join thousands of satisfied tenants who found their ideal homes through Kirayedar's 
              transparent, broker-free platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.a 
                href="/register" 
                className="btn bg-white text-terracotta-700 hover:bg-ochre-50 px-8 py-4 text-lg font-bold shadow-2xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 8px 24px rgba(255,255,255,0.3)',
                }}
              >
                Get Started Today
              </motion.a>
              <motion.a 
                href="/properties" 
                className="btn glass-effect text-white border-2 border-white/80 hover:bg-white hover:text-terracotta-700 px-8 py-4 text-lg font-bold backdrop-blur-md"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}
              >
                Browse Properties
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
