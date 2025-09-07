// PROD
export const ASSETS_BASE_URL = `https://genauapp.github.io/webflow-demo/`
// STAGING
// export const ASSETS_BASE_URL =
//   'https://cdn.jsdelivr.net/gh/genauapp/webflow-demo@4d71f18'

export const CDN_BASE_URL = 'https://genauapp.github.io/cdn-temp'

// PROD
export const API_SERVER_BASE_URL = 'https://api.genauapp.io'
// STAGING
// export const API_SERVER_BASE_URL = 'https://f5dab8c41a8a.ngrok-free.app'

/**
 * Payment API Endpoints - Stripe Payment Integration
 * Following our existing URL constants pattern
 */
export const PaymentEndpoints = {
  // Einbürgerungstest access endpoints
  CHECK_EINBURGERUNGSTEST_ACCESS: '/api/v1/access/einburgerungstest',
  
  // Payment processing endpoints
  CREATE_PAYMENT_INTENT: '/api/v1/payments/create-intent',
  VERIFY_PAYMENT: '/api/v1/payments/verify',
  
  // Future premium pack endpoints (infrastructure ready)
  // CHECK_JOURNEY_ACCESS: '/api/v1/access/premium-pack-journey',
  // CHECK_MICRO_QUIZ_ACCESS: '/api/v1/access/premium-pack-micro-quiz'
}

Object.freeze(PaymentEndpoints)
