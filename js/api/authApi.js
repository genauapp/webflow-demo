// authApi.js
import { API_SERVER_BASE_URL } from '../constants/urls.js'

const authFetch = async (endpoint, data) => {
  return fetch(`${API_SERVER_BASE_URL}${endpoint}`, {
    method: 'POST',
    credentials: 'include', // Essential for cookies
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
}

// Helper methods for common verbs
export default {
  post: (endpoint, body) => authFetch(endpoint, body),
  // Add put, delete, etc. as needed
}
