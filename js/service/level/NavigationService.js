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

    // Count total unknown words
    const unknownWords = state.activeLearnOrder.filter((w) => !w.isKnown)
    const totalUnknown = unknownWords.length

    // If only one unknown word left, no repositioning needed
    if (totalUnknown <= 1) {
      this._notifyUpdate(session)
      return currentWord
    }

    // Get all unknown positions EXCEPT the current one
    const otherUnknownPositions = []
    for (let i = 0; i < state.activeLearnOrder.length; i++) {
      if (i !== state.currentIndex && !state.activeLearnOrder[i].isKnown) {
        otherUnknownPositions.push(i)
      }
    }

    // Pick a random position from the other unknown positions
    const targetPosition =
      otherUnknownPositions[
        Math.floor(Math.random() * otherUnknownPositions.length)
      ]

    // Remove current word
    state.activeLearnOrder.splice(state.currentIndex, 1)

    // Adjust target position if it was after the removed word
    const adjustedTarget =
      targetPosition > state.currentIndex ? targetPosition - 1 : targetPosition

    // Insert current word at the target position
    state.activeLearnOrder.splice(adjustedTarget, 0, currentWord)

    // Now find the next unknown word starting from the original currentIndex
    // (or from 0 if currentIndex is now out of bounds)
    let nextIndex = Math.min(
      state.currentIndex,
      state.activeLearnOrder.length - 1
    )

    // Look for the next unknown word
    while (nextIndex < state.activeLearnOrder.length) {
      if (!state.activeLearnOrder[nextIndex].isKnown) {
        state.currentIndex = nextIndex
        break
      }
      nextIndex++
    }

    // If we didn't find any unknown words after currentIndex, start from beginning
    if (nextIndex >= state.activeLearnOrder.length) {
      nextIndex = 0
      while (nextIndex < state.activeLearnOrder.length) {
        if (!state.activeLearnOrder[nextIndex].isKnown) {
          state.currentIndex = nextIndex
          break
        }
        nextIndex++
      }
    }

    // If still no unknown words found, we're done
    if (nextIndex >= state.activeLearnOrder.length) {
      state.currentIndex = -1
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
