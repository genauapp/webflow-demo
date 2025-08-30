import { API_SERVER_BASE_URL } from '../constants/urls.js'

const publicFetch = async (endpoint, options) => {
  return await fetch(`${API_SERVER_BASE_URL}${endpoint}`, {
    method: options.method || 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': true, // api staging config
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
}

// Helper methods for common verbs
const publicApi = {
  get: (endpoint, options) => {
    if (options && options.body) {
      console.warn('GET requests should not have a body')
      delete options.body
    }
    return publicFetch(endpoint, { method: 'GET', ...options })
  },
  post: (endpoint, body, options) =>
    publicFetch(endpoint, { method: 'POST', body, ...options }),
}

export default publicApi
