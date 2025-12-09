import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { KeyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
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
      await userService.forgotPassword(email);
      setSubmitted(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Error sending reset email. Please try again.';
      toast.error(errorMessage);
      setErrors({ email: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background tribal patterns and circles */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full tribal-pattern opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      ></motion.div>
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-ochre-400/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -50, 0],
          y: [0, 30, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>
      <motion.div
        className="absolute top-20 left-10 w-80 h-80 bg-terracotta-400/20 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      ></motion.div>

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
            <KeyIcon className="w-10 h-10 text-white" />
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
          Forgot <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-ochre-600">Password</span>?
        </motion.h2>
        <motion.p 
          className="text-center text-sm text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Enter your email to receive a password reset link
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
          {!submitted ? (
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
                    value={email}
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </motion.button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
              >
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-4">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  Please check your inbox and click on the link to reset your password.
                  The link will expire in 10 minutes.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="w-full text-sm text-terracotta-600 hover:text-terracotta-700 font-semibold"
                >
                  Send to a different email
                </button>
              </div>
            </motion.div>
          )}

          <div className="mt-6">
            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
