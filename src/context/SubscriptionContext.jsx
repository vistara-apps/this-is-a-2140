// Subscription Context - Manages user subscription state and premium features
import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

// Subscription tiers and their features
export const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      stateGuides: 1, // Only one state guide
      basicScripts: true,
      localRecording: true,
      basicAlerts: true,
      languages: ['en'], // English only
      cloudStorage: false,
      advancedScripts: false,
      multipleStates: false,
      encounterCards: false,
      prioritySupport: false
    },
    limits: {
      recordings: 5, // Max 5 recordings
      emergencyContacts: 2, // Max 2 emergency contacts
      stateGuides: 1 // Only primary state
    }
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    features: {
      stateGuides: 'unlimited',
      basicScripts: true,
      localRecording: true,
      basicAlerts: true,
      languages: ['en', 'es'], // English and Spanish
      cloudStorage: true,
      advancedScripts: true,
      multipleStates: true,
      encounterCards: true,
      prioritySupport: true
    },
    limits: {
      recordings: 'unlimited',
      emergencyContacts: 10,
      stateGuides: 'unlimited'
    }
  }
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load subscription data from localStorage on mount
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = () => {
    try {
      const savedSubscription = localStorage.getItem('pocket-protector-subscription');
      if (savedSubscription) {
        const parsedSubscription = JSON.parse(savedSubscription);
        setSubscription(parsedSubscription);
      } else {
        // Default to free tier
        setSubscription({
          tier: 'free',
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: null,
          paymentMethod: null,
          stripeCustomerId: null,
          stripeSubscriptionId: null
        });
      }
    } catch (error) {
      console.error('Error loading subscription data:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = (newSubscriptionData) => {
    try {
      const updatedSubscription = { ...subscription, ...newSubscriptionData };
      setSubscription(updatedSubscription);
      localStorage.setItem('pocket-protector-subscription', JSON.stringify(updatedSubscription));
      return true;
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError('Failed to update subscription');
      return false;
    }
  };

  const upgradeToPremium = async (paymentData) => {
    try {
      setLoading(true);
      
      // In a real app, this would call your backend API
      // For now, we'll simulate the upgrade
      const premiumSubscription = {
        tier: 'premium',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        paymentMethod: paymentData.paymentMethod || 'stripe',
        stripeCustomerId: paymentData.customerId,
        stripeSubscriptionId: paymentData.subscriptionId
      };

      const success = updateSubscription(premiumSubscription);
      if (success) {
        return { success: true, subscription: premiumSubscription };
      } else {
        throw new Error('Failed to update subscription');
      }
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      setError('Failed to upgrade subscription');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would call your backend API to cancel with Stripe
      const cancelledSubscription = {
        ...subscription,
        status: 'cancelled',
        endDate: new Date().toISOString()
      };

      const success = updateSubscription(cancelledSubscription);
      if (success) {
        return { success: true };
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError('Failed to cancel subscription');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getCurrentTier = () => {
    if (!subscription) return SUBSCRIPTION_TIERS.FREE;
    return SUBSCRIPTION_TIERS[subscription.tier.toUpperCase()] || SUBSCRIPTION_TIERS.FREE;
  };

  const hasFeature = (featureName) => {
    const currentTier = getCurrentTier();
    return currentTier.features[featureName] === true || 
           currentTier.features[featureName] === 'unlimited';
  };

  const getFeatureLimit = (limitName) => {
    const currentTier = getCurrentTier();
    return currentTier.limits[limitName];
  };

  const isWithinLimit = (limitName, currentUsage) => {
    const limit = getFeatureLimit(limitName);
    if (limit === 'unlimited') return true;
    return currentUsage < limit;
  };

  const isPremium = () => {
    return subscription?.tier === 'premium' && subscription?.status === 'active';
  };

  const isSubscriptionActive = () => {
    if (!subscription) return false;
    if (subscription.status !== 'active') return false;
    if (subscription.endDate && new Date(subscription.endDate) < new Date()) {
      return false;
    }
    return true;
  };

  const getDaysUntilExpiry = () => {
    if (!subscription?.endDate) return null;
    const expiryDate = new Date(subscription.endDate);
    const now = new Date();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const value = {
    subscription,
    loading,
    error,
    currentTier: getCurrentTier(),
    upgradeToPremium,
    cancelSubscription,
    updateSubscription,
    hasFeature,
    getFeatureLimit,
    isWithinLimit,
    isPremium,
    isSubscriptionActive,
    getDaysUntilExpiry,
    SUBSCRIPTION_TIERS
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;

