import { protectedApiService } from '../apiService.js'
import { ProductType } from '../../constants/payment.js'
import eventService from '../events/EventService.js'
import { PaymentEvent } from '../../constants/events.js'

/**
 * Payment API Service following our existing service patterns
 * Handles all payment-related API communication
 * 
 * 🔒 SECURITY: Uses Stripe's secure payment processing
 * - Only handles payment metadata and confirmations
 * - No sensitive payment data is processed here
 * - All card processing happens on Stripe's secure servers
 */
class PaymentApiService {
  constructor() {
    this.baseUrl = '/api/v1'
  }

  /**
   * Check access for any product type with currency support
   * @param {string} productType - Product type from ProductType enum
   * @param {string} currency - Preferred currency (EUR, USD, TRY)
   * @returns {Promise<{hasAccess, productInfo, error}>}
   */
  async checkAccess(productType, currency = 'EUR') {
    try {
      eventService.publish(PaymentEvent.ACCESS_CHECK_STARTED, { productType, currency })
      
      const result = await protectedApiService.checkEinburgerungstestAccess(currency)
      
      if (result.error) {
        eventService.publish(PaymentEvent.ACCESS_CHECK_ERROR, { productType, error: result.error })
        return { hasAccess: false, productInfo: null, error: result.error }
      }

      const accessData = result.data
      const hasAccess = accessData?.has_access || false
      
      const productInfo = {
        productName: this._getProductDisplayName(productType),
        currency: currency,
        amountInCents: accessData?.amount_in_cents || this._getDefaultPriceCents(productType, currency),
        formattedPrice: accessData?.formatted_price || this._formatPrice(this._getDefaultPriceCents(productType, currency), currency),
        purchaseId: accessData?.purchase_id || null,
        purchaseDate: accessData?.purchase_date || null
      }

      eventService.publish(PaymentEvent.ACCESS_CHECK_SUCCESS, { 
        productType, 
        hasAccess, 
        productInfo 
      })

      return { hasAccess, productInfo, error: null }

    } catch (error) {
      eventService.publish(PaymentEvent.ACCESS_CHECK_ERROR, { productType, error: error.message })
      return { hasAccess: false, productInfo: null, error: error.message }
    }
  }

  /**
   * Create payment intent following our error handling patterns
   * @param {string} productType - Product type
   * @param {string} currency - Payment currency
   * @returns {Promise<{paymentIntent, error}>}
   */
  async createPaymentIntent(productType, currency = 'EUR') {
    try {
      eventService.publish(PaymentEvent.PAYMENT_INTENT_CREATING, { productType, currency })
      
      const result = await protectedApiService.createPaymentIntent(currency)
      
      if (result.error) {
        eventService.publish(PaymentEvent.PAYMENT_ERROR, { productType, error: result.error })
        return { paymentIntent: null, error: result.error }
      }

      const paymentIntent = {
        clientSecret: result.data?.client_secret,
        paymentIntentId: result.data?.payment_intent_id,
        amountInCents: result.data?.amount_in_cents,
        currency: result.data?.currency,
        formattedAmount: result.data?.formatted_amount
      }

      eventService.publish(PaymentEvent.PAYMENT_INTENT_CREATED, { 
        productType, 
        paymentIntent 
      })

      return { paymentIntent, error: null }

    } catch (error) {
      eventService.publish(PaymentEvent.PAYMENT_ERROR, { productType, error: error.message })
      return { paymentIntent: null, error: error.message }
    }
  }

  /**
   * Verify payment completion
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @returns {Promise<{success, purchaseId, error}>}
   */
  async verifyPayment(paymentIntentId) {
    try {
      const result = await protectedApiService.verifyPayment(paymentIntentId)
      
      if (result.error) {
        return { success: false, purchaseId: null, error: result.error }
      }

      const verificationData = result.data
      const success = verificationData?.success || false
      const purchaseId = verificationData?.purchase_id || null

      if (success) {
        eventService.publish(PaymentEvent.PAYMENT_SUCCESS, { 
          paymentIntentId, 
          purchaseId 
        })
      } else {
        eventService.publish(PaymentEvent.PAYMENT_ERROR, { 
          paymentIntentId, 
          error: 'Payment verification failed' 
        })
      }

      return { success, purchaseId, error: null }

    } catch (error) {
      eventService.publish(PaymentEvent.PAYMENT_ERROR, { 
        paymentIntentId, 
        error: error.message 
      })
      return { success: false, purchaseId: null, error: error.message }
    }
  }

  /**
   * Get product display name following our existing patterns
   * @param {string} productType - Product type
   * @returns {string} Display name
   */
  _getProductDisplayName(productType) {
    const names = {
      [ProductType.EINBURGERUNGSTEST]: 'Einbürgerungstest',
      // [ProductType.PREMIUM_PACK_JOURNEY]: 'Premium Journey Pack',
      // [ProductType.PREMIUM_PACK_MICRO_QUIZ]: 'Premium Micro Quiz Pack'
    }

    return names[productType] || productType.replace(/_/g, ' ')
  }

  /**
   * Get default price in cents for fallback
   * @param {string} productType - Product type
   * @param {string} currency - Currency code
   * @returns {number} Price in cents
   */
  _getDefaultPriceCents(productType, currency) {
    const prices = {
      [ProductType.EINBURGERUNGSTEST]: {
        EUR: 2999, // €29.99
        USD: 3299, // $32.99
        TRY: 99999 // ₺999.99
      }
    }

    return prices[productType]?.[currency] || prices[ProductType.EINBURGERUNGSTEST].EUR
  }

  /**
   * Format price for display
   * @param {number} amountInCents - Amount in cents
   * @param {string} currency - Currency code
   * @returns {string} Formatted price
   */
  _formatPrice(amountInCents, currency) {
    const symbols = { EUR: '€', USD: '$', TRY: '₺' }
    const symbol = symbols[currency] || '€'
    const amount = (amountInCents / 100).toFixed(2)
    return `${symbol}${amount}`
  }
}

// Singleton instance following our existing patterns
const paymentApiService = new PaymentApiService()
export default paymentApiService
