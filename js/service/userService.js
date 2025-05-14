import protectedFetch from '../api/protectedApi.js'

/**
 * @typedef {Object} UserProfileResult
 * @property {boolean}   loading   – true while request is in flight
 * @property {Object|null} user     – the user object, or null if none
 * @property {number|null} status   – HTTP status code, or null on network failure
 * @property {Error|null} error     – error instance if fetch/network failed
 */

/**
 * Fetches the current user, and always resolves
 * to a `UserProfileResult` with loading=false.
 */
export async function getUserProfile() {
  const result = {
    loading: true,
    user: null,
    status: null,
    error: null,
  }

  try {
    const response = await protectedFetch.get('/api/v1/user/me')
    result.status = response.status

    if (response.ok) {
      result.user = await response.json()
    }
    // if status is 401/403, user stays null
  } catch (err) {
    result.error = err
  } finally {
    result.loading = false
    return result
  }
}
