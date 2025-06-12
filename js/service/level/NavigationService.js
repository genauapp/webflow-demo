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
   * @param {number} options.streakTarget - Target streak for exercise completion (1-5)
   */
  createSession(sessionId, items, options = {}) {
    const session = {
      id: sessionId,
      items: [...items],
      originalItems: [...items],
      mode: options.mode || 'learn',
      streakTarget: options.streakTarget || 3, // Default streak target
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
      },
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
   * Update streak target configuration
   */
  updateStreakTarget(sessionId, streakTarget) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    session.streakTarget = Math.max(1, Math.min(5, streakTarget))
    return session
  }

  /**
   * LEARN MODE NAVIGATION
   */

  // Repeat current word - move to end of learn list, stay at same index
  learnRepeat(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session || session.items.length === 0) return null

    const state = session.learnState
    const currentIndex = state.currentIndex

    // Get active learn list (words that are not known)
    const activeLearnList = this._getActiveLearnList(session)
    if (activeLearnList.length === 0) return null

    // Find the current word in the active list
    const currentWord = activeLearnList[currentIndex]
    if (!currentWord) return null

    // Remove current word from its position and add to end
    activeLearnList.splice(currentIndex, 1)
    activeLearnList.push(currentWord)

    // Update the session items with the reordered active list plus known words
    this._updateSessionItems(session, activeLearnList)

    // Keep the same index (no progression)
    // If we're at the end and moved word to end, adjust index
    if (state.currentIndex >= activeLearnList.length) {
      state.currentIndex = Math.max(0, activeLearnList.length - 1)
    }

    this._notifyLearnUpdate(session)
    return this._getCurrentItem(session)
  }

  // "I Know" button - mark as known and move to next
  learnNext(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session || session.items.length === 0) return null

    const state = session.learnState
    const activeLearnList = this._getActiveLearnList(session)

    if (activeLearnList.length === 0) return null

    const currentIndex = state.currentIndex
    const currentWord = activeLearnList[currentIndex]

    if (currentWord) {
      // 1. Mark word as known
      currentWord.isKnown = true

      // 2. Remove from active learn list
      activeLearnList.splice(currentIndex, 1)

      // 3. Update session items
      this._updateSessionItems(session, activeLearnList)

      // 4. Index adjustment logic (FIXED)
      if (activeLearnList.length === 0) {
        // Case 1: List is now empty
        state.currentIndex = 0
      } else if (currentIndex >= activeLearnList.length) {
        // Case 2: Was at last position
        state.currentIndex = activeLearnList.length - 1
      } else {
        // Case 3: Stay at same index (next item slides in)
        state.currentIndex = currentIndex
      }
    }

    this._notifyUpdate(session)
    return this._getCurrentItem(session)
  }

  // Reset learn mode - appears when all words are known
  learnReset(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // Reset isKnown flags for all words
    session.originalItems.forEach((word) => {
      word.isKnown = false
    })

    // Shuffle the original items
    const shuffledItems = [...session.originalItems]
    for (let i = shuffledItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledItems[i], shuffledItems[j]] = [
        shuffledItems[j],
        shuffledItems[i],
      ]
    }

    // Update session
    session.items = shuffledItems
    session.learnState.currentIndex = 0
    session.learnState.history = []

    this._notifyLearnUpdate(session)
    return this._getCurrentItem(session)
  }

  // Check if all words are known (for showing reset button)
  isLearnCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    return session.originalItems.every((word) => word.isKnown === true)
  }

  /**
   * EXERCISE MODE NAVIGATION
   */

  // Handle correct answer in exercise mode
  exerciseCorrect(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const activeExerciseList = this._getActiveExerciseList(session)
    if (activeExerciseList.length === 0) return null

    const state = session.exerciseState
    const currentIndex = state.currentIndex
    const currentWord = activeExerciseList[currentIndex]

    if (!currentWord) return null

    // Increment streak
    currentWord.streak = (currentWord.streak || 0) + 1

    // Update score
    state.score.correct++
    state.score.total++
    state.score.attempts++

    // Check if word has reached target streak
    if (currentWord.streak >= session.streakTarget) {
      // Mark as correctly answered and remove from active exercise list
      currentWord.isCorrectlyAnswered = true
      activeExerciseList.splice(currentIndex, 1)

      // Update session items
      this._updateSessionItems(session, null, activeExerciseList)

      // Adjust index if needed
      if (state.currentIndex >= activeExerciseList.length) {
        state.currentIndex = Math.max(0, activeExerciseList.length - 1)
      }
    } else {
      // Move word to end of exercise list
      activeExerciseList.splice(currentIndex, 1)
      activeExerciseList.push(currentWord)

      // Update session items
      this._updateSessionItems(session, null, activeExerciseList)

      // Keep same index (auto-advance to next word)
      if (state.currentIndex >= activeExerciseList.length) {
        state.currentIndex = Math.max(0, activeExerciseList.length - 1)
      }
    }

    this._notifyExerciseUpdate(session)
    return this._getCurrentItem(session)
  }

  // Handle wrong answer in exercise mode
  exerciseWrong(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const activeExerciseList = this._getActiveExerciseList(session)
    if (activeExerciseList.length === 0) return null

    const state = session.exerciseState
    const currentIndex = state.currentIndex
    const currentWord = activeExerciseList[currentIndex]

    if (!currentWord) return null

    // Reset streak to 0
    currentWord.streak = 0

    // Update score
    state.score.total++
    state.score.attempts++

    // Move word to end of exercise list
    activeExerciseList.splice(currentIndex, 1)
    activeExerciseList.push(currentWord)

    // Update session items
    this._updateSessionItems(session, null, activeExerciseList)

    // Keep same index (auto-advance to next word)
    if (state.currentIndex >= activeExerciseList.length) {
      state.currentIndex = Math.max(0, activeExerciseList.length - 1)
    }

    this._notifyExerciseUpdate(session)
    return this._getCurrentItem(session)
  }

  // Reset exercise mode
  exerciseReset(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // Reset streak and isCorrectlyAnswered for all words
    session.originalItems.forEach((word) => {
      word.streak = 0
      word.isCorrectlyAnswered = false
    })

    // Reset exercise state
    session.exerciseState = {
      currentIndex: 0,
      score: { correct: 0, total: 0, attempts: 0 },
      answered: new Set(),
      history: [],
    }

    this._notifyExerciseUpdate(session)
    return this._getCurrentItem(session)
  }

  // Check if all exercises are completed (for showing reset button)
  isExerciseCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    return session.originalItems.every(
      (word) => word.isCorrectlyAnswered === true
    )
  }

  /**
   * UTILITY METHODS
   */

  // Get active learn list (words that are not known)
  _getActiveLearnList(session) {
    return session.items.filter((word) => !word.isKnown)
  }

  // Get active exercise list (words that are not correctly answered)
  _getActiveExerciseList(session) {
    return session.items.filter((word) => !word.isCorrectlyAnswered)
  }

  // Update session items maintaining the filtered lists
  _updateSessionItems(session, newLearnList = null, newExerciseList = null) {
    if (session.mode === 'learn' && newLearnList) {
      // Combine active learn list with known words
      const knownWords = session.items.filter((word) => word.isKnown)
      session.items = [...newLearnList, ...knownWords]
    } else if (session.mode === 'exercise' && newExerciseList) {
      // Combine active exercise list with completed words
      const completedWords = session.items.filter(
        (word) => word.isCorrectlyAnswered
      )
      session.items = [...newExerciseList, ...completedWords]
    }
  }

  // Get current item based on active mode
  getCurrentItem(sessionId) {
    const session = this.sessions.get(sessionId)
    return this._getCurrentItem(session)
  }

  // Get current state (index, progress, score, etc.)
  getCurrentState(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    let currentIndex, totalItems, currentItem, activeList

    if (session.mode === 'learn') {
      activeList = this._getActiveLearnList(session)
      currentIndex = session.learnState.currentIndex
      totalItems = activeList.length
      currentItem = activeList[currentIndex] || null
    } else {
      activeList = this._getActiveExerciseList(session)
      currentIndex = session.exerciseState.currentIndex
      totalItems = activeList.length
      currentItem = activeList[currentIndex] || null
    }

    return {
      mode: session.mode,
      currentIndex,
      currentItem,
      totalItems,
      progress: {
        current: totalItems > 0 ? currentIndex + 1 : 0,
        total: totalItems,
        percentage:
          totalItems > 0 ? ((currentIndex + 1) / totalItems) * 100 : 0,
      },
      learnState: { ...session.learnState },
      exerciseState: {
        ...session.exerciseState,
        score: { ...session.exerciseState.score },
      },
      canGoPrevious: false, // No previous functionality in new design
      canGoNext: totalItems > 0 && currentIndex < totalItems - 1,
      isLearnCompleted: this.isLearnCompleted(sessionId),
      isExerciseCompleted: this.isExerciseCompleted(sessionId),
      streakTarget: session.streakTarget,
      activeListLength: activeList.length,
    }
  }

  // Update session items (useful when data changes)
  updateItems(sessionId, newItems) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    session.items = [...newItems]
    session.originalItems = [...newItems]

    // Reset indices if they're out of bounds
    const activeLearnList = this._getActiveLearnList(session)
    const activeExerciseList = this._getActiveExerciseList(session)

    if (session.learnState.currentIndex >= activeLearnList.length) {
      session.learnState.currentIndex = Math.max(0, activeLearnList.length - 1)
    }
    if (session.exerciseState.currentIndex >= activeExerciseList.length) {
      session.exerciseState.currentIndex = Math.max(
        0,
        activeExerciseList.length - 1
      )
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
    if (!session) return null

    let activeList, currentIndex

    if (session.mode === 'learn') {
      activeList = this._getActiveLearnList(session)
      currentIndex = session.learnState.currentIndex
    } else {
      activeList = this._getActiveExerciseList(session)
      currentIndex = session.exerciseState.currentIndex
    }

    return activeList[currentIndex] || null
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
