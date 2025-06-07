// /js/service/authService.js
import { protectedApiService, publicApiService } from './apiService.js'
import eventService from './events/EventService.js'
import { AuthEvent } from '../constants/events.js'

class AuthService {
  constructor() {
    this.currentUser = null
    this.isLoading = false
    this.isInitialized = false
  }

  /**
   * Get current user profile - makes API call if needed and publishes result
   * Prevents duplicate requests with loading flag
   */
  async getUserProfile() {
    // If already loading, don't make another request
    if (this.isLoading) {
      return
    }

    this.isLoading = true
    eventService.publish(AuthEvent.AUTH_STATE_LOADING)

    try {
      const {
        data: user,
        status,
        error,
      } = await protectedApiService.getUserProfile()
      const unauthorized = status === 401 || status === 403

      if (unauthorized || error) {
        this.currentUser = null
        eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
          isLoading: false,
          hasError: error,
          unauthorized,
          user: null,
        })
      } else {
        this.currentUser = user
        eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
          isLoading: false,
          hasError: null,
          unauthorized: false,
          user,
        })
      }
    } catch (err) {
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
    }
  }

  /**
   * Handle successful login - publishes login success event
   */
  handleLoginSuccess(user) {
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
    this.currentUser = null
    eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
      isLoading: false,
      hasError: err.message || err,
      unauthorized: true,
      user: this.currentUser,
    })
  }

  /**
   * Handle Google signin - makes API call and publishes result
   */
  async googleSignin(idToken) {
    if (this.isLoading) {
      return
    }

    this.isLoading = true

    try {
      const response = await publicApiService.googleSignin(idToken)

      if (response.data) {
        const user = response.data

        this.handleLoginSuccess(user)
      } else {
        const errText = response.error
        console.error('Google login failed:', errText)
        this.handleLoginError(errText)
      }
    } catch (err) {
      console.error('Error in googleSignin request:', err)
      this.handleLoginError(err)
    } finally {
      this.isLoading = false
    }
  }

  /**
   * Handle logout - makes API call and publishes result
   */
  async logout() {
    if (this.isLoading) {
      return
    }

    this.isLoading = true

    try {
      await publicApiService.logout()
      this.currentUser = null
      eventService.publish(AuthEvent.AUTH_STATE_CHANGED, {
        isLoading: false,
        hasError: null,
        unauthorized: true,
        user: null,
      })
    } catch (err) {
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
    }
  }

  /**
   * Initialize auth service - gets initial user profile
   */
  async initialize() {
    if (!this.isInitialized) {
      await this.getUserProfile()
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
