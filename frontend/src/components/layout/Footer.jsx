import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'FAQ', path: '/faq' },
    ],
    legal: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    services: [
      { name: 'Find Properties', path: '/properties' },
      { name: 'List Property', path: '/properties/add' },
      { name: 'Renter Dashboard', path: '/renter/dashboard' },
    ]
  };

  const features = [
    { icon: ShieldCheckIcon, text: 'Verified Properties' },
    { icon: UserGroupIcon, text: 'No Broker Fees' },
    { icon: StarIcon, text: '98% Satisfaction' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content Grid - All in one div */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12">
          {/* Company Info - Left Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-terracotta-600 rounded-xl flex items-center justify-center">
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Kirayedar</h2>
                <p className="text-ochre-400 text-sm">Your Trusted Rental Platform</p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Your trusted partner for finding and listing rental properties in Ranchi, Jharkhand. 
              No brokers, complete transparency, and hassle-free rental agreements.
            </p>

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-terracotta-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300 font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Contact Info - Middle Column */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Get in Touch</h3>
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-terracotta-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">+91 9876543210</p>
                  <p className="text-gray-400 text-sm">Call us anytime</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-terracotta-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">info@kirayedar.com</p>
                  <p className="text-gray-400 text-sm">Email us for support</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-terracotta-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Ranchi, Jharkhand</p>
                  <p className="text-gray-400 text-sm">Our location</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Navigation Links - Right Column */}
          <div className="space-y-8">
            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-ochre-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Services</h3>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-ochre-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-ochre-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-gray-300 text-sm mb-4 md:mb-0">
            © {currentYear} Kirayedar. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-300">
              <span className="text-sm">Made with</span>
              <HeartIcon className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-sm">in Ranchi</span>
            </div>
            <div className="text-gray-500 text-sm">
              No Broker • Direct Owner Connection
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
