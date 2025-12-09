import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="min-h-screen bg-earth-50 earth-texture flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-ochre-300/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-terracotta-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
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
          Sign in to <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-ochre-600">Kirayedar</span>
        </motion.h2>
        <motion.p 
          className="text-center text-sm text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your trusted rental platform in Ranchi
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
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="mt-1">
                <motion.input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 sm:text-sm transition-all duration-200 ${
                    errors.password ? 'border-red-400' : 'border-earth-200'
                  }`}
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors">
                  Forgot your password?
                </Link>
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
                {loading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>

           
          </div>

          <div className="mt-6">
            <div className="text-center">
              <span className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-terracotta-600 hover:text-terracotta-700 transition-colors">
                  Sign up
                </Link>
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;