// useStripePayment Hook - Simplified Stripe payment integration
import { useState, useCallback } from 'react';
import stripeService from '../services/stripeService';
import { useSubscription } from './useSubscription';

export const useStripePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { updateSubscription } = useSubscription();

  // Initialize Stripe
  const initializeStripe = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await stripeService.initialize();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create premium subscription
  const createPremiumSubscription = useCallback(async (userEmail, userName) => {
    try {
      setLoading(true);
      setError(null);

      // Initialize Stripe if not already done
      await stripeService.initialize();

      // Create customer
      const customer = await stripeService.createCustomer(userEmail, userName, {
        app: 'pocket-protector',
        plan: 'premium'
      });

      // Get premium price ID
      const priceIds = stripeService.getPriceIds();
      
      // Create checkout session
      const session = await stripeService.createSubscriptionCheckout(
        priceIds.premium_monthly,
        customer.id,
        {
          userEmail,
          userName,
          plan: 'premium'
        }
      );

      // Redirect to Stripe Checkout
      await stripeService.redirectToCheckout(session.id);

      return { success: true, sessionId: session.id };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Process one-time payment (for individual state guides)
  const processOneTimePayment = useCallback(async (amount, description, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);

      await stripeService.initialize();

      // Create payment intent
      const paymentIntent = await stripeService.createPaymentIntent(amount, 'usd', {
        description,
        ...metadata
      });

      return { 
        success: true, 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async (subscriptionId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await stripeService.cancelSubscription(subscriptionId, true);
      
      // Update local subscription state
      await updateSubscription({
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });

      return { success: true, subscription: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [updateSubscription]);

  // Get subscription details
  const getSubscriptionDetails = useCallback(async (subscriptionId) => {
    try {
      setLoading(true);
      setError(null);

      const subscription = await stripeService.getSubscription(subscriptionId);
      return { success: true, subscription };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update payment method
  const updatePaymentMethod = useCallback(async (customerId) => {
    try {
      setLoading(true);
      setError(null);

      // Create setup intent for updating payment method
      const setupIntent = await stripeService.createSetupIntent(customerId, {
        usage: 'off_session'
      });

      return { 
        success: true, 
        clientSecret: setupIntent.client_secret 
      };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Get customer payment methods
  const getPaymentMethods = useCallback(async (customerId) => {
    try {
      setLoading(true);
      setError(null);

      const paymentMethods = await stripeService.getPaymentMethods(customerId);
      return { success: true, paymentMethods };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove payment method
  const removePaymentMethod = useCallback(async (paymentMethodId) => {
    try {
      setLoading(true);
      setError(null);

      await stripeService.detachPaymentMethod(paymentMethodId);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Format currency amount
  const formatAmount = useCallback((amount, currency = 'usd') => {
    return stripeService.formatAmount(amount, currency);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    initializeStripe,
    createPremiumSubscription,
    processOneTimePayment,
    cancelSubscription,
    getSubscriptionDetails,
    updatePaymentMethod,
    getPaymentMethods,
    removePaymentMethod,
    formatAmount,
    clearError,
    isStripeAvailable: stripeService.isAvailable()
  };
};

// Hook for handling Stripe Elements
export const useStripeElements = () => {
  const [elements, setElements] = useState(null);
  const [stripe, setStripe] = useState(null);

  const initializeElements = useCallback(async (clientSecret) => {
    try {
      await stripeService.initialize();
      const stripeInstance = await stripeService.stripe;
      
      const elementsInstance = stripeInstance.elements({
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#14b8a6', // accent color
            colorBackground: '#1f2937', // surface color
            colorText: '#ffffff',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '6px'
          }
        }
      });

      setStripe(stripeInstance);
      setElements(elementsInstance);

      return { stripe: stripeInstance, elements: elementsInstance };
    } catch (error) {
      console.error('Failed to initialize Stripe Elements:', error);
      throw error;
    }
  }, []);

  return {
    stripe,
    elements,
    initializeElements
  };
};

export default useStripePayment;

