import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  ShieldCheckIcon,
  UserIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { PropertySearchForm, PropertyCard } from '../../shared/components';
import RanchiMap from '../../../components/RanchiMap';
import AnimatedHouse from '../../../components/AnimatedHouse';
import { propertyService } from '../../../services/propertyService';

const LandingPage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      // Mock data for demo - replace with actual API call
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
          description: 'Beautiful 2BHK apartment located in the heart of Mesra, just 5 minutes walk from BIT Mesra campus.',
          ratings: 4.5,
          bedrooms: 2,
          furnished: 'furnished'
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
          ratings: 4.2,
          bedrooms: 1,
          furnished: 'furnished'
        },
        {
          id: 3,
          title: '1BHK Flat near Ranchi University',
          type: 'flat',
          rent: 8000,
          deposit: 16000,
          location: 'Morabadi, Ranchi',
          area: 'morabadi',
          image: '/images/apartment-placeholder.svg',
          verified: true,
          description: 'Modern 1BHK flat perfect for students and working professionals',
          ratings: 4.3,
          bedrooms: 1,
          furnished: 'semi-furnished'
        },
        {
          id: 4,
          title: 'Independent House in Kanke',
          type: 'house',
          rent: 15000,
          deposit: 30000,
          location: 'Kanke, Ranchi',
          area: 'kanke',
          image: '/images/apartment-placeholder.svg',
          verified: true,
          description: 'Spacious independent house with garden and parking',
          ratings: 4.7,
          bedrooms: 3,
          furnished: 'furnished'
        }
      ];
      
      setFeaturedProperties(mockProperties);
      // const response = await propertyService.getFeaturedProperties();
      // setFeaturedProperties(response.data);
    } catch (error) {
      console.error('Error loading featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchData) => {
    try {
      setLoading(true);
      setShowSearchResults(true);
      
      // Mock search results - replace with actual API call
      const mockResults = featuredProperties.filter(property => {
        if (searchData.location && !property.area.toLowerCase().includes(searchData.location.toLowerCase())) {
          return false;
        }
        if (searchData.propertyType && property.type !== searchData.propertyType) {
          return false;
        }
        if (searchData.maxRent && property.rent > parseInt(searchData.maxRent)) {
          return false;
        }
        return true;
      });
      
      setSearchResults(mockResults);
      // const response = await propertyService.searchProperties(searchData);
      // setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (propertyId) => {
    window.location.href = `/properties/${propertyId}`;
  };

  const handleFavorite = (propertyId) => {
    // Handle favorite functionality
    console.log('Favorited property:', propertyId);
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
    { number: '98%', label: 'Satisfaction Rate', icon: StarIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden min-h-screen flex items-center">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-6">
                <span className="inline-block bg-yellow-300 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  🏠 No Broker • Direct Owner Connection
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Find Your Perfect Home in{' '}
                <span className="text-yellow-300 bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                  Ranchi
                </span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
                Kirayedar connects students, professionals, and families with verified property owners 
                through a transparent, broker-free process. Your dream home awaits in Jharkhand's capital.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <motion.a 
                  href="#search" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300"
                >
                  <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
                  Search Properties
                </motion.a>
                <motion.a 
                  href="/about" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center bg-transparent text-white border-2 border-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  Learn More
                </motion.a>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-8 text-white/80">
                <div className="flex items-center">
                  <ShieldCheckIcon className="w-5 h-5 mr-2" />
                  <span className="text-sm">Verified Properties</span>
                </div>
                <div className="flex items-center">
                  <UserIcon className="w-5 h-5 mr-2" />
                  <span className="text-sm">Direct Owner Contact</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="w-5 h-5 mr-2" />
                  <span className="text-sm">98% Satisfaction</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <AnimatedHouse />
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 bg-white/20 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="text-white text-sm font-semibold">500+ Properties</div>
                </motion.div>
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-20 left-10 bg-white/20 backdrop-blur-sm rounded-2xl p-4"
                >
                  <div className="text-white text-sm font-semibold">1000+ Happy Tenants</div>
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

          <PropertySearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Search Results */}
      {showSearchResults && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Search Results
              </h3>
              <p className="text-gray-600">
                Found {searchResults.length} properties matching your criteria
              </p>
            </motion.div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-64"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onViewDetails={handleViewDetails}
                    onFavorite={handleFavorite}
                    onShare={handleShare}
                  />
                ))}
              </div>
            )}

            {!loading && searchResults.length === 0 && (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria to find more properties.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Properties */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-primary-100 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✨ Featured Properties
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Handpicked Properties in{' '}
              <span className="text-primary-600">Prime Locations</span>
            </h2>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-primary-700 transition-all duration-300"
            >
              View All Properties
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Kirayedar?
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300">
                    <Icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-white/90">{stat.label}</div>
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
              <RanchiMap properties={featuredProperties} />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Find Your Perfect Home?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied tenants who found their ideal homes through Kirayedar's 
              transparent, broker-free platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Get Started Today
              </a>
              <a href="/properties" className="btn glass-effect text-white border-white hover:bg-white hover:text-primary-600 px-8 py-4 text-lg">
                Browse Properties
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
