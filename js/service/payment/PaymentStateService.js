import { PaymentState } from '../../constants/payment.js'
import eventService from '../events/EventService.js'
import { PaymentEvent } from '../../constants/events.js'

/**
 * PaymentStateService manages payment flow state
 * Following our existing state management patterns
 */
class PaymentStateService {
  constructor() {
    this.currentState = PaymentState.IDLE
    this.error = null
    this.data = null
    this.stateHistory = []
  }

  /**
   * Set payment state with optional error/data
   * @param {string} state - Payment state
   * @param {string|Object} errorOrData - Error message or state data
   */
  setState(state, errorOrData = null) {
    const previousState = this.currentState
    this.currentState = state
    
    // Add to state history for debugging
    this.stateHistory.push({
      from: previousState,
      to: state,
      timestamp: new Date().toISOString(),
      data: errorOrData
    })

    // Keep only last 10 state changes
    if (this.stateHistory.length > 10) {
      this.stateHistory.shift()
    }
    
    if (state === PaymentState.ERROR) {
      this.error = errorOrData
      this.data = null
    } else {
      this.error = null
      this.data = errorOrData
    }

    // Publish state change event
    eventService.publish('payment:state-changed', {
      state: this.currentState,
      previousState: previousState,
      error: this.error,
      data: this.data,
      timestamp: new Date().toISOString()
    })

    console.log(`[PaymentStateService] State changed: ${previousState} → ${state}`, errorOrData)
  }

  /**
   * Get current state
   * @returns {Object} Current state information
   */
  getState() {
    return {
      state: this.currentState,
      error: this.error,
      data: this.data,
      isIdle: this.currentState === PaymentState.IDLE,
      isLoading: this._isLoadingState(this.currentState),
      isSuccess: this.currentState === PaymentState.SUCCESS,
      isError: this.currentState === PaymentState.ERROR,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Check if current state is a loading state
   * @param {string} state - State to check
   * @returns {boolean} Is loading state
   */
  _isLoadingState(state) {
    const loadingStates = [
      PaymentState.CHECKING_ACCESS,
      PaymentState.CREATING_INTENT,
      PaymentState.PROCESSING_PAYMENT,
      PaymentState.VERIFYING_PAYMENT
    ]
    return loadingStates.includes(state)
  }

  /**
   * Get user-friendly state message
   * @returns {string} State message
   */
  getStateMessage() {
    const messages = {
      [PaymentState.IDLE]: 'Ready',
      [PaymentState.CHECKING_ACCESS]: 'Checking access...',
      [PaymentState.CREATING_INTENT]: 'Preparing payment...',
      [PaymentState.PROCESSING_PAYMENT]: 'Processing payment...',
      [PaymentState.VERIFYING_PAYMENT]: 'Verifying payment...',
      [PaymentState.SUCCESS]: 'Payment successful!',
      [PaymentState.ERROR]: this.error || 'An error occurred'
    }

    return messages[this.currentState] || 'Unknown state'
  }

  /**
   * Reset state to idle
   */
  reset() {
    console.log('[PaymentStateService] Resetting state to idle')
    this.setState(PaymentState.IDLE)
  }

  /**
   * Get state history for debugging
   * @returns {Array} State history
   */
  getStateHistory() {
    return [...this.stateHistory]
  }

  /**
   * Check if state can transition to new state
   * @param {string} newState - Target state
   * @returns {boolean} Can transition
   */
  canTransitionTo(newState) {
    // Define valid state transitions
    const validTransitions = {
      [PaymentState.IDLE]: [PaymentState.CHECKING_ACCESS, PaymentState.ERROR],
      [PaymentState.CHECKING_ACCESS]: [PaymentState.CREATING_INTENT, PaymentState.ERROR, PaymentState.SUCCESS],
      [PaymentState.CREATING_INTENT]: [PaymentState.PROCESSING_PAYMENT, PaymentState.ERROR],
      [PaymentState.PROCESSING_PAYMENT]: [PaymentState.VERIFYING_PAYMENT, PaymentState.ERROR],
      [PaymentState.VERIFYING_PAYMENT]: [PaymentState.SUCCESS, PaymentState.ERROR],
      [PaymentState.SUCCESS]: [PaymentState.IDLE],
      [PaymentState.ERROR]: [PaymentState.IDLE, PaymentState.CHECKING_ACCESS]
    }

    const allowedStates = validTransitions[this.currentState] || []
    return allowedStates.includes(newState)
  }
}

// Singleton instance
const paymentStateService = new PaymentStateService()
export default paymentStateService
