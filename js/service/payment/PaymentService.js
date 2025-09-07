import paymentApiService from './PaymentApiService.js'
import stripeService from './StripeService.js'
import paymentStateService from './PaymentStateService.js'
import { ProductType, PaymentState, PaymentError } from '../../constants/payment.js'
import eventService from '../events/EventService.js'
import { PaymentEvent } from '../../constants/events.js'

/**
 * Main PaymentService following our existing service architecture patterns
 * Orchestrates payment flow for Einbürgerungstest module
 * 
 * 🔒 SECURITY: Uses Stripe's secure payment processing
 * - Card details never touch our servers
 * - PCI compliance handled by Stripe
 * - Only payment confirmations are processed
 * - All sensitive operations happen on Stripe's secure infrastructure
 */
class PaymentService {
  constructor() {
    this.isInitialized = false
    this.currentPaymentIntent = null
    this.currentCurrency = 'EUR'
  }

  /**
   * Initialize payment service with Stripe following our initialization patterns
   * @param {string} publishableKey - Stripe publishable key
   */
  async initialize(publishableKey) {
    if (this.isInitialized) return

    try {
      await stripeService.initialize(publishableKey)
      this.isInitialized = true
      console.log('[PaymentService] Initialized successfully')
    } catch (error) {
      console.error('[PaymentService] Initialization failed:', error)
      throw new Error('Payment system initialization failed: ' + error.message)
    }
  }

  /**
   * Check if user has access to Einbürgerungstest with currency support
   * @param {string} currency - Preferred currency (EUR, USD, TRY)
   * @returns {Promise<{hasAccess, productInfo, error}>}
   */
  async checkEinburgerungstestAccess(currency = 'EUR') {
    try {
      paymentStateService.setState(PaymentState.CHECKING_ACCESS)
      
      const result = await paymentApiService.checkAccess(ProductType.EINBURGERUNGSTEST, currency)
      
      if (result.error) {
        paymentStateService.setState(PaymentState.ERROR, result.error)
        return result
      }

      if (result.hasAccess) {
        paymentStateService.setState(PaymentState.SUCCESS, result.productInfo)
      } else {
        paymentStateService.setState(PaymentState.IDLE, result.productInfo)
      }

      return result

    } catch (error) {
      paymentStateService.setState(PaymentState.ERROR, error.message)
      return { hasAccess: false, productInfo: null, error: error.message }
    }
  }

  /**
   * Create payment intent for Einbürgerungstest
   * @param {string} currency - Payment currency
   * @returns {Promise<{paymentIntent, error}>}
   */
  async createEinburgerungstestPaymentIntent(currency = 'EUR') {
    try {
      paymentStateService.setState(PaymentState.CREATING_INTENT)
      
      const result = await paymentApiService.createPaymentIntent(ProductType.EINBURGERUNGSTEST, currency)
      
      if (result.error) {
        paymentStateService.setState(PaymentState.ERROR, result.error)
        return result
      }

      this.currentPaymentIntent = result.paymentIntent
      this.currentCurrency = currency
      
      paymentStateService.setState(PaymentState.IDLE, result.paymentIntent)
      return result

    } catch (error) {
      paymentStateService.setState(PaymentState.ERROR, error.message)
      return { paymentIntent: null, error: error.message }
    }
  }

  /**
   * Setup Stripe card element following our component patterns
   * @param {HTMLElement} cardElementContainer - DOM element for Stripe iframe
   * @returns {Object} Stripe card element
   */
  setupStripeCardElement(cardElementContainer) {
    if (!this.isInitialized) {
      throw new Error('PaymentService not initialized')
    }

    return stripeService.setupCardElement(cardElementContainer)
  }

