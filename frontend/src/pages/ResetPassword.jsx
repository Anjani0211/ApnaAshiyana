import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { KeyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { userService } from '../services/userService';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resettoken } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!resettoken) {
      toast.error('Invalid reset token');
      navigate('/forgot-password');
    }
  }, [resettoken, navigate]);

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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
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
      await userService.resetPassword(resettoken, formData.password);
      setSuccess(true);
      toast.success('Password reset successfully! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || 'Error resetting password. Please try again.';
      toast.error(errorMessage);
      
      // If token is invalid or expired, redirect to forgot password
      if (error.response?.status === 400 || error.response?.status === 404) {
        setTimeout(() => {
          navigate('/forgot-password');
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-earth-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative sm:mx-auto sm:w-full sm:max-w-md z-10"
        >
          <motion.div 
            className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border-2 border-earth-100 text-center"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.05)',
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-semibold text-terracotta-600 hover:text-terracotta-700 transition-colors"
            >
              Go to Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
          Reset Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-600 to-ochre-600">Password</span>
        </motion.h2>
        <motion.p 
          className="text-center text-sm text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Enter your new password below
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
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                New Password
              </label>
              <div className="mt-1">
                <motion.input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 sm:text-sm transition-all duration-200 ${
                    errors.password ? 'border-red-400' : 'border-earth-200'
                  }`}
                  placeholder="Enter new password"
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
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  whileFocus={{ scale: 1.02 }}
                  className={`appearance-none block w-full px-4 py-3 border-2 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 sm:text-sm transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-400' : 'border-earth-200'
                  }`}
                  placeholder="Confirm new password"
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
                {loading ? 'Resetting...' : 'Reset Password'}
              </motion.button>
            </div>
          </form>

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

export default ResetPassword;
