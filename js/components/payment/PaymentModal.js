import paymentService from '../../service/payment/PaymentService.js'
import { ProductType } from '../../constants/payment.js'
import { PaymentElementIds, PaymentElementClasses, PaymentElementSelectors } from '../../constants/paymentElements.js'
import eventService from '../../service/events/EventService.js'
import { PaymentEvent, EinburgerungstestPaymentEvent } from '../../constants/events.js'
import authService from '../../service/AuthService.js'

/**
 * PaymentModal component following our existing modal patterns
 * Handles Einbürgerungstest payment flow with centralized element management
 * 
 * 🔒 SECURITY: Uses Stripe's secure payment processing
 * - Card details are collected in secure Stripe iframes
 * - No sensitive payment data touches our JavaScript
 * - PCI compliance automatically handled by Stripe
 */
class PaymentModal {
  constructor() {
    this.isInitialized = false
    this.currentCurrency = 'EUR'
    this.isProcessingPayment = false
    this.els = {} // Centralized element cache following our patterns
  }

  /**
   * Initialize elements following our deckPractice.js and user.js patterns
   */
  initElements() {
    this.els = {
      // Modal Elements
      modal: () => document.getElementById(PaymentElementIds.PAYMENT_MODAL),
      modalClose: () => document.getElementById(PaymentElementIds.PAYMENT_MODAL_CLOSE),
      modalCancel: () => document.getElementById(PaymentElementIds.PAYMENT_MODAL_CANCEL),
      
      // Form Elements
      form: () => document.getElementById(PaymentElementIds.PAYMENT_FORM),
      submitButton: () => document.getElementById(PaymentElementIds.PAYMENT_SUBMIT),
      
      // Payment Elements
      stripeCardContainer: () => document.getElementById(PaymentElementIds.STRIPE_CARD_ELEMENT),
      cardholderName: () => document.getElementById(PaymentElementIds.CARDHOLDER_NAME),
      billingEmail: () => document.getElementById(PaymentElementIds.BILLING_EMAIL),
      currencySelector: () => document.getElementById(PaymentElementIds.CURRENCY_SELECTOR),
      cardErrors: () => document.getElementById(PaymentElementIds.CARD_ERRORS),
      
      // Product Info Elements
      productName: () => document.getElementById(PaymentElementIds.PRODUCT_NAME),
      productPrice: () => document.getElementById(PaymentElementIds.PRODUCT_PRICE),
      
      // State Elements
      loadingContainer: () => document.getElementById(PaymentElementIds.PAYMENT_LOADING),
      processingText: () => document.getElementById(PaymentElementIds.PAYMENT_PROCESSING_TEXT),
      errorContainer: () => document.getElementById(PaymentElementIds.PAYMENT_ERROR),
      successContainer: () => document.getElementById(PaymentElementIds.PAYMENT_SUCCESS),
      alreadyPaidContainer: () => document.getElementById(PaymentElementIds.ALREADY_PAID_MESSAGE),
    }
  }

  /**
   * Reset elements cache following our cleanup patterns
   */
  resetElements() {
    this.els = {}
  }

  /**
   * Initialize payment modal following our component patterns
   */
  init() {
    if (this.isInitialized) return

    this.initElements()
    this.bindEvents()
    this.setupCurrencySelector()
    this.isInitialized = true
    console.log('[PaymentModal] Initialized')
  }

  /**
   * Show payment modal for Einbürgerungstest
   * @param {string} currency - User's preferred currency
   */
  async show(currency = 'EUR') {
    try {
      // Ensure user is authenticated
      const currentUser = authService.getCurrentUser()
      if (!currentUser) {
        this.showErrorMessage('Please sign in to continue with payment')
        return
      }

      this.currentCurrency = currency
      this.showModalContainer()
      this.showLoadingState()

      // Pre-populate user info (no form fields needed)
      this.populateUserInfo(currentUser)

      // Initialize payment flow
      const cardContainer = this.els.stripeCardContainer()
      if (!cardContainer) {
        throw new Error('Stripe card container not found')
      }

      const result = await paymentService.initializeEinburgerungstestPayment(cardContainer, currency)

      if (result.error) {
        this.hideLoadingState()
        this.showErrorMessage(result.error)
        return
      }

      if (result.alreadyPaid) {
        this.hideLoadingState()
        this.showAlreadyPaidMessage(result.productInfo)
        return
      }

      if (result.readyForPayment) {
        this.hideLoadingState()
        this.updateProductInfo(result.productInfo)
        this.showPaymentForm()
        
        // Publish event
        eventService.publish(EinburgerungstestPaymentEvent.PURCHASE_MODAL_OPENED, {
          currency: currency,
          productInfo: result.productInfo,
          user: currentUser
        })
      }

    } catch (error) {
      this.hideLoadingState()
      this.showErrorMessage(error.message)
    }
  }

