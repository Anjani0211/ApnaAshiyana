import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UserIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  ArrowRightIcon,
  BellIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [chatUnread, setChatUnread] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = '/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // badge counts from localStorage
  useEffect(() => {
    const loadBadges = () => {
      const n = parseInt(localStorage.getItem('notifCount') || '0', 10);
      const c = parseInt(localStorage.getItem('chatUnread') || '0', 10);
      const f = parseInt(localStorage.getItem('favCount') || '0', 10);
      setNotifCount(Number.isNaN(n) ? 0 : n);
      setChatUnread(Number.isNaN(c) ? 0 : c);
      setFavCount(Number.isNaN(f) ? 0 : f);
    };
    loadBadges();
    const handler = () => loadBadges();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Properties', path: '/properties', icon: MagnifyingGlassIcon },
    { name: 'About', path: '/about', icon: UserIcon },
    { name: 'Contact', path: '/contact', icon: MapPinIcon },
  ];

  return (
    <motion.header 
      className="relative bg-gradient-to-r from-terracotta-600 via-ochre-500 to-forest-600 shadow-2xl fixed w-full top-0 z-50 border-b-4 border-ochre-400 overflow-hidden"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Tribal Pattern Overlay */}
      <div className="absolute inset-0 opacity-20 tribal-pattern"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-terracotta-700/30 via-transparent to-forest-700/30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-ochre-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <img src="/asiyana.png" alt="Kirayedar Logo" className="relative w-20 h-20 rounded-full border-4 border-ochre-300 shadow-lg group-hover:border-ochre-500 transition-all duration-300" />
              <motion.div 
                className="absolute -top-1 -right-1 w-6 h-6 bg-forest-500 rounded-full border-4 border-white shadow-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
            </motion.div>
            <div className="hidden sm:block">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-white via-ochre-200 to-white bg-clip-text text-transparent drop-shadow-lg"
                whileHover={{ scale: 1.05 }}
              >
                Kirayedar
              </motion.h1>
              <p className="text-xs text-white/90 font-medium">No Broker • Better Rooms</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 items-center">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="relative flex items-center space-x-1 px-5 py-2.5 text-white/90 hover:text-white rounded-xl transition-all duration-300 font-semibold group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-ochre-400/20 to-terracotta-400/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                  <item.icon className="relative w-5 h-5 group-hover:scale-125 transition-transform duration-300 z-10" />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-full text-white hover:text-ochre-200 hover:bg-white/10 transition"
                >
                  <BellIcon className="w-6 h-6" />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {notifCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/dashboard?tab=chat"
                  className="relative p-2 rounded-full text-white hover:text-ochre-200 hover:bg-white/10 transition"
                >
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                  {chatUnread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {chatUnread}
                    </span>
                  )}
                </Link>
                <Link
                  to="/dashboard?tab=favorites"
                  className="relative p-2 rounded-full text-white hover:text-ochre-200 hover:bg-white/10 transition"
                >
                  <HeartIcon className="w-6 h-6" />
                  {favCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                      {favCount}
                    </span>
                  )}
                </Link>
                <Link
                  to={dashboardPath}
                  className="flex items-center space-x-2 px-4 py-2 text-earth-800 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-all duration-200 font-medium"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-earth-800 hover:text-terracotta-600 hover:bg-terracotta-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="relative bg-gradient-to-r from-ochre-500 via-ochre-400 to-terracotta-500 text-white px-7 py-3 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative z-10 flex items-center">
                      Sign Up Free
                      <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:text-ochre-200 hover:bg-white/10 transition-all duration-200"
          >
            {isMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t-2 border-terracotta-200 bg-earth-50"
          >
            <div className="px-2 pt-3 pb-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-3 text-gray-700 hover:text-saffron-600 hover:bg-saffron-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {user ? (
                <div className="border-t-2 border-terracotta-200 pt-3 space-y-2">
                  <Link
                    to={dashboardPath}
                    className="flex items-center space-x-3 text-gray-700 hover:text-saffron-600 hover:bg-saffron-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserIcon className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left bg-red-500 text-white px-4 py-3 rounded-lg text-base font-medium hover:bg-red-600 transition-all duration-200 shadow-md"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t-2 border-terracotta-200 pt-3 space-y-2">
                  <Link
                    to="/login"
                    className="text-earth-800 hover:text-terracotta-600 hover:bg-terracotta-50 block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white px-4 py-3 rounded-lg text-base font-medium hover:from-terracotta-600 hover:to-terracotta-700 transition-all duration-200 block shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
