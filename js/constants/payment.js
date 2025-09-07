/**
 * Payment Constants - Stripe Payment Integration for Einbürgerungstest Module
 * 
 * 🔒 SECURITY: This implementation uses Stripe's secure payment processing
 * - NO card details are stored or handled by our frontend/backend
 * - Stripe Elements securely collect card information in isolated iframes
 * - PCI DSS compliance is handled entirely by Stripe
 * - Card tokenization happens on Stripe's servers, not ours
 * - We only receive payment confirmations from Stripe after successful processing
 * - Zero sensitive payment data touches our application servers
 */

/**
 * Product types enum - Einbürgerungstest focused implementation
 * Infrastructure ready for future premium packs
 */
export const ProductType = {
  EINBURGERUNGSTEST: 'EINBURGERUNGSTEST',
  // Future implementation phases:
  // PREMIUM_PACK_JOURNEY: 'PREMIUM_PACK_JOURNEY',
  // PREMIUM_PACK_MICRO_QUIZ: 'PREMIUM_PACK_MICRO_QUIZ'
}

/**
 * Multi-currency support following backend implementation
 */
export const Currency = {
  EUR: 'EUR',
  USD: 'USD', 
  TRY: 'TRY'
}

/**
 * Payment flow states following our existing state management patterns
 */
export const PaymentState = {
  IDLE: 'idle',
  CHECKING_ACCESS: 'checking_access',
  CREATING_INTENT: 'creating_intent',
  PROCESSING_PAYMENT: 'processing_payment',
  VERIFYING_PAYMENT: 'verifying_payment',
  SUCCESS: 'success',
  ERROR: 'error'
}

/**
 * Payment error types for comprehensive error handling
 */
export const PaymentError = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  ALREADY_PURCHASED: 'ALREADY_PURCHASED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STRIPE_ERROR: 'STRIPE_ERROR',
  VERIFICATION_FAILED: 'VERIFICATION_FAILED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

/**
 * Stripe configuration constants
 */
export const StripeConfig = {
  CARD_ELEMENT_OPTIONS: {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }
}

// Freeze objects to prevent modifications
Object.freeze(ProductType)
Object.freeze(Currency)
Object.freeze(PaymentState)
Object.freeze(PaymentError)
Object.freeze(StripeConfig)
