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

    // Initialize exercise state with shuffled items
    const exerciseState = {
      currentIndex: 0,
      activeExerciseOrder: ListUtils.shuffleArray([...items]),
      score: { correct: 0, total: 0 },
      numberOfWrongAnswers: new Map(), // Map of word -> wrong answer count
    }

    const session = {
      id: sessionId,
      originalItems: [...items],
      mode: options.mode || NavigationMode.LEARN,
      learnState,
      exerciseState,
      streakTarget: options.streakTarget || 3,
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
    if (state.currentIndex === -1) return null

    const currentWord = state.activeLearnOrder[state.currentIndex]
    if (!currentWord) return null

    // Get all unknown words
    const unknownWords = state.activeLearnOrder.filter((word) => !word.isKnown)
    const uCount = unknownWords.length

    // Handle case with only one unknown word
    if (uCount <= 1) {
      this._notifyUpdate(session)
      return currentWord
    }

    // Pick a random unknown word
    const randomIndex = Math.floor(Math.random() * uCount)
    const pickedWord = unknownWords[randomIndex]

    // If picked word is different from current, swap positions
    if (pickedWord !== currentWord) {
      const pickedWordIndex = state.activeLearnOrder.indexOf(pickedWord)
      state.activeLearnOrder[state.currentIndex] = pickedWord
      state.activeLearnOrder[pickedWordIndex] = currentWord
    }

    const wordToShow = state.activeLearnOrder[state.currentIndex]
    this._notifyUpdate(session)
    return wordToShow
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

  // EXERCISE MODE NAVIGATION
  exerciseAnswer(sessionId, isCorrect) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.exerciseState
    if (state.currentIndex === -1) return null // Already completed

    const currentWord = state.activeExerciseOrder[state.currentIndex]
    if (!currentWord) return null

    // Update total score
    state.score.total++

    if (isCorrect) {
      // Increment streak and score
      currentWord.streak = (currentWord.streak || 0) + 1
      state.score.correct++

      // Check if word reached streak target
      if (currentWord.streak >= session.streakTarget) {
        currentWord.isCorrectlyAnswered = true
        // Remove from active exercise order
        state.activeExerciseOrder.splice(state.currentIndex, 1)
        // Don't increment index since we removed current item
        if (state.currentIndex >= state.activeExerciseOrder.length) {
          state.currentIndex = state.activeExerciseOrder.length > 0 ? 0 : -1
        }
      } else {
        // Move to next word but keep current word in the list
        state.currentIndex =
          (state.currentIndex + 1) % state.activeExerciseOrder.length
      }
    } else {
      // Reset streak and track wrong answer
      currentWord.streak = 0
      const wrongCount = state.numberOfWrongAnswers.get(currentWord) || 0
      state.numberOfWrongAnswers.set(currentWord, wrongCount + 1)

      // Move to next word
      state.currentIndex =
        (state.currentIndex + 1) % state.activeExerciseOrder.length
    }

    this._notifyUpdate(session)
    return currentWord
  }

  exerciseReset(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // Reset all exercise-related properties
    session.originalItems.forEach((word) => {
      word.streak = 0
      word.isCorrectlyAnswered = false
    })

    // Reinitialize exercise state
    session.exerciseState = {
      currentIndex: 0,
      activeExerciseOrder: ListUtils.shuffleArray([...session.originalItems]),
      score: { correct: 0, total: 0 },
      numberOfWrongAnswers: new Map(),
    }

    this._notifyUpdate(session)
    return this._getCurrentItem(session)
  }

  isExerciseCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false
    return (
      session.exerciseState.currentIndex === -1 ||
      session.exerciseState.activeExerciseOrder.length === 0
    )
  }

  updateStreakTarget(sessionId, newTarget) {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    session.streakTarget = newTarget
    this._notifyUpdate(session)
    return session
  }

  // UTILITY METHODS
  getCurrentState(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const learnState = session.learnState
    const exerciseState = session.exerciseState
    const isLearnCompleted = this.isLearnCompleted(sessionId)
    const isExerciseCompleted = this.isExerciseCompleted(sessionId)
    const remaining = isLearnCompleted
      ? 0
      : learnState.activeLearnOrder.length - learnState.currentIndex

    return {
      mode: session.mode,
      currentItem: this._getCurrentItem(session),
      totalItems: session.originalItems.length,
      streakTarget: session.streakTarget,
      progress: {
        current: session.originalItems.filter((w) => w.isKnown).length,
        total: session.originalItems.length,
        remaining,
      },
      isLearnCompleted: isLearnCompleted,
      isExerciseCompleted: isExerciseCompleted,
      activeListLength: isLearnCompleted
        ? 0
        : learnState.activeLearnOrder.length - learnState.currentIndex,
    }
  }

  // PRIVATE METHODS
  _getCurrentItem(session) {
    if (!session) return null

    if (session.mode === NavigationMode.LEARN) {
      const state = session.learnState
      if (state.currentIndex === -1) return null
      return state.activeLearnOrder[state.currentIndex] || null
    } else if (session.mode === NavigationMode.EXERCISE) {
      const state = session.exerciseState
      if (state.currentIndex === -1 || state.activeExerciseOrder.length === 0)
        return null
      return state.activeExerciseOrder[state.currentIndex] || null
    }
    return null
  }

  _notifyUpdate(session) {
    const state = this.getCurrentState(session.id)
    session.callbacks.onUpdate(state)
    if (session.mode === NavigationMode.LEARN) {
      session.callbacks.onLearnUpdate(state)
    } else if (session.mode === NavigationMode.EXERCISE) {
      session.callbacks.onExerciseUpdate(state)
    }
  }
}

export const navigationService = new NavigationService()
