import paymentModal from './PaymentModal.js'
import paymentService from '../../service/payment/PaymentService.js'
import { ProductType } from '../../constants/payment.js'
import { PaymentElementClasses } from '../../constants/paymentElements.js'
import eventService from '../../service/events/EventService.js'
import { EinburgerungstestPaymentEvent } from '../../constants/events.js'

/**
 * PaymentButton component for triggering Einbürgerungstest purchases
 * Following our existing button/component patterns with centralized element management
 */
class PaymentButton {
  constructor(buttonElement, options = {}) {
    this.button = buttonElement
    this.currency = options.currency || this.detectUserCurrency()
    this.isLoading = false
    this.originalText = this.button?.textContent || 'Upgrade to Premium'
    
    this.init()
  }

  /**
   * Initialize payment button
   */
  init() {
    if (!this.button) return

    this.button.addEventListener('click', (e) => this.handleClick(e))
    this.updateButtonText()
    console.log('[PaymentButton] Initialized')
  }

  /**
   * Handle button click
   * @param {Event} event - Click event
   */
  async handleClick(event) {
    event.preventDefault()
    
    if (this.isLoading) return

    this.setLoadingState(true)

    try {
      // Check if user already has access
      const accessResult = await paymentService.checkEinburgerungstestAccess(this.currency)

      if (accessResult.error) {
        if (accessResult.error.includes('UNAUTHORIZED') || accessResult.error.includes('401')) {
          // User not authenticated - this should be handled by the page-level auth wall
          console.log('[PaymentButton] User not authenticated - should be handled by auth wall')
          return
        }
        throw new Error(accessResult.error)
      }

      if (accessResult.hasAccess) {
        this.showAlreadyHasAccessMessage()
        return
      }

      // Show payment modal
      paymentModal.show(this.currency)

    } catch (error) {
      this.showErrorMessage(error.message)
    } finally {
      this.setLoadingState(false)
    }
  }

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoadingState(loading) {
    this.isLoading = loading
    
    if (loading) {
      this.button.disabled = true
      this.button.textContent = 'Loading...'
    } else {
      this.button.disabled = false
      this.updateButtonText()
    }
  }

  /**
   * Update button text based on currency
   */
  updateButtonText() {
    const currencySymbols = { EUR: '€', USD: '$', TRY: '₺' }
    const symbol = currencySymbols[this.currency] || '€'
    
    // Get price for the currency
    const prices = {
      EUR: '29.99',
      USD: '32.99',
      TRY: '999.99'
    }
    
    const price = prices[this.currency] || prices.EUR
    this.button.textContent = `Upgrade to Premium (${symbol}${price})`
  }

  /**
   * Show already has access message using centralized classes
   */
  showAlreadyHasAccessMessage() {
    // Create temporary message using centralized classes
    const message = document.createElement('div')
    message.className = `${PaymentElementClasses.PAYMENT_MESSAGE} ${PaymentElementClasses.PAYMENT_MESSAGE_SUCCESS}`
    message.textContent = 'You already have access to Einbürgerungstest!'
    message.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      right: 0;
      padding: 8px 12px;
      border-radius: 4px;
      background: #10b981;
      color: white;
      font-size: 14px;
      text-align: center;
      z-index: 1000;
    `
    
    // Position relative to button
    if (this.button.style.position !== 'relative') {
      this.button.style.position = 'relative'
    }
    
    this.button.appendChild(message)
    
    setTimeout(() => {
      message.remove()
    }, 3000)
  }

  /**
   * Show error message using centralized classes
   * @param {string} error - Error message
   */
  showErrorMessage(error) {
    const message = document.createElement('div')
    message.className = `${PaymentElementClasses.PAYMENT_MESSAGE} ${PaymentElementClasses.PAYMENT_MESSAGE_ERROR}`
    message.textContent = error
    message.style.cssText = `
      position: absolute;
      top: -50px;
      left: 0;
      right: 0;
      padding: 8px 12px;
      border-radius: 4px;
      background: #ef4444;
      color: white;
      font-size: 14px;
      text-align: center;
      z-index: 1000;
      white-space: normal;
      line-height: 1.4;
    `
    
    // Position relative to button
    if (this.button.style.position !== 'relative') {
      this.button.style.position = 'relative'
    }
    
    this.button.appendChild(message)
    
    setTimeout(() => {
      message.remove()
    }, 5000)
  }

  /**
   * Detect user's preferred currency
   * @returns {string} Currency code
   */
  detectUserCurrency() {
    const userLocale = navigator.language || navigator.userLanguage
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    if (userLocale.startsWith('tr') || timeZone.includes('Istanbul')) return 'TRY'
    if (userLocale.startsWith('en-US') || timeZone.includes('America')) return 'USD'
    return 'EUR'
  }

  /**
   * Update currency
   * @param {string} currency - New currency
   */
  updateCurrency(currency) {
    this.currency = currency
    this.updateButtonText()
  }

  /**
   * Destroy button and cleanup
   */
  destroy() {
    if (this.button) {
      this.button.removeEventListener('click', this.handleClick)
      this.button.textContent = this.originalText
      this.button.disabled = false
    }
    console.log('[PaymentButton] Destroyed')
  }

  /**
   * Static method to create payment buttons from selectors
   * @param {string} selector - CSS selector for buttons
   * @param {Object} options - Button options
   * @returns {Array} Array of PaymentButton instances
   */
  static createFromSelector(selector, options = {}) {
    const buttons = document.querySelectorAll(selector)
    return Array.from(buttons).map(button => new PaymentButton(button, options))
  }

  /**
   * Static method to create a single payment button
   * @param {string|HTMLElement} elementOrSelector - Element or selector
   * @param {Object} options - Button options
   * @returns {PaymentButton|null} PaymentButton instance or null
   */
  static create(elementOrSelector, options = {}) {
    const element = typeof elementOrSelector === 'string' 
      ? document.querySelector(elementOrSelector)
      : elementOrSelector

    return element ? new PaymentButton(element, options) : null
  }
}

export default PaymentButton
