// /js/service/authService.js
import { protectedApiService, publicApiService } from './apiService.js'
import eventService from './events/EventService.js'
import { AuthEvent } from '../constants/events.js'

class AuthService {
  constructor() {
    this.currentUser = null
    this.isLoading = false
    this.isInitialized = false
    // console.info('[AuthService] Initialized')
  }

  /**
   * Get current user info - makes API call if needed and publishes result
   * Prevents duplicate requests with loading flag
   */
  async getUserInfo() {
    // If already loading, don't make another request
    if (this.isLoading) {
      // console.debug(
      //   '[AuthService] getUserInfo: Skipped due to ongoing request'
      // )

      return
    }

    // console.log('[AuthService] Fetching user info...')
    this.isLoading = true

    try {
      const {
        data: user,
        status,
        error,
      } = await protectedApiService.getUserInfo()
      // console.debug(
      //   `[AuthService] getUserInfo response - Status: ${status}, Error: ${
      //     error || 'None'
      //   }`
      // )
      const unauthorized = status === 401 || status === 403

      if (unauthorized || error) {
        // console.warn(
        //   `[AuthService] User info fetch failed - Unauthorized: ${unauthorized}, Error: ${
        //     error || 'None'
        //   }`
        // )
        this.currentUser = null
        eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
          isLoading: false,
          hasError: error,
          unauthorized,
          user: null,
        })
      } else {
        // console.log(
        //   `[AuthService] User info fetched successfully - User ID: ${
        //     user.id || 'Unknown'
        //   }`
        // )
        this.currentUser = user
        eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
          isLoading: false,
          hasError: null,
          unauthorized: false,
          user,
        })
      }
    } catch (err) {
      // console.error(
      //   `[AuthService] getUserInfo exception - ${err.message || err}`,
      //   err.stack ? { stack: err.stack } : ''
      // )
      this.currentUser = null
      eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
        isLoading: false,
        hasError: err.message || err,
        unauthorized: true,
        user: null,
      })
    } finally {
      this.isLoading = false
      this.isInitialized = true
      // console.debug('[AuthService] User info loading completed')
    }
  }

  /**
   * Handle successful login - publishes login success event
   */
  handleLoginSuccess(user) {
    // console.log(
    //   `[AuthService] Login success - User ID: ${user?.id || 'Unknown'}`
    // )
    this.currentUser = user
    eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
      isLoading: false,
      hasError: null,
      unauthorized: false,
      user: this.currentUser,
    })
  }

  /**
   * Handle login error - publishes login error event
   */
  handleLoginError(err) {
    const errorMsg = err.message || err
    // console.error(`[AuthService] Login failed - ${errorMsg}`)
    this.currentUser = null
    eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
      isLoading: false,
      hasError: errorMsg,
      unauthorized: true,
      user: this.currentUser,
    })
  }

  /**
   * Handle Google signin - makes API call and publishes result
   */
  async googleSignin(idToken) {
    if (this.isLoading) {
      // console.debug(
      //   '[AuthService] googleSignin: Skipped due to ongoing request'
      // )
      return
    }

    // console.log('[AuthService] Google sign-in initiated')
    this.isLoading = true

    try {
      const response = await publicApiService.googleSignin(idToken)
      // console.debug('[AuthService] Google sign-in API response:', response)

      if (response.data) {
        // console.log('[AuthService] Google authentication successful')
        const user = response.data
        this.handleLoginSuccess(user)
      } else {
        const errText = response.error || 'Unknown error'
        // console.warn(`[AuthService] Google sign-in failed: ${errText}`)
        this.handleLoginError(errText)
      }
    } catch (err) {
      // console.error(
      //   `[AuthService] Google sign-in exception: ${err.message || err}`,
      //   err.stack ? { stack: err.stack } : ''
      // )
      this.handleLoginError(err)
    } finally {
      this.isLoading = false
      // console.debug('[AuthService] Google sign-in completed')
    }
  }

  /**
   * Handle logout - makes API call and publishes result
   */
  async logout() {
    if (this.isLoading) {
      // console.debug('[AuthService] logout: Skipped due to ongoing request')
      return
    }

    // console.log('[AuthService] Logging out...')
    this.isLoading = true

    try {
      await publicApiService.logout()
      // console.log('[AuthService] Logout successful')
      this.currentUser = null
      eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
        isLoading: false,
        hasError: null,
        unauthorized: true,
        user: null,
      })
    } catch (err) {
      // console.error(
      //   `[AuthService] Logout failed: ${err.message || err}`,
      //   err.stack ? { stack: err.stack } : ''
      // )
      // Even if logout API fails, clear user locally
      this.currentUser = null
      eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
        isLoading: false,
        hasError: err.message || err,
        unauthorized: true,
        user: null,
      })
    } finally {
      this.isLoading = false
      // console.debug('[AuthService] Logout process completed')
    }
  }

  /**
   * Initialize auth service - gets initial user info
   */
  async initialize() {
    if (!this.isInitialized) {
      // console.log('[AuthService] Initializing auth service...')
      await this.getUserInfo()
    } else {
      // console.debug('[AuthService] Already initialized')
    }
  }

  /**
   * Get current user state without making API calls
   */
  getCurrentUser() {
    return this.currentUser
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null
  }

  /**
   * Check if auth service is currently loading
   */
  getIsLoading() {
    return this.isLoading
  }
}

// Singleton instance
const authService = new AuthService()
export default authService
