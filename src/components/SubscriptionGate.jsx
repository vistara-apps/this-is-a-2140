// Subscription Gate Component - Controls access to premium features
import React, { useState } from 'react';
import { Lock, Crown, ArrowRight, X } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

const SubscriptionGate = ({ 
  feature, 
  children, 
  fallback = null, 
  showUpgradeModal = true,
  upgradeMessage,
  className = ""
}) => {
  const { hasFeature, currentTier, SUBSCRIPTION_TIERS } = useSubscription();
  const [showModal, setShowModal] = useState(false);
  
  const hasAccess = hasFeature(feature);
  
  if (hasAccess) {
    return children;
  }

  const premiumTier = SUBSCRIPTION_TIERS.PREMIUM;
  const defaultMessage = `This feature requires a Premium subscription. Upgrade for just $${premiumTier.price}/month to unlock all features.`;

  const handleUpgradeClick = () => {
    if (showUpgradeModal) {
      setShowModal(true);
    }
  };

  if (fallback) {
    return fallback;
  }

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Blurred/Disabled Content */}
        <div className="filter blur-sm opacity-50 pointer-events-none">
          {children}
        </div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
          <div className="text-center p-6">
            <div className="bg-yellow-500/20 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Premium Feature</h3>
            <p className="text-gray-300 text-sm mb-4 max-w-xs">
              {upgradeMessage || defaultMessage}
            </p>
            <button
              onClick={handleUpgradeClick}
              className="bg-accent hover:bg-teal-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <UpgradeModal onClose={() => setShowModal(false)} feature={feature} />
      )}
    </>
  );
};

// Upgrade Modal Component
const UpgradeModal = ({ onClose, feature }) => {
  const { currentTier, SUBSCRIPTION_TIERS, upgradeToPremium } = useSubscription();
  const [loading, setLoading] = useState(false);
  
  const premiumTier = SUBSCRIPTION_TIERS.PREMIUM;
  
  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // This would integrate with Stripe in a real app
      const result = await upgradeToPremium({
        paymentMethod: 'stripe',
        // In real implementation, these would come from Stripe
        customerId: 'cus_demo',
        subscriptionId: 'sub_demo'
      });
      
      if (result.success) {
        onClose();
        // Show success message
        alert('Successfully upgraded to Premium!');
      } else {
        alert('Upgrade failed. Please try again.');
      }
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-md w-full border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Upgrade to Premium</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-accent/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Crown className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              ${premiumTier.price}<span className="text-lg text-gray-400">/month</span>
            </h3>
            <p className="text-gray-300">Unlock all premium features</p>
          </div>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-gray-300">All 50 state legal guides</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-gray-300">Multi-language support</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-gray-300">Cloud recording backup</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-gray-300">Advanced scripted responses</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-gray-300">Shareable encounter cards</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span className="text-gray-300">Priority support</span>
            </div>
          </div>

          {/* Current Plan */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <h4 className="text-white font-medium mb-2">Current Plan: {currentTier.name}</h4>
            <p className="text-gray-400 text-sm">
              You're currently on the {currentTier.name.toLowerCase()} plan with limited features.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md font-medium transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="flex-1 bg-accent hover:bg-teal-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  <span>Upgrade Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple inline gate for smaller features
export const InlineSubscriptionGate = ({ feature, children, upgradeText = "Upgrade to Premium" }) => {
  const { hasFeature } = useSubscription();
  const [showModal, setShowModal] = useState(false);
  
  if (hasFeature(feature)) {
    return children;
  }

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-3">
          <Lock className="w-5 h-5 text-yellow-400" />
          <span className="text-gray-300">Premium Feature</span>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-accent hover:bg-teal-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          {upgradeText}
        </button>
      </div>
      
      {showModal && (
        <UpgradeModal onClose={() => setShowModal(false)} feature={feature} />
      )}
    </>
  );
};

export default SubscriptionGate;

