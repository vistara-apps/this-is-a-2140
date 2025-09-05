// useSubscription Hook - Simplified subscription management
import { useContext } from 'react';
import SubscriptionContext from '../context/SubscriptionContext';

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }

  return context;
};

// Helper hooks for common subscription checks
export const useIsPremium = () => {
  const { isPremium } = useSubscription();
  return isPremium();
};

export const useHasFeature = (featureName) => {
  const { hasFeature } = useSubscription();
  return hasFeature(featureName);
};

export const useFeatureLimit = (limitName) => {
  const { getFeatureLimit } = useSubscription();
  return getFeatureLimit(limitName);
};

export const useIsWithinLimit = (limitName, currentUsage) => {
  const { isWithinLimit } = useSubscription();
  return isWithinLimit(limitName, currentUsage);
};

// Custom hook for feature gating with upgrade prompts
export const useFeatureGate = (featureName, options = {}) => {
  const { hasFeature, isPremium } = useSubscription();
  const { 
    showUpgradePrompt = true, 
    fallbackMessage = 'This feature requires a premium subscription.' 
  } = options;

  const hasAccess = hasFeature(featureName);
  const needsUpgrade = !hasAccess && !isPremium();

  return {
    hasAccess,
    needsUpgrade,
    showUpgradePrompt: needsUpgrade && showUpgradePrompt,
    fallbackMessage: needsUpgrade ? fallbackMessage : null
  };
};

// Hook for usage tracking and limits
export const useUsageTracking = (limitName) => {
  const { getFeatureLimit, isWithinLimit } = useSubscription();
  
  const limit = getFeatureLimit(limitName);
  const isUnlimited = limit === 'unlimited';
  
  return {
    limit,
    isUnlimited,
    checkUsage: (currentUsage) => ({
      isWithinLimit: isWithinLimit(limitName, currentUsage),
      remaining: isUnlimited ? Infinity : Math.max(0, limit - currentUsage),
      percentage: isUnlimited ? 0 : Math.min(100, (currentUsage / limit) * 100)
    })
  };
};

export default useSubscription;