  /**
   * Hide payment modal following our modal patterns
   */
  hide() {
    const modal = this.els.modal()
    if (modal) {
      modal.style.display = 'none'
      paymentService.cancelPayment()
    }
  }

  /**
   * Bind event handlers following our existing patterns
   */
  bindEvents() {
    // Modal close events
    this.els.modalClose()?.addEventListener('click', () => this.hide())
    this.els.modalCancel()?.addEventListener('click', () => this.hide())

    // Payment form submission
    this.els.form()?.addEventListener('submit', (e) => this.handlePaymentSubmit(e))

    // Currency selector
    this.els.currencySelector()?.addEventListener('change', (e) => this.handleCurrencyChange(e))

    // Payment service events
    eventService.subscribe(PaymentEvent.PAYMENT_SUCCESS, (event) => this.handlePaymentSuccess(event.detail))
    eventService.subscribe(PaymentEvent.PAYMENT_ERROR, (event) => this.handlePaymentError(event.detail))
  }

  /**
   * Handle payment form submission
   * @param {Event} event - Form submit event
   */
  async handlePaymentSubmit(event) {
    event.preventDefault()

    if (this.isProcessingPayment) return

    this.isProcessingPayment = true
    this.showProcessingState()

    try {
      const billingDetails = this.getBillingDetails()
      const result = await paymentService.processPayment(billingDetails)

      if (result.error) {
        this.showErrorMessage(result.error)
      } else if (result.success) {
        this.showSuccessMessage(result.purchaseId)
        
        // Publish completion event
        eventService.publish(EinburgerungstestPaymentEvent.PURCHASE_COMPLETED, {
          purchaseId: result.purchaseId,
          currency: this.currentCurrency
        })
      }

    } catch (error) {
      this.showErrorMessage(error.message)
    } finally {
      this.isProcessingPayment = false
      this.hideProcessingState()
    }
  }

  /**
   * Get billing details from authenticated user (no form needed!)
   * @returns {Object} Billing details from current user
   */
  getBillingDetails() {
    const currentUser = authService.getCurrentUser()
    
    if (!currentUser) {
      throw new Error('User not authenticated')
    }

    return {
      name: currentUser.name || '',
      email: currentUser.email || ''
    }
  }

  /**
   * Handle currency change following our event patterns
   * @param {Event} event - Currency change event
   */
  async handleCurrencyChange(event) {
    const newCurrency = event.target.value
    if (newCurrency === this.currentCurrency) return

    this.currentCurrency = newCurrency
    this.showLoadingState()

    try {
      // Re-initialize payment with new currency
      const cardContainer = this.els.stripeCardContainer()
      const result = await paymentService.initializeEinburgerungstestPayment(cardContainer, newCurrency)

      if (result.error) {
        this.showErrorMessage(result.error)
      } else {
        this.updateProductInfo(result.productInfo)
        this.showPaymentForm()
      }

    } catch (error) {
      this.showErrorMessage(error.message)
    } finally {
      this.hideLoadingState()
    }
  }

  /**
   * Handle payment success event
   * @param {Object} detail - Event detail
   */
  handlePaymentSuccess(detail) {
    console.log('[PaymentModal] Payment success:', detail)
  }

  /**
   * Handle payment error event
   * @param {Object} detail - Event detail
   */
  handlePaymentError(detail) {
    console.log('[PaymentModal] Payment error:', detail)
    this.showErrorMessage(detail.error)
  }

  /**
   * Populate user information in the payment form
   * @param {Object} user - Current user object
   */
  populateUserInfo(user) {
    const nameEl = this.els.cardholderName()
    const emailEl = this.els.billingEmail()

    if (nameEl) {
      nameEl.value = user.name || ''
      nameEl.readOnly = true // Make read-only since it comes from authenticated user
      nameEl.removeAttribute('required') // Remove validation since it's auto-populated
    }
    
    if (emailEl) {
      emailEl.value = user.email || ''
      emailEl.readOnly = true // Make read-only since it comes from authenticated user
      emailEl.removeAttribute('required') // Remove validation since it's auto-populated
    }
  }

  /**
   * Update product information display
   * @param {Object} productInfo - Product information
   */
  updateProductInfo(productInfo) {
    const nameEl = this.els.productName()
    const priceEl = this.els.productPrice()

    if (nameEl) nameEl.textContent = productInfo.productName
    if (priceEl) priceEl.textContent = productInfo.formattedPrice
  }

