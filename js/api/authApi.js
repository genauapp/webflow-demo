// authApi.js
import { API_SERVER_BASE_URL } from '../constants/urls.js'

export const authFetch = {
  post: async (endpoint, data) => {
    return fetch(`${API_SERVER_BASE_URL}${endpoint}`, {
      method: 'POST',
      credentials: 'include', // Essential for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  },
  // Add other methods as needed
}

// Helper methods for common verbs
export default {
  post: (endpoint, body) => authFetch(endpoint, body),
  // Add put, delete, etc. as needed
}
