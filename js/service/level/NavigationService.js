import { NavigationMode } from '../../constants/props.js'
import ListUtils from '../../utils/ListUtils.js'

class NavigationService {
  constructor() {
    this.sessions = new Map()
  }

  createSession(sessionId, items, options = {}) {
    const baseItems = [...items]
    const currentMode = options.mode || NavigationMode.LEARN

    const session = {
      id: sessionId,
      originalItems: baseItems,
      mode: currentMode,
      streakTarget: options.streakTarget || 3,
      callbacks: {
        onUpdate: options.onUpdate || (() => {}),
        onLearnUpdate: options.onLearnUpdate || (() => {}),
        onExerciseUpdate: options.onExerciseUpdate || (() => {}),
      },
      progression: {
        learn: this._getInitialModeProgression(NavigationMode.LEARN, items),
        exercise: this._getInitialModeProgression(
          NavigationMode.EXERCISE,
          items
        ),
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

    const state = session.progression[NavigationMode.LEARN]
    if (state.currentIndex === -1) return null // Already completed

    const currentWord = state.activeOrder[state.currentIndex]
    if (!currentWord) return null

    // Mark word as known
    currentWord.isKnown = true

    // Move to next word
    if (state.currentIndex < state.activeOrder.length - 1) {
      state.currentIndex++
    } else {
      // Reached end of list
      state.currentIndex = -1
      state.isCompleted = true
    }

    this._notifyUpdate(session)
    return currentWord
  }

  learnRepeat(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.progression[NavigationMode.LEARN]
    if (state.currentIndex === -1) return null

    const currentWord = state.activeOrder[state.currentIndex]
    if (!currentWord) return null

    // Get all unknown words
    const unknownWords = state.activeOrder.filter((word) => !word.isKnown)
    const totalUnknownWords = unknownWords.length

    // Handle case with only one unknown word
    if (totalUnknownWords <= 1) {
      this._notifyUpdate(session)
      return currentWord
    }

    // Pick a random unknown word
    const randomIndex = Math.floor(Math.random() * totalUnknownWords)
    const pickedWord = unknownWords[randomIndex]

    // If picked word is different from current, swap positions
    if (pickedWord !== currentWord) {
      const pickedWordIndex = state.activeOrder.indexOf(pickedWord)
      state.activeOrder[state.currentIndex] = pickedWord
      state.activeOrder[pickedWordIndex] = currentWord
    }

    const wordToShow = state.activeOrder[state.currentIndex]
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
    session.progression[NavigationMode.LEARN] = this._getInitialModeProgression(
      NavigationMode.LEARN,
      session.originalItems
    )

    this._notifyUpdate(session)
    return this._getCurrentItem(session)
  }

  isLearnCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const state = session.progression[NavigationMode.LEARN]

    return state.isCompleted || state.currentIndex === -1
  }

  // EXERCISE MODE NAVIGATION
  exerciseAnswer(sessionId, isCorrect) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.progression[NavigationMode.EXERCISE]
    if (state.currentIndex === -1) return null // Already completed

    const currentWord = state.activeOrder[state.currentIndex]
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
        state.activeOrder.splice(state.currentIndex, 1)
        // Don't increment index since we removed current item
        if (state.currentIndex >= state.activeOrder.length) {
          const isCompleted = state.activeOrder.length > 0
          state.currentIndex = isCompleted ? 0 : -1
          state.isCompleted = isCompleted
        }
      }
      // FIX: Don't increment index - stay on same word until mastered
      // The word stays in the same position for repeated practice

      //    else {
      //   // 🔧 ALTERNATIVE: Move to next word but with smart cycling
      //   // This allows practicing other words while building streaks
      //   state.currentIndex = (state.currentIndex + 1) % state.activeOrder.length
      // }
    } else {
      // Reset streak and track wrong answer
      currentWord.streak = 0
      const wrongCount = state.wrongAnswerCountMap.get(currentWord) || 0
      state.wrongAnswerCountMap.set(currentWord, wrongCount + 1)

      // Move to next word
      state.currentIndex = (state.currentIndex + 1) % state.activeOrder.length
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
    session.progression[NavigationMode.EXERCISE] =
      this._getInitialModeProgression(
        NavigationMode.EXERCISE,
        session.originalItems
      )

    this._notifyUpdate(session)
    return this._getCurrentItem(session)
  }

  isExerciseCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const state = session.progression[NavigationMode.EXERCISE]

    return (
      state.isCompleted ||
      state.currentIndex === -1 ||
      state.activeOrder.length === 0
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
  // getCurrentItem() {
  //   return this._getCurrentItem(this.getSession())
  // }

  // PRIVATE METHODS
  _getInitialModeProgression(mode, items) {
    switch (mode) {
      case NavigationMode.LEARN:
        const shuffledLearnList = ListUtils.shuffleArray([...items])

        const initialLearnProgression = {
          isCompleted: false,
          currentIndex: 0,
          totalIndex: shuffledLearnList.length,
          activeOrder: shuffledLearnList,
          history: [],
        }

        return initialLearnProgression
      case NavigationMode.EXERCISE:
        const shuffledExerciseList = ListUtils.shuffleArray([...items])

        const initialExerciseProgression = {
          isCompleted: false,
          currentIndex: 0,
          totalIndex: shuffledExerciseList.length,
          activeOrder: shuffledExerciseList,
          originalItems: [...items],
          score: { correct: 0, total: 0 },
          wrongAnswerCountMap: new Map(), // Map of word -> wrong answer count
        }

        return initialExerciseProgression
      default:
        console.warn('Unsupported Mode!')
        break
    }
  }

  _getCurrentItem(session) {
    if (!session) return null

    const state = session.progression[session.mode]
    if (
      state.isCompleted ||
      state.currentIndex === -1 ||
      state.activeOrder.length === 0
    ) {
      return null
    }

    return state.activeOrder[state.currentIndex] || null
  }

  _notifyUpdate(session) {
    console.info(`SESSION UPDATED:\n > ${JSON.stringify(session, null, 4)}`)

    session.callbacks.onUpdate(session)

    if (session.mode === NavigationMode.LEARN) {
      session.callbacks.onLearnUpdate(session.progression[NavigationMode.LEARN])
    } else if (session.mode === NavigationMode.EXERCISE) {
      session.callbacks.onExerciseUpdate(
        session.progression[NavigationMode.EXERCISE]
      )
    }
  }
}

export const navigationService = new NavigationService()
