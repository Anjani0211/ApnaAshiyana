import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (result.success) {
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 earth-texture flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-ochre-300/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-terracotta-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
          </div>

      <div className="relative sm:mx-auto sm:w-full sm:max-w-md z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <motion.div 
            className="relative w-16 h-16 bg-gradient-to-br from-terracotta-600 to-ochre-600 rounded-2xl flex items-center justify-center shadow-2xl"
            whileHover={{ rotateY: 15, rotateX: 5, scale: 1.1 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <HomeIcon className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          </motion.div>
        </motion.div>
        <motion.h2 
          className="text-center text-4xl font-black text-gray-900 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Create your <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-ochre-600">account</span>
        </motion.h2>
        <motion.p 
          className="text-center text-sm text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Join Kirayedar - Your trusted rental platform
        </motion.p>
      </div>

      <motion.div 
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div 
          className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border-2 border-earth-100"
          whileHover={{ y: -2 }}
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.05)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="mt-1">
                <motion.input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 sm:text-sm transition-all duration-200 ${
                    errors.name ? 'border-red-400' : 'border-earth-200'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 font-medium"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email address
              </label>
              <div className="mt-1">
                <motion.input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 sm:text-sm transition-all duration-200 ${
                    errors.email ? 'border-red-400' : 'border-earth-200'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 font-medium"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="mt-1">
                <motion.input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 sm:text-sm transition-all duration-200 ${
                    errors.phone ? 'border-red-400' : 'border-earth-200'
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 font-medium"
                  >
                    {errors.phone}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="mt-1">
                <motion.input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 sm:text-sm transition-all duration-200 ${
                    errors.password ? 'border-red-400' : 'border-earth-200'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 font-medium"
                  >
                    {errors.password}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="mt-1">
                <motion.input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 sm:text-sm transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-400' : 'border-earth-200'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 text-sm text-red-600 font-medium"
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05, y: loading ? 0 : -2 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-2xl text-base font-bold text-white bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-terracotta-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                style={{
                  boxShadow: '0 8px 24px rgba(194, 65, 12, 0.4)',
                }}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors">
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
