// protectedApi.js
import { API_SERVER_BASE_URL } from '../constants/urls.js'

const protectedFetch = async (endpoint, options = {}) => {
  // Initial request with credentials
  let response = await fetch(`${API_SERVER_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // Send cookies automatically
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  // Auto-retry 401 once (assuming cookie-based refresh)
  //   if (response.status === 401 && !options._retried) {
  //     return protectedFetch(endpoint, {
  //       ...options,
  //       _retried: true, // Prevent infinite retry loops
  //     });
  //   }

  return response
}

// Helper methods for common verbs
const protectedApi = {
  get: (endpoint, options) => {
    if (options && options.body) {
      console.warn('GET requests should not have a body')
      delete options.body
    }
    return protectedFetch(endpoint, { method: 'GET', ...options })
  },
  post: (endpoint, body, options) =>
    protectedFetch(endpoint, { method: 'POST', body, ...options }),
  delete: (endpoint, options) =>
    protectedFetch(endpoint, { method: 'DELETE', ...options }),
}

export default protectedApi
