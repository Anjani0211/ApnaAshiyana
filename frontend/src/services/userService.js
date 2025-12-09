// User service for authentication and user management
import api from '../utils/api';

export const userService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/updatedetails', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/users/updatepassword', passwordData);
    return response.data;
  },

  // Logout user
  logout: async () => {
    const response = await api.get('/users/logout');
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/users/forgotpassword', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/users/resetpassword/${token}`, { password });
    return response.data;
  },

  // Favorites management
  getFavorites: async () => {
    const response = await api.get('/users/favorites');
    return response.data;
  },

  addToFavorites: async (propertyId) => {
    const response = await api.post(`/users/favorites/${propertyId}`);
    return response.data;
  },

  removeFromFavorites: async (propertyId) => {
    const response = await api.delete(`/users/favorites/${propertyId}`);
    return response.data;
  },

  checkFavorite: async (propertyId) => {
    const response = await api.get(`/users/favorites/${propertyId}`);
    return response.data;
  }
};
