/**
 * Payment Element IDs and Classes - Centralized Configuration
 * Following our existing element management patterns from user.js and deckPractice.js
 * 
 * This file provides a single source of truth for all payment-related element identifiers,
 * making HTML updates and element management much easier and more maintainable.
 */

export const PaymentElementIds = Object.freeze({
  // Payment Modal
  PAYMENT_MODAL: 'payment-modal',
  PAYMENT_MODAL_CLOSE: 'payment-modal-close',
  PAYMENT_MODAL_CANCEL: 'payment-modal-cancel',
  PAYMENT_FORM: 'payment-form',
  PAYMENT_LOADING: 'payment-loading',
  PAYMENT_SUBMIT: 'payment-submit',
  PAYMENT_PROCESSING_TEXT: 'payment-processing-text',
  PAYMENT_ERROR: 'payment-error',
  PAYMENT_SUCCESS: 'payment-success',
  ALREADY_PAID_MESSAGE: 'already-paid-message',
  
  // Product Information
  PRODUCT_NAME: 'product-name',
  PRODUCT_PRICE: 'product-price',
  
  // Payment Form Elements
  STRIPE_CARD_ELEMENT: 'stripe-card-element',
  CARDHOLDER_NAME: 'cardholder-name',
  BILLING_EMAIL: 'billing-email',
  CURRENCY_SELECTOR: 'currency-selector',
  CARD_ERRORS: 'card-errors',
  
  // Einbürgerungstest Specific
  EINBURGERUNGSTEST_UPGRADE_BANNER: 'einburgerungstest-upgrade-banner',
  TEST_TAB_UPGRADE_BUTTON: 'test-tab-upgrade-button',
  TEST_TAB: 'test-tab',
})

export const PaymentElementClasses = Object.freeze({
  // Message Classes
  PAYMENT_MESSAGE: 'payment-message',
  PAYMENT_MESSAGE_SUCCESS: 'payment-message-success',
  PAYMENT_MESSAGE_ERROR: 'payment-message-error',
  
  // Banner and Prompt Classes
  UPGRADE_BANNER: 'upgrade-banner',
  UPGRADE_BANNER_CONTENT: 'upgrade-banner-content',
  UPGRADE_BANNER_TEXT: 'upgrade-banner-text',
  UPGRADE_BANNER_BUTTON: 'upgrade-banner-button',
  
  // Test Related Classes
  TEST_UPGRADE_PROMPT: 'test-upgrade-prompt',
  UPGRADE_PROMPT_CONTENT: 'upgrade-prompt-content',
  UPGRADE_BUTTON: 'upgrade-button',
  
  // Overlay Classes
  EINBURGERUNGSTEST_UPGRADE_OVERLAY: 'einburgerungstest-upgrade-overlay',
  EINBURGERUNGSTEST_PRICE: 'einburgerungstest-price',
})

export const PaymentElementSelectors = Object.freeze({
  // Data Attributes
  TEST_TAB_CONTENT: '[data-w-tab="test"]',
  
  // Meta Elements
  STRIPE_KEY_META: 'meta[name="stripe-key"]',
})
