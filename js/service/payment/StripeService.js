import { StripeConfig } from '../../constants/payment.js'

/**
 * StripeService handles all Stripe SDK interactions
 * Following our existing service architecture patterns
 * 
 * 🔒 SECURITY: This service handles Stripe's secure payment processing
 * - Card details are collected in secure Stripe iframes, isolated from our JS
 * - No sensitive payment data ever touches our application code
 * - PCI DSS compliance is automatically handled by Stripe
 * - Only payment confirmation tokens are processed by our application
 */
class StripeService {
  constructor() {
    this.stripe = null
    this.cardElement = null
    this.isInitialized = false
  }

  /**
   * Initialize Stripe SDK
   * @param {string} publishableKey - Stripe publishable key
   */
  async initialize(publishableKey) {
    if (this.isInitialized) return

    try {
      // Check if Stripe is available globally
      if (typeof Stripe === 'undefined') {
        throw new Error('Stripe.js not loaded. Please include Stripe.js script.')
      }

      this.stripe = Stripe(publishableKey)
      this.isInitialized = true
      console.log('[StripeService] Initialized successfully')
    } catch (error) {
      console.error('[StripeService] Initialization failed:', error)
      throw new Error('Stripe initialization failed: ' + error.message)
    }
  }

  /**
   * Setup secure Stripe card element
   * @param {HTMLElement} container - DOM container for card element
   * @returns {Object} Stripe card element
   */
  setupCardElement(container) {
    if (!this.stripe) {
      throw new Error('Stripe not initialized')
    }

    if (!container) {
      throw new Error('Card element container not found')
    }

    // Cleanup existing element
    if (this.cardElement) {
      this.cardElement.destroy()
    }

    const elements = this.stripe.elements()
    this.cardElement = elements.create('card', StripeConfig.CARD_ELEMENT_OPTIONS)
    this.cardElement.mount(container)

    // Add error handling
    this.cardElement.on('change', ({ error }) => {
      const errorDisplay = document.getElementById('card-errors')
      if (errorDisplay) {
        if (error) {
          errorDisplay.textContent = error.message
          errorDisplay.style.display = 'block'
        } else {
          errorDisplay.textContent = ''
          errorDisplay.style.display = 'none'
        }
      }
    })

    console.log('[StripeService] Card element mounted successfully')
    return this.cardElement
  }

  /**
   * Confirm card payment with Stripe
   * @param {string} clientSecret - Payment intent client secret
   * @param {Object} billingDetails - Billing information
   * @returns {Promise<{paymentIntent, error}>}
   */
  async confirmCardPayment(clientSecret, billingDetails = {}) {
    if (!this.stripe || !this.cardElement) {
      throw new Error('Stripe card element not ready')
    }

    try {
      console.log('[StripeService] Confirming card payment...')
      
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.cardElement,
          billing_details: {
            name: billingDetails.name || '',
            email: billingDetails.email || '',
          },
        }
      })

      if (error) {
        console.error('[StripeService] Payment confirmation failed:', error)
        return { paymentIntent: null, error: error.message }
      }

      console.log('[StripeService] Payment confirmed successfully:', paymentIntent.id)
      return { paymentIntent, error: null }

    } catch (error) {
      console.error('[StripeService] Payment confirmation error:', error)
      return { paymentIntent: null, error: error.message }
    }
  }

  /**
   * Destroy card element
   */
  destroyCardElement() {
    if (this.cardElement) {
      this.cardElement.destroy()
      this.cardElement = null
      console.log('[StripeService] Card element destroyed')
    }
  }

  /**
   * Check if Stripe is ready
   * @returns {boolean} Ready state
   */
  isReady() {
    return this.isInitialized && this.stripe !== null
  }

  /**
   * Get Stripe instance (for advanced usage)
   * @returns {Object|null} Stripe instance
   */
  getStripeInstance() {
    return this.stripe
  }

  /**
   * Cleanup Stripe service
   */
  cleanup() {
    this.destroyCardElement()
    this.stripe = null
    this.isInitialized = false
    console.log('[StripeService] Cleanup completed')
  }
}

// Singleton instance
const stripeService = new StripeService()
export default stripeService
