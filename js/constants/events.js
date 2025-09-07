// /constants/events.js
export const AuthEvent = Object.freeze({
  // USER_PROFILE_REQUESTED: 'auth:user-profile-requested',
  // USER_PROFILE_SUCCESS: 'auth:user-profile-success',
  // USER_PROFILE_ERROR: 'auth:user-profile-error',
  // LOGIN_SUCCESS: 'auth:login-success',
  // LOGOUT_SUCCESS: 'auth:logout-success',
  // AUTH_STATE_LOADING: 'auth:state-loading',
  AUTH_STATE_CHANGED: 'auth:state-changed',
})

export const SigninModalTriggerEvent = Object.freeze({
  HOME_SEARCH_ADD_TO_BOOKMARKS: 'home:search-add-to-bookmarks',
  LEVEL_LEARN_ADD_TO_BOOKMARKS: 'level:learn-add-to-bookmarks',
  LEVEL_LEARN_FINISH: 'level:learn-finish',
  LEVEL_EXERCISE_FINISH: 'level:exercise-finish',
  EINBURGERUNGSTEST_TEST_FINISH: 'einburgerungstest:test-finish',
})

/**
 * Payment Events - Stripe Payment Integration
 * Following our existing event patterns
 */
export const PaymentEvent = Object.freeze({
  ACCESS_CHECK_STARTED: 'payment:access-check-started',
  ACCESS_CHECK_SUCCESS: 'payment:access-check-success', 
  ACCESS_CHECK_ERROR: 'payment:access-check-error',
  PAYMENT_INTENT_CREATED: 'payment:intent-created',
  PAYMENT_PROCESSING: 'payment:processing',
  PAYMENT_SUCCESS: 'payment:success',
  PAYMENT_ERROR: 'payment:error',
  PAYMENT_CANCELLED: 'payment:cancelled'
})

export const EinburgerungstestPaymentEvent = Object.freeze({
  ACCESS_REQUIRED: 'einburgerungstest:access-required',
  PURCHASE_MODAL_OPENED: 'einburgerungstest:purchase-modal-opened',
  PURCHASE_COMPLETED: 'einburgerungstest:purchase-completed'
})
