// Booking service for renter operations
import api from '../utils/api';

export const bookingService = {
  // Create booking request
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings (for renters)
  getUserBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Get booking requests for owner
  getMyRequests: async () => {
    const response = await api.get('/bookings/my-requests');
    return response.data;
  },

  // Get property bookings (for rent owners)
  getPropertyBookings: async (propertyId) => {
    const response = await api.get(`/bookings/property/${propertyId}`);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/bookings/${bookingId}`, { status });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  }
};