  /**
   * Process payment with comprehensive error handling
   * @param {Object} billingDetails - Customer billing information
   * @returns {Promise<{success, purchaseId, error}>}
   */
  async processPayment(billingDetails = {}) {
    if (!this.currentPaymentIntent) {
      throw new Error('No payment intent created')
    }

    try {
      paymentStateService.setState(PaymentState.PROCESSING_PAYMENT)
      
      // Step 1: Confirm payment with Stripe
      const paymentResult = await stripeService.confirmCardPayment(
        this.currentPaymentIntent.clientSecret, 
        billingDetails
      )

      if (paymentResult.error) {
        paymentStateService.setState(PaymentState.ERROR, paymentResult.error)
        return { success: false, purchaseId: null, error: paymentResult.error }
      }

      // Step 2: Verify payment with our backend
      paymentStateService.setState(PaymentState.VERIFYING_PAYMENT)
      
      const verificationResult = await paymentApiService.verifyPayment(
        paymentResult.paymentIntent.id
      )

      if (verificationResult.error) {
        paymentStateService.setState(PaymentState.ERROR, verificationResult.error)
        return { 
          success: false, 
          purchaseId: null, 
          error: 'Payment processing failed: ' + verificationResult.error 
        }
      }

      // Step 3: Success!
      paymentStateService.setState(PaymentState.SUCCESS, {
        purchaseId: verificationResult.purchaseId,
        paymentIntentId: paymentResult.paymentIntent.id
      })

      // Publish success event
      eventService.publish(PaymentEvent.PAYMENT_SUCCESS, {
        purchaseId: verificationResult.purchaseId,
        paymentIntentId: paymentResult.paymentIntent.id,
        productType: ProductType.EINBURGERUNGSTEST,
        currency: this.currentCurrency
      })

      return { 
        success: true, 
        purchaseId: verificationResult.purchaseId, 
        error: null 
      }

    } catch (error) {
      paymentStateService.setState(PaymentState.ERROR, error.message)
      eventService.publish(PaymentEvent.PAYMENT_ERROR, {
        error: error.message,
        productType: ProductType.EINBURGERUNGSTEST
      })
      
      return { success: false, purchaseId: null, error: error.message }
    }
  }

  /**
   * Complete payment flow for Einbürgerungstest
   * @param {HTMLElement} cardContainer - Card element container
   * @param {string} currency - Payment currency
   * @returns {Promise<{success, readyForPayment, alreadyPaid, error}>}
   */
  async initializeEinburgerungstestPayment(cardContainer, currency = 'EUR') {
    try {
      // Step 1: Check access
      const accessResult = await this.checkEinburgerungstestAccess(currency)
      
      if (accessResult.error) {
        return { 
          success: false, 
          readyForPayment: false, 
          alreadyPaid: false, 
          error: accessResult.error 
        }
      }

      if (accessResult.hasAccess) {
        return { 
          success: true, 
          readyForPayment: false, 
          alreadyPaid: true, 
          error: null,
          productInfo: accessResult.productInfo
        }
      }

      // Step 2: Create payment intent
      const intentResult = await this.createEinburgerungstestPaymentIntent(currency)
      
      if (intentResult.error) {
        return { 
          success: false, 
          readyForPayment: false, 
          alreadyPaid: false, 
          error: intentResult.error 
        }
      }

      // Step 3: Setup Stripe card element
      this.setupStripeCardElement(cardContainer)

      return { 
        success: true, 
        readyForPayment: true, 
        alreadyPaid: false, 
        error: null,
        productInfo: accessResult.productInfo,
        paymentIntent: intentResult.paymentIntent
      }

    } catch (error) {
      console.error('[PaymentService] Payment initialization failed:', error)
      return { 
        success: false, 
        readyForPayment: false, 
        alreadyPaid: false, 
        error: error.message 
      }
    }
  }

  /**
   * Cancel current payment following our cleanup patterns
   */
  cancelPayment() {
    if (this.currentPaymentIntent) {
      stripeService.destroyCardElement()
      this.currentPaymentIntent = null
      paymentStateService.reset()
      
      eventService.publish(PaymentEvent.PAYMENT_CANCELLED, {
        productType: ProductType.EINBURGERUNGSTEST
      })
      
      console.log('[PaymentService] Payment cancelled')
    }
  }

  /**
   * Get current payment state following our state management patterns
   * @returns {Object} Current state
   */
  getCurrentState() {
    return {
      isInitialized: this.isInitialized,
      hasPaymentIntent: this.currentPaymentIntent !== null,
      currentCurrency: this.currentCurrency,
      currentProductType: ProductType.EINBURGERUNGSTEST,
      paymentState: paymentStateService.getState(),
      stripeReady: stripeService.isReady()
    }
  }

  /**
   * Get user-friendly state message
   * @returns {string} State message
   */
  getStateMessage() {
    return paymentStateService.getStateMessage()
  }

  /**
   * Check if payment is in progress
   * @returns {boolean} Is processing
   */
  isProcessing() {
    const state = paymentStateService.getState()
    return state.isLoading
  }

  /**
   * Cleanup resources following our service patterns
   */
  cleanup() {
    this.cancelPayment()
    stripeService.cleanup()
    paymentStateService.reset()
    this.isInitialized = false
    console.log('[PaymentService] Cleanup completed')
  }
}

// Singleton instance following our existing patterns
const paymentService = new PaymentService()
export default paymentService
