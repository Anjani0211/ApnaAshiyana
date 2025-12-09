import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { paymentService } from '../services/paymentService';
import { useAuth } from './AuthContext';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [hasPaid, setHasPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check payment status from user object first (from backend)
    if (isAuthenticated && user) {
      // User object from backend should have hasPaid field
      if (user.hasPaid !== undefined) {
        setHasPaid(user.hasPaid);
        if (user.hasPaid) {
          localStorage.setItem('hasPaid', 'true');
        }
      } else {
        // Fallback to API check
        checkPaymentStatus();
      }
    } else {
      // Check localStorage for non-authenticated users
      const paymentStatus = localStorage.getItem('hasPaid');
      setHasPaid(paymentStatus === 'true');
    }
  }, [isAuthenticated, user]);

  const checkPaymentStatus = async () => {
    if (!isAuthenticated) {
      setHasPaid(false);
      return;
    }
    
    try {
      // Always check from database via API
      const response = await paymentService.getPaymentStatus();
      const hasPaidStatus = response.data?.hasPaid || response.data?.data?.hasPaid || false;
      setHasPaid(hasPaidStatus);
    } catch (error) {
      console.error('Error checking payment status from database:', error);
      // If API fails, default to false (secure by default)
      setHasPaid(false);
    }
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to make payment');
      return;
    }

    try {
      setLoading(true);
      
      // Create payment order
      const orderResponse = await paymentService.createPaymentOrder();
      
      console.log('Payment order response:', orderResponse);
      
      // Check if already paid
      if (orderResponse.alreadyPaid) {
        await checkPaymentStatus();
        toast.success('You already have premium access!');
        setLoading(false);
        return;
      }

      // Extract order, key, and amount from response (paymentService returns response.data)
      const { order, key, amount } = orderResponse;
      
      if (!order || !order.id) {
        console.error('Invalid order response:', orderResponse);
        throw new Error('Invalid payment order response. Please contact support.');
      }
      
      if (!key && !import.meta.env.VITE_RAZORPAY_KEY && !import.meta.env.VITE_RAZORPAY_KEY_ID) {
        throw new Error('Payment gateway not configured. Please contact support.');
      }
      
      // Initialize Razorpay
      const options = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: 'INR',
        name: 'Kirayedar',
        description: 'Premium Access - View All Properties & List Your Own',
        image: '/logo.svg',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment with backend - updates database
            await paymentService.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            });

            // Refresh payment status from database
            await checkPaymentStatus();
            toast.success('Payment successful! You now have premium access to all features!');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || 'User',
          email: user?.email || 'user@example.com',
          contact: user?.phone || '9999999999'
        },
        theme: {
          color: '#c2410c' // Terracotta color for Adivasi theme
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
            setLoading(false);
          }
        }
      };

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
          razorpay.on('payment.failed', function (response) {
            console.error('Payment failed:', response.error);
            toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
            setLoading(false);
          });
        };
        document.body.appendChild(script);
      } else {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        razorpay.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
          setLoading(false);
        });
      }

    } catch (error) {
      console.error('Error processing payment:', error);
      console.error('Error response:', error.response);
      
      // Extract error message from response
      let errorMessage = 'Error processing payment. Please try again.';
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      error.response.data.error?.message ||
                      errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const value = {
    hasPaid,
    loading,
    handlePayment,
    checkPaymentStatus
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export { PaymentContext };

