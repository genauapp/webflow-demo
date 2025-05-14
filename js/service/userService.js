import protectedFetch from '../api/protectedApi.js'

/**
 * Fetch current user; returns { user, status, error }
 */
export async function getUserProfile() {
  try {
    const resp = await protectedFetch.get('/api/v1/user/me')
    if (resp.ok) {
      return { user: await resp.json(), status: resp.status, error: null }
    }
    return { user: null, status: resp.status, error: null }
  } catch (error) {
    console.error('User profile request failed:', error)
    return { user: null, status: null, error }
  }
}