  /**
   * Show loading state following our UI patterns
   */
  showLoadingState() {
    const spinner = this.els.loadingContainer()
    const form = this.els.form()
    
    if (spinner) spinner.style.display = 'block'
    if (form) form.style.display = 'none'
    this.hideErrorMessage()
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    const spinner = this.els.loadingContainer()
    const form = this.els.form()
    
    if (spinner) spinner.style.display = 'none'
    if (form) form.style.display = 'block'
  }

  /**
   * Show processing state during payment
   */
  showProcessingState() {
    const submitBtn = this.els.submitButton()
    const processingText = this.els.processingText()
    
    if (submitBtn) {
      submitBtn.disabled = true
      submitBtn.textContent = 'Processing...'
    }
    if (processingText) processingText.style.display = 'block'
  }

  /**
   * Hide processing state
   */
  hideProcessingState() {
    const submitBtn = this.els.submitButton()
    const processingText = this.els.processingText()
    
    if (submitBtn) {
      submitBtn.disabled = false
      submitBtn.textContent = 'Complete Purchase'
    }
    if (processingText) processingText.style.display = 'none'
  }

  /**
   * Show modal container
   */
  showModalContainer() {
    const modal = this.els.modal()
    if (modal) {
      modal.style.display = 'block'
    }
  }

  /**
   * Show payment form
   */
  showPaymentForm() {
    const form = this.els.form()
    const errorContainer = this.els.errorContainer()
    const successContainer = this.els.successContainer()
    const alreadyPaidContainer = this.els.alreadyPaidContainer()
    
    if (form) form.style.display = 'block'
    if (errorContainer) errorContainer.style.display = 'none'
    if (successContainer) successContainer.style.display = 'none'
    if (alreadyPaidContainer) alreadyPaidContainer.style.display = 'none'
  }

  /**
   * Show already paid message
   * @param {Object} productInfo - Product information
   */
  showAlreadyPaidMessage(productInfo) {
    const alreadyPaidEl = this.els.alreadyPaidContainer()
    const form = this.els.form()
    
    if (alreadyPaidEl) {
      alreadyPaidEl.style.display = 'block'
      alreadyPaidEl.textContent = `You already have access to ${productInfo.productName}`
    }
    
    if (form) form.style.display = 'none'
    
    // Auto-close modal after showing message
    setTimeout(() => this.hide(), 2000)
  }

  /**
   * Show success message
   * @param {string} purchaseId - Purchase ID
   */
  showSuccessMessage(purchaseId) {
    const successEl = this.els.successContainer()
    const form = this.els.form()
    
    if (successEl) {
      successEl.style.display = 'block'
      successEl.textContent = 'Payment successful! You now have access to Einbürgerungstest.'
    }
    
    if (form) form.style.display = 'none'
    
    // Auto-close and refresh page after success
    setTimeout(() => {
      this.hide()
      window.location.reload()
    }, 2000)
  }

  /**
   * Show error message following our error handling patterns
   * @param {string} error - Error message
   */
  showErrorMessage(error) {
    const errorEl = this.els.errorContainer()
    if (errorEl) {
      errorEl.style.display = 'block'
      errorEl.textContent = error || 'An unexpected error occurred'
    }
  }

  /**
   * Hide error message
   */
  hideErrorMessage() {
    const errorEl = this.els.errorContainer()
    if (errorEl) {
      errorEl.style.display = 'none'
    }
  }

  /**
   * Setup currency selector
   */
  setupCurrencySelector() {
    const selector = this.els.currencySelector()
    if (!selector) return

    const currencies = [
      { code: 'EUR', symbol: '€', name: 'Euro' },
      { code: 'USD', symbol: '$', name: 'US Dollar' },
      { code: 'TRY', symbol: '₺', name: 'Turkish Lira' }
    ]

    // Clear existing options
    selector.innerHTML = ''

    currencies.forEach(currency => {
      const option = document.createElement('option')
      option.value = currency.code
      option.textContent = `${currency.symbol} ${currency.name}`
      selector.appendChild(option)
    })

    // Set default currency
    selector.value = this.currentCurrency
  }

  /**
   * Cleanup following our component patterns
   */
  cleanup() {
    this.resetElements()
    this.isInitialized = false
    console.log('[PaymentModal] Cleanup completed')
  }
}

// Singleton instance following our patterns
const paymentModal = new PaymentModal()
export default paymentModal
