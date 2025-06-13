import { NavigationMode } from '../../constants/props.js'
import ListUtils from '../../utils/ListUtils.js'

class NavigationService {
  constructor() {
    this.sessions = new Map()
  }

  createSession(sessionId, items, options = {}) {
    // Initialize learn state with shuffled non-known words
    const learnState = {
      currentIndex: 0,
      activeLearnOrder: ListUtils.shuffleArray([...items]),
      history: [],
    }

    const session = {
      id: sessionId,
      originalItems: [...items],
      mode: options.mode || NavigationMode.LEARN,
      learnState,
      callbacks: {
        onUpdate: options.onUpdate || (() => {}),
        onLearnUpdate: options.onLearnUpdate || (() => {}),
      },
    }

    this.sessions.set(sessionId, session)
    this._notifyUpdate(session)
    return session
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId)
  }

  destroySession(sessionId) {
    return this.sessions.delete(sessionId)
  }

  switchMode(sessionId, mode) {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    session.mode = mode
    this._notifyUpdate(session)
    return session
  }

  // LEARN MODE NAVIGATION
  learnNext(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.learnState
    if (state.currentIndex === -1) return null // Already completed

    const currentWord = state.activeLearnOrder[state.currentIndex]
    if (!currentWord) return null

    // Mark word as known
    currentWord.isKnown = true

    // Move to next word
    if (state.currentIndex < state.activeLearnOrder.length - 1) {
      state.currentIndex++
    } else {
      // Reached end of list
      state.currentIndex = -1
    }

    this._notifyUpdate(session)
    return currentWord
  }

  learnRepeat(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.learnState
    if (state.currentIndex === -1) return null // done

    const currentWord = state.activeLearnOrder[state.currentIndex]
    if (!currentWord) return null

    // Find ALL unknown words (including current)
    const allUnknownIndices = state.activeLearnOrder
      .map((w, idx) => (!w.isKnown ? idx : -1))
      .filter((idx) => idx >= 0)

    const totalUnknown = allUnknownIndices.length

    // If only one unknown word left, no repositioning needed
    if (totalUnknown <= 1) {
      this._notifyUpdate(session)
      return currentWord
    }

    // Find unknown positions EXCLUDING the current word's position
    const otherUnknownIndices = allUnknownIndices.filter(
      (idx) => idx !== state.currentIndex
    )

    // Pick a random position from the OTHER unknown positions
    const randomOtherIndex =
      otherUnknownIndices[
        Math.floor(Math.random() * otherUnknownIndices.length)
      ]

    // Remove current word from its position
    state.activeLearnOrder.splice(state.currentIndex, 1)

    // Calculate the adjusted insertion index
    let adjustedInsertIndex = randomOtherIndex
    if (randomOtherIndex > state.currentIndex) {
      adjustedInsertIndex = randomOtherIndex - 1
    }

    // Insert the current word at the new position
    state.activeLearnOrder.splice(adjustedInsertIndex, 0, currentWord)

    // Update current index to point to the word at the original position
    // (or adjust if we're at the end)
    if (state.currentIndex >= state.activeLearnOrder.length) {
      state.currentIndex = state.activeLearnOrder.length - 1
    }

    this._notifyUpdate(session)
    return currentWord
  }

  learnReset(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // Reset all words
    session.originalItems.forEach((word) => {
      word.isKnown = false
    })

    // Reinitialize learn state
    session.learnState = {
      currentIndex: 0,
      activeLearnOrder: ListUtils.shuffleArray([...session.originalItems]),
      history: [],
    }

    this._notifyUpdate(session)
    return this._getCurrentItem(session)
  }

  isLearnCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false
    return session.learnState.currentIndex === -1
  }

  // UTILITY METHODS
  getCurrentState(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const learnState = session.learnState
    const isCompleted = this.isLearnCompleted(sessionId)
    const remaining = isCompleted
      ? 0
      : learnState.activeLearnOrder.length - learnState.currentIndex

    return {
      mode: session.mode,
      currentItem: this._getCurrentItem(session),
      totalItems: session.originalItems.length,
      progress: {
        current: session.originalItems.filter((w) => w.isKnown).length,
        total: session.originalItems.length,
        remaining,
      },
      isLearnCompleted: isCompleted,
      activeListLength: isCompleted
        ? 0
        : learnState.activeLearnOrder.length - learnState.currentIndex,
    }
  }

  // PRIVATE METHODS
  _getCurrentItem(session) {
    if (!session) return null
    if (session.mode !== NavigationMode.LEARN) return null

    const state = session.learnState
    if (state.currentIndex === -1) return null
    return state.activeLearnOrder[state.currentIndex] || null
  }

  _notifyUpdate(session) {
    const state = this.getCurrentState(session.id)
    session.callbacks.onUpdate(state)
    session.callbacks.onLearnUpdate(state)
  }
}

export const navigationService = new NavigationService()
