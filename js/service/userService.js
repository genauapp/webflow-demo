import protectedFetch from '../api/protectedApi.js'

/**
 * Fetch current user; returns { user, status, error }
 */
export async function getUserProfile() {
  try {
    const resp = await protectedFetch.get('/api/v1/user/me')
    if (!resp.ok) {
      return { data: null, status: resp.status, error: await resp.json().error }
    }
    return { data: await resp.json().data, status: resp.status, error: null }
  } catch (error) {
    console.error('User profile request failed:', error)
    return { data: null, status: null, error }
  }
}
