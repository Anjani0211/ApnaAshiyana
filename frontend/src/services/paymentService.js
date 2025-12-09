// Payment service for premium access
import api from '../utils/api';

export const paymentService = {
  // Create payment order
  createPaymentOrder: async () => {
    const response = await api.post('/payment/create-order');
    return response.data;
  },

  // Verify payment
  verifyPayment: async (paymentData) => {
    const response = await api.post('/payment/verify', paymentData);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async () => {
    const response = await api.get('/payment/status');
    return response.data;
  }
};

