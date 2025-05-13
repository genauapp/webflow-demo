import { protectedFetch } from '../api/protectedApi.js'

// Protected request example
export async function getUserProfile() {
  try {
    const response = await protectedFetch.get('/api/v1/user/me')
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('User profile request failed:', error)
    return null
  }
}
