import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ShieldCheckIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  MapPinIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  HeartIcon
} from '@heroicons/react/24/outline';
import PropertySearch from '../components/PropertySearch';
import RanchiMap from '../components/RanchiMap';
import AnimatedHouse from '../components/AnimatedHouse';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProperties = [
    {
      id: 1,
      title: '2BHK Apartment near BIT Mesra',
      type: 'apartment',
      rent: 12000,
      location: 'Mesra, Ranchi',
      image: '/images/apartment-placeholder.svg',
      verified: true,
      coordinates: [23.4241, 85.4419]
    },
    {
      id: 2,
      title: 'Single Room PG near Ranchi University',
      type: 'pg',
      rent: 6000,
      location: 'Morabadi, Ranchi',
      image: '/images/pg-placeholder.svg',
      verified: true,
      coordinates: [23.3441, 85.3096]
    },
    {
      id: 3,
      title: '3BHK Independent House in Bariatu',
      type: 'house',
      rent: 18000,
      location: 'Bariatu, Ranchi',
      image: '/images/house-placeholder.svg',
      verified: true,
      coordinates: [23.3569, 85.3346]
    },
    {
      id: 4,
      title: 'Hostel Bed near NIT Jamshedpur',
      type: 'hostel',
      rent: 4500,
      location: 'Adityapur, Jamshedpur',
      image: '/images/hostel-placeholder.svg',
      verified: false,
      coordinates: [22.7868, 86.1847]
    }
  ];

  const ranchiHighlights = [
    {
      icon: AcademicCapIcon,
      title: 'Educational Hub',
      description: 'Home to prestigious institutions like BIT Mesra, Ranchi University, and XLRI'
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Growing IT Sector',
      description: 'Emerging as a major IT destination with multiple tech parks and startups'
    },
    {
      icon: HeartIcon,
      title: 'Cultural Heritage',
      description: 'Rich tribal culture and natural beauty with waterfalls and hills nearby'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProperties.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative gradient-bg text-white py-20 md:py-32 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 opacity-10 rounded-full blur-3xl animate-float animation-delay-400"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center lg:text-left"
            >
              <motion.h1 
                variants={itemVariants}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading leading-tight"
              >
                Find Your Perfect
                <span className="block text-yellow-400">Rental Home</span>
                <span className="block text-2xl md:text-3xl lg:text-4xl mt-2">in Ranchi</span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl mb-8 max-w-2xl text-white/90"
              >
                Jharkhand's educational capital welcomes you! Find verified rooms, PGs, and apartments 
                near top colleges and IT hubs with quick onboarding and secure transactions.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
              >
                <Link to="/properties" className="btn btn-primary bg-white text-primary-600 hover:bg-gray-100">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  Browse Properties
                </Link>
                <Link to="/register" className="btn glass-effect text-white border-white hover:bg-white hover:text-primary-600">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Join Kirayedar
                </Link>
              </motion.div>

              {/* Search Form */}
              <motion.div variants={itemVariants} className="w-full max-w-2xl mx-auto lg:mx-0">
                <PropertySearch />
              </motion.div>
            </motion.div>

            {/* Animated House Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="w-full h-full flex items-center justify-center min-h-[400px]"
            >
              <div className="w-full h-full max-w-md">
                <AnimatedHouse />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ranchi Map Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Explore Ranchi Properties
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Discover available rentals across Ranchi's prime locations. Click on pins to view property details.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <RanchiMap properties={featuredProperties} />
          </motion.div>
        </div>
      </section>

      {/* Why Ranchi Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose Ranchi?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Jharkhand's capital city offers the perfect blend of education, career opportunities, and quality of life.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {ranchiHighlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="card p-8 text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{highlight.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{highlight.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Featured Properties in Ranchi
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Handpicked verified properties near educational institutions and prime locations
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card overflow-hidden group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {property.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center shadow-lg">
                      <ShieldCheckIcon className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black bg-opacity-50 text-white text-xs font-medium px-2 py-1 rounded-lg">
                    {property.type.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPinIcon className="w-4 h-4 mr-2" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-primary-600 font-bold text-lg">
                      ₹{property.rent.toLocaleString()}/month
                    </div>
                    <Link
                      to={`/properties/${property.id}`}
                      className="text-primary-600 hover:text-primary-800 font-medium text-sm hover:underline transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link to="/properties" className="btn btn-primary">
              View All Properties in Ranchi
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-12"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              How Kirayedar Works
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Simple, quick, and secure - find your ideal rental in Ranchi in just 3 easy steps
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MagnifyingGlassIcon,
                title: 'Search Properties',
                description: 'Browse verified listings across Ranchi with advanced filters for location, budget, and amenities',
                step: '01'
              },
              {
                icon: UserIcon,
                title: 'Quick Onboarding',
                description: 'Sign up in minutes with simple verification. Connect directly with property owners',
                step: '02'
              },
              {
                icon: HomeIcon,
                title: 'Move In Hassle-Free',
                description: 'Complete secure booking through our platform and move into your new home in Ranchi',
                step: '03'
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative text-center p-8"
                >
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm font-bold text-gray-900">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-400 opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Find Your Home in Ranchi?
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl mb-8 max-w-3xl mx-auto text-white/90"
            >
              Join hundreds of students and professionals who found their perfect rental through Kirayedar
            </motion.p>
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Link to="/properties" className="btn bg-white text-primary-600 hover:bg-gray-100 transform hover:scale-105">
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                Browse Properties
              </Link>
              <Link to="/register" className="btn glass-effect text-white border-white hover:bg-white hover:text-primary-600 transform hover:scale-105">
                <UserIcon className="w-5 h-5 mr-2" />
                Sign Up Free
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
