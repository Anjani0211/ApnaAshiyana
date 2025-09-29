import React, { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { toast } from 'react-toastify';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setIsAuthenticated(true);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Token expired, remove it
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate API call
      if (email === 'demo@kirayedar.com' && password === 'demo123') {
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email: 'demo@kirayedar.com',
          phone: '+91 9876543210',
          userType: 'tenant',
          isEmailVerified: true,
          avatar: null
        };
        
        const mockToken = 'demo_token_' + Date.now();
        
        // Store token
        localStorage.setItem('token', mockToken);
        
        // Set authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        
        // Update state
        setUser(mockUser);
        setIsAuthenticated(true);
        
        toast.success('Welcome back to Kirayedar!');
        return { success: true };
      }
      
      // Real API call would go here
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, user: userData } = response.data;

      // Store token
      localStorage.setItem('token', token);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      toast.success('Welcome back to Kirayedar!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      
      // For demo purposes, simulate API call
      const mockUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        userType: userData.userType,
        isEmailVerified: false,
        avatar: null
      };
      
      const mockToken = 'demo_token_' + Date.now();
      
      // Store token
      localStorage.setItem('token', mockToken);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      // Update state
      setUser(mockUser);
      setIsAuthenticated(true);
      
      toast.success('Welcome to Kirayedar! Your account has been created successfully.');
      return { success: true };
      
      // Real API call would go here
      const response = await api.post('/auth/register', userData);

      const { token, user: newUser } = response.data;

      // Store token
      localStorage.setItem('token', token);
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser(newUser);
      setIsAuthenticated(true);
      
      toast.success('Welcome to Kirayedar! Your account has been created successfully.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from storage
    localStorage.removeItem('token');
    
    // Remove authorization header
    delete api.defaults.headers.common['Authorization'];
    
    // Clear state
    setUser(null);
    setIsAuthenticated(false);
    
    toast.info('You have been logged out successfully');
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put('/auth/profile', userData);
      
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      toast.success('Password reset link sent to your email');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset link';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, { password });
      toast.success('Password reset successfully. You can now login with your new password.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      const response = await api.post(`/auth/verify-email/${token}`);
      
      // Update user with verified status
      if (isAuthenticated) {
        setUser(prev => ({ ...prev, isEmailVerified: true }));
      }
      
      toast.success('Email verified successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    forgotPassword,
    resetPassword,
    verifyEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
