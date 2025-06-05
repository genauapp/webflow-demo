// /service/navigationService.js

/** 
 * Reusable navigation service for learn and exercise modes
 * Handles all navigation logic, state management, and provides callbacks for UI updates
 */

class NavigationService {
  constructor() {
    this.sessions = new Map() // Store multiple navigation sessions
  }

  /**
   * Create a new navigation session
   * @param {string} sessionId - Unique identifier for this navigation session
   * @param {Array} items - Array of items to navigate through
   * @param {Object} options - Configuration options
   * @param {Function} options.onUpdate - Callback when navigation state changes
   * @param {Function} options.onLearnUpdate - Callback for learn mode updates
   * @param {Function} options.onExerciseUpdate - Callback for exercise mode updates
   * @param {string} options.mode - 'learn' or 'exercise'
   */
  createSession(sessionId, items, options = {}) {
    const session = {
      id: sessionId,
      items: [...items],
      originalItems: [...items],
      mode: options.mode || 'learn',
      learnState: {
        currentIndex: 0,
        history: [],
      },
      exerciseState: {
        currentIndex: 0,
        score: { correct: 0, total: 0, attempts: 0 },
        answered: new Set(),
        history: [],
      },
      callbacks: {
        onUpdate: options.onUpdate || (() => {}),
        onLearnUpdate: options.onLearnUpdate || (() => {}),
        onExerciseUpdate: options.onExerciseUpdate || (() => {}),
      }
    }

    this.sessions.set(sessionId, session)
    this._notifyUpdate(session)
    return session
  }

