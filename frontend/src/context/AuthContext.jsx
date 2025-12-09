import React, { createContext, useState, useContext, useEffect } from 'react';
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

  // Check if user is logged in on mount - verify from server
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // Always verify from server
          const res = await api.get('/users/me');
          const userData = res.data.data || res.data.user || null;
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error('No user data');
          }
        } catch (error) {
          // Token invalid - try refresh token
          try {
            const refreshRes = await api.post('/users/refresh-token');
            if (refreshRes.data.token) {
              localStorage.setItem('token', refreshRes.data.token);
              api.defaults.headers.common['Authorization'] = `Bearer ${refreshRes.data.token}`;
              setUser(refreshRes.data.user);
              setIsAuthenticated(true);
              localStorage.setItem('user', JSON.stringify(refreshRes.data.user));
            } else {
              throw new Error('Refresh failed');
            }
          } catch (refreshError) {
            // Both failed - clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setIsAuthenticated(false);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/users/login', {
        email,
        password
      });

      const { token, user: userData } = response.data;

      // Store token
      localStorage.setItem('token', token);
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } else {
        // Fetch profile if backend doesn't return user in login response
        const me = await api.get('/users/me');
        const user = me.data.data || me.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
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
      const response = await api.post('/users/register', userData);

      const { token, user: newUser } = response.data;

      // Store token
      localStorage.setItem('token', token);
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      } else {
        const me = await api.get('/users/me');
        const user = me.data.data || me.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
      
      // Set authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
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

  // Logout function - clear server-side session
  const logout = async () => {
    try {
      // Call server to clear refresh token and session
      await api.get('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token from storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Remove authorization header
      delete api.defaults.headers.common['Authorization'];
      
      // Clear state
      setUser(null);
      setIsAuthenticated(false);
      
      toast.info('You have been logged out successfully');
    }
  };

  // Update user profile
  const updateUser = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/updatedetails', userData);
      
      setUser(response.data.data || response.data.user);
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
      await api.post('/users/forgotpassword', { email });
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
      await api.put(`/users/resetpassword/${token}`, { password });
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
