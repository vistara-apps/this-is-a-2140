// Stripe Service - Handles payment processing and subscription management
import axios from 'axios';

// Stripe configuration
const STRIPE_CONFIG = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.pocketprotector.app',
  priceIds: {
    premium_monthly: process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly'
  }
};

class StripeService {
  constructor() {
    this.stripe = null;
    this.initialized = false;
  }

  // Initialize Stripe
  async initialize() {
    if (this.initialized) return this.stripe;

    try {
      // Load Stripe.js dynamically
      if (!window.Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      this.stripe = window.Stripe(STRIPE_CONFIG.publishableKey);
      this.initialized = true;
      return this.stripe;
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
      throw new Error('Payment system unavailable');
    }
  }

  // Create payment intent for one-time purchases
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiBaseUrl}/api/payments/create-intent`, {
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          ...metadata,
          source: 'pocket-protector'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  // Create subscription checkout session
  async createSubscriptionCheckout(priceId, customerId = null, metadata = {}) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiBaseUrl}/api/subscriptions/create-checkout`, {
        priceId,
        customerId,
        successUrl: `${window.location.origin}/subscription/success`,
        cancelUrl: `${window.location.origin}/subscription/cancelled`,
        metadata: {
          ...metadata,
          source: 'pocket-protector'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      throw new Error('Failed to create subscription checkout');
    }
  }

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId) {
    try {
      await this.initialize();
      const { error } = await this.stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Checkout redirect failed:', error);
      throw new Error('Failed to redirect to checkout');
    }
  }

  // Process card payment with Payment Element
  async processCardPayment(clientSecret, paymentElement) {
    try {
      await this.initialize();
      
      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: paymentElement,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`
        }
      });

      if (error) {
        throw error;
      }

      return paymentIntent;
    } catch (error) {
      console.error('Card payment failed:', error);
      throw new Error(error.message || 'Payment failed');
    }
  }

  // Create customer
  async createCustomer(email, name, metadata = {}) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiBaseUrl}/api/customers/create`, {
        email,
        name,
        metadata: {
          ...metadata,
          source: 'pocket-protector'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw new Error('Failed to create customer account');
    }
  }

  // Get customer subscriptions
  async getCustomerSubscriptions(customerId) {
    try {
      const response = await axios.get(`${STRIPE_CONFIG.apiBaseUrl}/api/customers/${customerId}/subscriptions`);
      return response.data;
    } catch (error) {
      console.error('Failed to get subscriptions:', error);
      throw new Error('Failed to retrieve subscription information');
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiBaseUrl}/api/subscriptions/${subscriptionId}/cancel`, {
        cancelAtPeriodEnd
      });

      return response.data;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  // Update subscription
  async updateSubscription(subscriptionId, updates) {
    try {
      const response = await axios.patch(`${STRIPE_CONFIG.apiBaseUrl}/api/subscriptions/${subscriptionId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId) {
    try {
      const response = await axios.get(`${STRIPE_CONFIG.apiBaseUrl}/api/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get subscription:', error);
      throw new Error('Failed to retrieve subscription details');
    }
  }

  // Create setup intent for saving payment methods
  async createSetupIntent(customerId, metadata = {}) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiBaseUrl}/api/setup-intents/create`, {
        customerId,
        metadata: {
          ...metadata,
          source: 'pocket-protector'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create setup intent:', error);
      throw new Error('Failed to setup payment method');
    }
  }

  // Get customer payment methods
  async getPaymentMethods(customerId) {
    try {
      const response = await axios.get(`${STRIPE_CONFIG.apiBaseUrl}/api/customers/${customerId}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Failed to get payment methods:', error);
      throw new Error('Failed to retrieve payment methods');
    }
  }

  // Detach payment method
  async detachPaymentMethod(paymentMethodId) {
    try {
      const response = await axios.post(`${STRIPE_CONFIG.apiBaseUrl}/api/payment-methods/${paymentMethodId}/detach`);
      return response.data;
    } catch (error) {
      console.error('Failed to detach payment method:', error);
      throw new Error('Failed to remove payment method');
    }
  }

  // Handle webhook events (for backend integration)
  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
          return this.handleSubscriptionCreated(event.data.object);
        case 'customer.subscription.updated':
          return this.handleSubscriptionUpdated(event.data.object);
        case 'customer.subscription.deleted':
          return this.handleSubscriptionDeleted(event.data.object);
        case 'invoice.payment_succeeded':
          return this.handlePaymentSucceeded(event.data.object);
        case 'invoice.payment_failed':
          return this.handlePaymentFailed(event.data.object);
        default:
          console.log(`Unhandled event type: ${event.type}`);
          return { received: true };
      }
    } catch (error) {
      console.error('Webhook handling failed:', error);
      throw error;
    }
  }

  // Webhook handlers
  async handleSubscriptionCreated(subscription) {
    console.log('Subscription created:', subscription.id);
    // Update user subscription status in your database
    return { received: true };
  }

  async handleSubscriptionUpdated(subscription) {
    console.log('Subscription updated:', subscription.id);
    // Update user subscription status in your database
    return { received: true };
  }

  async handleSubscriptionDeleted(subscription) {
    console.log('Subscription deleted:', subscription.id);
    // Update user subscription status in your database
    return { received: true };
  }

  async handlePaymentSucceeded(invoice) {
    console.log('Payment succeeded:', invoice.id);
    // Handle successful payment
    return { received: true };
  }

  async handlePaymentFailed(invoice) {
    console.log('Payment failed:', invoice.id);
    // Handle failed payment
    return { received: true };
  }

  // Utility methods
  formatAmount(amount, currency = 'usd') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount);
  }

  // Get price configuration
  getPriceIds() {
    return STRIPE_CONFIG.priceIds;
  }

  // Check if Stripe is available
  isAvailable() {
    return this.initialized && this.stripe !== null;
  }
}

// Create singleton instance
const stripeService = new StripeService();

export default stripeService;

// Named exports for convenience
export {
  stripeService,
  STRIPE_CONFIG
};

