import React from 'react';
import { motion } from 'framer-motion';
import { 
  InformationCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
  BuildingOffice2Icon,
  AcademicCapIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const AboutUs = () => {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'No Broker Policy',
      description: 'Direct owner-tenant connection eliminates middlemen and reduces costs significantly.',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: UserGroupIcon,
      title: 'Verified Properties',
      description: 'Every property and owner undergoes thorough verification for your safety and peace of mind.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: HeartIcon,
      title: 'Trusted Platform',
      description: 'Join thousands of satisfied tenants who found their perfect homes through our platform.',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: CheckCircleIcon,
      title: 'Transparent Process',
      description: 'Complete transparency in pricing, terms, and conditions with no hidden charges.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const team = [
    {
      name: 'Rajesh Kumar',
      role: 'Founder & CEO',
      image: '/images/team-1.jpg',
      description: 'Passionate about revolutionizing the rental market in Ranchi.'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of Operations',
      image: '/images/team-2.jpg',
      description: 'Ensuring smooth operations and customer satisfaction.'
    },
    {
      name: 'Amit Singh',
      role: 'Technology Lead',
      image: '/images/team-3.jpg',
      description: 'Building innovative solutions for property management.'
    }
  ];

  const milestones = [
    { year: '2023', title: 'Founded', description: 'Kirayedar was established with a vision to transform rental experience' },
    { year: '2024', title: '100+ Properties', description: 'Successfully listed over 100 verified properties across Ranchi' },
    { year: '2024', title: '500+ Users', description: 'Helped over 500 tenants find their perfect homes' },
    { year: '2024', title: 'Expansion', description: 'Planning to expand to other cities in Jharkhand' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <InformationCircleIcon className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="text-yellow-300">Kirayedar</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your trusted rental platform in Ranchi, Jharkhand. We're revolutionizing the rental experience 
              with transparency, trust, and technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To revolutionize the rental market in Ranchi by eliminating middlemen, reducing costs, 
                and providing a seamless experience for both property owners and tenants.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Zero Broker Fees</h3>
                    <p className="text-gray-600">Save money on every transaction with our broker-free platform.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Direct Communication</h3>
                    <p className="text-gray-600">Connect directly with property owners without any intermediaries.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Legal Agreements</h3>
                    <p className="text-gray-600">Secure rental agreements for safe and legal transactions.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <BuildingOffice2Icon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">100+</div>
                    <div className="text-gray-600">Properties Listed</div>
                  </div>
                  <div className="text-center">
                    <UserGroupIcon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-gray-600">Happy Tenants</div>
                  </div>
                  <div className="text-center">
                    <ShieldCheckIcon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">50+</div>
                    <div className="text-gray-600">Verified Owners</div>
                  </div>
                  <div className="text-center">
                    <StarIcon className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <div className={`w-20 h-20 ${feature.bgColor} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-xl transition-all duration-300`}>
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

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The passionate people behind Kirayedar, working to make rental experience better for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:shadow-xl transition-all duration-300">
                  <UserGroupIcon className="w-16 h-16 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-primary-600 font-medium mb-3">{member.role}</div>
                <p className="text-gray-600">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From a small startup to Ranchi's leading rental platform.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                      <div className="text-primary-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-primary-600 rounded-full border-4 border-white shadow-lg flex-shrink-0"></div>
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Have questions or need help? We're here to assist you with all your rental needs.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <PhoneIcon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-white/90">+91 9876543210</p>
              </div>
              <div className="text-center">
                <EnvelopeIcon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                <p className="text-white/90">info@kirayedar.com</p>
              </div>
              <div className="text-center">
                <MapPinIcon className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
                <p className="text-white/90">Ranchi, Jharkhand</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