  /**
   * Get current session state
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId)
  }

  /**
   * Switch between learn and exercise modes
   */
  switchMode(sessionId, mode) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    session.mode = mode
    this._notifyUpdate(session)
    return session
  }

  /**
   * LEARN MODE NAVIGATION
   */

  // Navigate to previous item in learn mode
  learnPrevious(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session || session.items.length === 0) return null

    const state = session.learnState
    if (state.currentIndex > 0) {
      state.history.push(state.currentIndex)
      state.currentIndex--
      this._notifyLearnUpdate(session)
    }
    return this._getCurrentItem(session)
  }

  // Navigate to next item in learn mode
  learnNext(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session || session.items.length === 0) return null

    const state = session.learnState
    if (state.currentIndex < session.items.length - 1) {
      state.history.push(state.currentIndex)
      state.currentIndex++
      this._notifyLearnUpdate(session)
    }
    return this._getCurrentItem(session)
  }

  // Reset learn mode to beginning
  learnReset(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    session.learnState.currentIndex = 0
    session.learnState.history = []
    this._notifyLearnUpdate(session)
    return this._getCurrentItem(session)
  }

  // Shuffle items and reset learn mode
  learnShuffle(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // Fisher-Yates shuffle
    const items = [...session.items]
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]]
    }

    session.items = items
    session.learnState.currentIndex = 0
    session.learnState.history = []
    this._notifyLearnUpdate(session)
    return this._getCurrentItem(session)
  }

  // Go to specific index in learn mode
  learnGoTo(sessionId, index) {
    const session = this.sessions.get(sessionId)
    if (!session || session.items.length === 0) return null

    const safeIndex = Math.max(0, Math.min(index, session.items.length - 1))
    session.learnState.history.push(session.learnState.currentIndex)
    session.learnState.currentIndex = safeIndex
    this._notifyLearnUpdate(session)
    return this._getCurrentItem(session)
  }

  /**
   * EXERCISE MODE NAVIGATION
   */

  // Navigate to previous item in exercise mode
  exercisePrevious(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session || session.items.length === 0) return null

    const state = session.exerciseState
    if (state.currentIndex > 0) {
      state.history.push(state.currentIndex)
      state.currentIndex--
      this._notifyExerciseUpdate(session)
    }
    return this._getCurrentItem(session)
  }

  // Navigate to next item in exercise mode
  exerciseNext(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session || session.items.length === 0) return null

    const state = session.exerciseState
    if (state.currentIndex < session.items.length - 1) {
      state.history.push(state.currentIndex)
      state.currentIndex++
      this._notifyExerciseUpdate(session)
    }
    return this._getCurrentItem(session)
  }

  // Handle correct answer in exercise mode
  exerciseCorrect(sessionId, autoAdvance = true) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.exerciseState
    const currentIndex = state.currentIndex
    
    // Update score if not already answered
    if (!state.answered.has(currentIndex)) {
      state.score.correct++
      state.score.total++
      state.answered.add(currentIndex)
    }
    state.score.attempts++

    this._notifyExerciseUpdate(session)

    // Auto-advance to next question if enabled
    if (autoAdvance && currentIndex < session.items.length - 1) {
      return this.exerciseNext(sessionId)
    }

    return this._getCurrentItem(session)
  }

  // Handle wrong answer in exercise mode
  exerciseWrong(sessionId, autoAdvance = true) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.exerciseState
    const currentIndex = state.currentIndex
    
    // Update score if not already answered
    if (!state.answered.has(currentIndex)) {
      state.score.total++
      state.answered.add(currentIndex)
    }
    state.score.attempts++

    this._notifyExerciseUpdate(session)

    // Auto-advance to next question if enabled
    if (autoAdvance && currentIndex < session.items.length - 1) {
      return this.exerciseNext(sessionId)
    }

    return this._getCurrentItem(session)
  }

  // Reset exercise mode
  exerciseReset(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    session.exerciseState = {
      currentIndex: 0,
      score: { correct: 0, total: 0, attempts: 0 },
      answered: new Set(),
      history: [],
    }
    this._notifyExerciseUpdate(session)
    return this._getCurrentItem(session)
  }

  // Go to specific index in exercise mode
  exerciseGoTo(sessionId, index) {
    const session = this.sessions.get(sessionId)
    if (!session || session.items.length === 0) return null

    const safeIndex = Math.max(0, Math.min(index, session.items.length - 1))
    session.exerciseState.history.push(session.exerciseState.currentIndex)
    session.exerciseState.currentIndex = safeIndex
    this._notifyExerciseUpdate(session)
    return this._getCurrentItem(session)
  }

  /**
   * UTILITY METHODS
   */

  // Get current item based on active mode
  getCurrentItem(sessionId) {
    const session = this.sessions.get(sessionId)
    return this._getCurrentItem(session)
  }

  // Get current state (index, progress, score, etc.)
  getCurrentState(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const currentIndex = session.mode === 'learn' 
      ? session.learnState.currentIndex 
      : session.exerciseState.currentIndex

    return {
      mode: session.mode,
      currentIndex,
      currentItem: this._getCurrentItem(session),
      totalItems: session.items.length,
      progress: {
        current: currentIndex + 1,
        total: session.items.length,
        percentage: session.items.length > 0 ? ((currentIndex + 1) / session.items.length) * 100 : 0
      },
      learnState: { ...session.learnState },
      exerciseState: { 
        ...session.exerciseState,
        score: { ...session.exerciseState.score }
      },
      canGoPrevious: currentIndex > 0,
      canGoNext: currentIndex < session.items.length - 1,
    }
  }

  // Update session items (useful when data changes)
  updateItems(sessionId, newItems) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    session.items = [...newItems]
    session.originalItems = [...newItems]
    
    // Reset indices if they're out of bounds
    if (session.learnState.currentIndex >= newItems.length) {
      session.learnState.currentIndex = Math.max(0, newItems.length - 1)
    }
    if (session.exerciseState.currentIndex >= newItems.length) {
      session.exerciseState.currentIndex = Math.max(0, newItems.length - 1)
    }

    this._notifyUpdate(session)
    return session
  }

  // Destroy session
  destroySession(sessionId) {
    return this.sessions.delete(sessionId)
  }

  /**
   * PRIVATE METHODS
   */

  _getCurrentItem(session) {
    if (!session || session.items.length === 0) return null
    
    const currentIndex = session.mode === 'learn' 
      ? session.learnState.currentIndex 
      : session.exerciseState.currentIndex
    
    return session.items[currentIndex] || null
  }

  _notifyUpdate(session) {
    const state = this.getCurrentState(session.id)
    session.callbacks.onUpdate(state)
    
    if (session.mode === 'learn') {
      this._notifyLearnUpdate(session)
    } else {
      this._notifyExerciseUpdate(session)
    }
  }

  _notifyLearnUpdate(session) {
    const state = this.getCurrentState(session.id)
    session.callbacks.onLearnUpdate(state)
  }

  _notifyExerciseUpdate(session) {
    const state = this.getCurrentState(session.id)
    session.callbacks.onExerciseUpdate(state)
  }
}

// Export singleton instance
export const navigationService = new NavigationService()

// Export class for multiple instances if needed
export { NavigationService }