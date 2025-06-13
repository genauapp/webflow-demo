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

    // Gather pre‑removal indices of ALL unknowns
    const preUnknownIndices = state.activeLearnOrder
      .map((w, idx) => (!w.isKnown ? idx : -1))
      .filter((idx) => idx >= 0)
    const uCount = preUnknownIndices.length

    // If only one unknown, short‐circuit
    if (uCount <= 1) {
      this._notifyUpdate(session)
      return currentWord
    }

    // Pick one of those u slots at random
    const pickPreIndex = preUnknownIndices[Math.floor(Math.random() * uCount)]

    // Remove currentWord
    state.activeLearnOrder.splice(state.currentIndex, 1)

    // Adjust insertion index if needed
    let insertIndex = pickPreIndex
    if (pickPreIndex > state.currentIndex) {
      insertIndex = pickPreIndex - 1
    }
    // (if pickPreIndex < currentIndex, it stays the same;
    // if pickPreIndex === currentIndex, you’ll reinsert at the same spot)

    // Reinsert currentWord at the chosen unknown slot
    state.activeLearnOrder.splice(insertIndex, 0, currentWord)

    // Keep the cursor pointing at the same array index
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
