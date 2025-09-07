import protectedApi from '../api/protectedApi.js'
import publicApi from '../api/publicApi.js'
import { PACK_SUMMARIES_BY_LEVEL } from '../constants/props.js'
import { PaymentEndpoints } from '../constants/urls.js'

export const publicApiService = {
  googleSignin: (idToken) => {
    return handleRequest(() =>
      publicApi.post('/api/v1/auth/oauth2/google', {
        idToken,
      })
    )
  },

  logout: () => {
    return handleRequest(() => publicApi.post('/api/v1/auth/logout', {}))
  },
  getTranslationResults: (query) => {
    return handleRequest(() =>
      publicApi.get(
        `/api/v1/translation/search?query=${encodeURIComponent(query)}`
      )
    )
  },
  getExperimentalOpenAiApiKey: async () => {
    return handleRequest(() => publicApi.get('/api/v1/api-key/open-ai'))
  },
}

export const protectedApiService = {
  getUserProfile: () => {
    return handleRequest(() => protectedApi.get('/api/v1/user/me'))
  },
  getPackSummariesOfLevel: (currentLevel) => {
    // Mock API Response with Promise & JSON
    // return handleRequest(async () => {
    //   // dynamically resolve the JSON module
    //   const allPackSummaries = { ...PACK_SUMMARIES_BY_LEVEL }

    //   return {
    //     ok: true,
    //     status: 200,
    //     json: () =>
    //       // match your real API shape
    //       Promise.resolve({ data: allPackSummaries[currentLevel] }),
    //   }
    // })

    // Real API Call
    return handleRequest(() =>
      protectedApi.get(`/api/v1/user-pack/summary?level=${currentLevel}`)
    )
  },
  getPackDeckWords: (deckId) => {
    // Mock API Response with Promise & JSON
    // return handleRequest(async () => {
    //   // dynamically resolve the JSON module
    //   const module = await import(
    //     /* webpackMode: "lazy", webpackChunkName: "pack-[request]" */
    //     `../../json/pack/${packType}/${packLevel}/${packId}/${packDeckWordType}.json`,
    //     { with: { type: 'json' } }
    //   )

    //   return {
    //     ok: true,
    //     status: 200,
    //     json: () =>
    //       // match your real API shape
    //       Promise.resolve({ data: module.default }),
    //   }
    // })

    // Real API Call
    return handleRequest(() =>
      protectedApi.get(`/api/v1/user-pack/deck/${deckId}/word`)
    )
  },
  addToBookmark: (wordId) => {
    return handleRequest(() =>
      protectedApi.post('/api/v1/user-word/bookmark', { word_id: wordId })
    )
  },
  removeFromBookmark: (wordId) => {
    return handleRequest(() =>
      protectedApi.delete(`/api/v1/user-word/bookmark/${wordId}`)
    )
  },
  getAllBookmarkedWords: () => {
    return handleRequest(() => protectedApi.get('/api/v1/user-word/bookmark'))
  },
  /**
   * POST deck exercise completion and receive updated pack summary and exercise results.
   * @param {object} payload - POST body for deck exercise completion
   * @returns {Promise<{userPackSummary, userDeckExerciseResult, error}>}
   */
  completeUserDeckExercise: async function (payload) {
    return await handleRequest(() =>
      protectedApi.post('/api/v1/user-pack/deck/exercise/complete', payload)
    ).then(({ data, error }) => {
      if (error)
        return { userPackSummary: null, userDeckExerciseResult: null, error }
      return {
        userPackSummary: data?.user_pack_summary ?? null,
        userDeckExerciseResult: data?.user_deck_exercise_result ?? null,
        error: null,
      }
    })
  },

  /**
   * Payment API Methods - Stripe Payment Integration
   * Following our existing API service patterns
   */

  /**
   * Check user access for Einbürgerungstest
   * @param {string} currency - User's preferred currency (EUR, USD, TRY)
   * @returns {Promise<{data, status, error}>} Access check result
   */
  checkEinburgerungstestAccess: (currency = 'EUR') => {
    return handleRequest(() =>
      protectedApi.get(`${PaymentEndpoints.CHECK_EINBURGERUNGSTEST_ACCESS}?currency=${currency}`)
    )
  },

  /**
   * Create payment intent for Einbürgerungstest
   * @param {string} currency - Payment currency (EUR, USD, TRY)
   * @returns {Promise<{data, status, error}>} Payment intent details
   */
  createPaymentIntent: (currency = 'EUR') => {
    return handleRequest(() =>
      protectedApi.post(PaymentEndpoints.CREATE_PAYMENT_INTENT, {
        product_type: 'EINBURGERUNGSTEST',
        currency: currency
      })
    )
  },

  /**
   * Verify payment completion
   * @param {string} paymentIntentId - Stripe payment intent ID
   * @returns {Promise<{data, status, error}>} Verification result
   */
  verifyPayment: (paymentIntentId) => {
    return handleRequest(() =>
      protectedApi.post(PaymentEndpoints.VERIFY_PAYMENT, {
        payment_intent_id: paymentIntentId,
        product_type: 'EINBURGERUNGSTEST'
      })
    )
  },

  // Future premium pack methods (infrastructure ready):
  // checkJourneyPackAccess: (currency = 'EUR') => { ... },
  // checkMicroQuizPackAccess: (currency = 'EUR') => { ... },
}

async function handleRequest(fetchCall) {
  try {
    const response = await fetchCall()
    const status = response.status
    let body,
      data = null,
      error = null

    try {
      body = await response.json()
      data = body.data ?? null
    } catch {
      // non-JSON or empty
    }

    if (!response.ok) {
      error = body?.error ?? 'Response is not OK!'
      return { data: null, status, error }
    }
    return { data, status, error: null }
  } catch (err) {
    console.error('Request failed:', err)
    return { data: null, status: null, error: err.message || err }
  }
}
