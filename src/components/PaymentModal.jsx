// Payment Modal Component - Handles subscription and one-time payments
import React, { useState, useEffect } from 'react';
import { X, Crown, CreditCard, Check, AlertCircle } from 'lucide-react';
import { useStripePayment, useStripeElements } from '../hooks/useStripePayment';
import { useSubscription } from '../hooks/useSubscription';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  type = 'subscription', // 'subscription' or 'one-time'
  amount = 4.99,
  description = 'Premium Subscription',
  onSuccess,
  onError
}) => {
  const [step, setStep] = useState('plan'); // 'plan', 'payment', 'processing', 'success', 'error'
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [paymentError, setPaymentError] = useState(null);
  
  const { 
    createPremiumSubscription, 
    processOneTimePayment, 
    loading, 
    error, 
    clearError 
  } = useStripePayment();
  
  const { SUBSCRIPTION_TIERS } = useSubscription();

  useEffect(() => {
    if (isOpen) {
      setStep('plan');
      setPaymentError(null);
      clearError();
    }
  }, [isOpen, clearError]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    if (type === 'subscription') {
      setStep('payment');
    }
  };

  const handleSubscriptionUpgrade = async () => {
    try {
      setStep('processing');
      
      // Get user info (in real app, this would come from user context)
      const userEmail = localStorage.getItem('pocket-protector-user-email') || 'user@example.com';
      const userName = localStorage.getItem('pocket-protector-user-name') || 'User';
      
      const result = await createPremiumSubscription(userEmail, userName);
      
      if (result.success) {
        setStep('success');
        onSuccess?.(result);
      } else {
        setStep('error');
        setPaymentError(result.error);
        onError?.(result.error);
      }
    } catch (err) {
      setStep('error');
      setPaymentError(err.message);
      onError?.(err.message);
    }
  };

  const handleOneTimePayment = async () => {
    try {
      setStep('processing');
      
      const result = await processOneTimePayment(amount, description, {
        type: 'one-time',
        product: description
      });
      
      if (result.success) {
        setStep('success');
        onSuccess?.(result);
      } else {
        setStep('error');
        setPaymentError(result.error);
        onError?.(result.error);
      }
    } catch (err) {
      setStep('error');
      setPaymentError(err.message);
      onError?.(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg max-w-md w-full border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {type === 'subscription' ? 'Choose Your Plan' : 'Complete Purchase'}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'plan' && (
            <PlanSelection
              type={type}
              selectedPlan={selectedPlan}
              onPlanSelect={handlePlanSelect}
              amount={amount}
              description={description}
            />
          )}

          {step === 'payment' && (
            <PaymentStep
              selectedPlan={selectedPlan}
              onSubscribe={handleSubscriptionUpgrade}
              onOneTime={handleOneTimePayment}
              type={type}
              loading={loading}
            />
          )}

          {step === 'processing' && (
            <ProcessingStep type={type} />
          )}

          {step === 'success' && (
            <SuccessStep type={type} onClose={handleClose} />
          )}

          {step === 'error' && (
            <ErrorStep 
              error={paymentError || error} 
              onRetry={() => setStep('payment')}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Plan Selection Step
const PlanSelection = ({ type, selectedPlan, onPlanSelect, amount, description }) => {
  const { SUBSCRIPTION_TIERS } = useSubscription();

  if (type === 'one-time') {
    return (
      <div className="text-center">
        <div className="bg-accent/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <CreditCard className="w-10 h-10 text-accent" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          ${amount}
        </h3>
        <p className="text-gray-300 mb-6">{description}</p>
        <button
          onClick={() => onPlanSelect('one-time')}
          className="w-full bg-accent hover:bg-teal-600 text-white py-3 rounded-md font-medium transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Free Plan */}
      <div className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        selectedPlan === 'free' 
          ? 'border-accent bg-accent/10' 
          : 'border-gray-700 hover:border-gray-600'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Free</h3>
          <span className="text-2xl font-bold text-white">$0</span>
        </div>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>1 state guide</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Basic scripts</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Local recording</span>
          </li>
        </ul>
      </div>

      {/* Premium Plan */}
      <div className={`border rounded-lg p-4 cursor-pointer transition-colors relative ${
        selectedPlan === 'premium' 
          ? 'border-accent bg-accent/10' 
          : 'border-gray-700 hover:border-gray-600'
      }`}
      onClick={() => onPlanSelect('premium')}>
        <div className="absolute -top-2 left-4 bg-accent text-white px-2 py-1 rounded text-xs font-medium">
          Recommended
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-white">Premium</h3>
            <Crown className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">${SUBSCRIPTION_TIERS.PREMIUM.price}</span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
        </div>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>All 50 state guides</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Multi-language support</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Cloud recording backup</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Advanced scripts</span>
          </li>
          <li className="flex items-center space-x-2">
            <Check className="w-4 h-4 text-green-400" />
            <span>Shareable encounter cards</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

// Payment Step
const PaymentStep = ({ selectedPlan, onSubscribe, onOneTime, type, loading }) => {
  const { SUBSCRIPTION_TIERS } = useSubscription();
  const plan = SUBSCRIPTION_TIERS[selectedPlan?.toUpperCase()] || SUBSCRIPTION_TIERS.PREMIUM;

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-800 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">
          {type === 'subscription' ? `${plan.name} Plan` : 'Purchase Summary'}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-gray-300">
            {type === 'subscription' ? 'Monthly subscription' : 'One-time purchase'}
          </span>
          <span className="text-white font-semibold">
            ${type === 'subscription' ? plan.price : '0.99'}
          </span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={type === 'subscription' ? onSubscribe : onOneTime}
        disabled={loading}
        className="w-full bg-accent hover:bg-teal-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>
              {type === 'subscription' ? 'Subscribe Now' : 'Purchase'}
            </span>
          </>
        )}
      </button>

      {/* Security Notice */}
      <div className="text-center">
        <p className="text-gray-400 text-xs">
          Secure payment powered by Stripe. Your payment information is encrypted and secure.
        </p>
      </div>
    </div>
  );
};

// Processing Step
const ProcessingStep = ({ type }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
    <h3 className="text-white font-semibold mb-2">Processing Payment</h3>
    <p className="text-gray-400">
      {type === 'subscription' 
        ? 'Setting up your premium subscription...' 
        : 'Processing your purchase...'
      }
    </p>
  </div>
);

// Success Step
const SuccessStep = ({ type, onClose }) => (
  <div className="text-center py-8">
    <div className="bg-green-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
      <Check className="w-10 h-10 text-green-400" />
    </div>
    <h3 className="text-white font-semibold mb-2">
      {type === 'subscription' ? 'Welcome to Premium!' : 'Purchase Complete!'}
    </h3>
    <p className="text-gray-400 mb-6">
      {type === 'subscription' 
        ? 'Your premium features are now active.' 
        : 'Your purchase was successful.'
      }
    </p>
    <button
      onClick={onClose}
      className="bg-accent hover:bg-teal-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
    >
      Continue
    </button>
  </div>
);

// Error Step
const ErrorStep = ({ error, onRetry, onClose }) => (
  <div className="text-center py-8">
    <div className="bg-red-500/20 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
      <AlertCircle className="w-10 h-10 text-red-400" />
    </div>
    <h3 className="text-white font-semibold mb-2">Payment Failed</h3>
    <p className="text-gray-400 mb-6">{error || 'Something went wrong. Please try again.'}</p>
    <div className="flex space-x-3">
      <button
        onClick={onClose}
        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md font-medium transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onRetry}
        className="flex-1 bg-accent hover:bg-teal-600 text-white py-2 rounded-md font-medium transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default PaymentModal;

