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

    const remainingWords = this.getRemainingExerciseWords(
      session.streakTarget,
      session.originalItems
    )
    if (remainingWords.length === 0) return null // Exercise completed

    const state = session.progression[NavigationMode.EXERCISE]
    const currentWord = remainingWords[state.currentIndex]
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
      }
    } else {
      // Wrong answer - reset streak and track mistake
      currentWord.streak = 0
      const wrongCount = state.wrongAnswerCountMap.get(currentWord) || 0
      state.wrongAnswerCountMap.set(currentWord, wrongCount + 1)
    }

    // Get updated remaining words after potential mastery
    const updatedRemainingWords = this.getRemainingExerciseWords(
      session.streakTarget,
      session.originalItems
    )

    if (updatedRemainingWords.length === 0) {
      // Exercise completed
      state.isCompleted = true
      state.currentIndex = -1
    } else if (currentWord.isCorrectlyAnswered) {
      // Only increment index if word was mastered (reached streak target)
      if (state.currentIndex >= updatedRemainingWords.length) {
        state.currentIndex = 0 // Wrap to beginning
      }
    } else {
      // Word wasn't mastered - cycle to next word but keep same index
      // This ensures next word is loaded without changing the remaining count
      const nextWordIndex =
        (state.currentIndex + 1) % updatedRemainingWords.length
      const nextWord = updatedRemainingWords[nextWordIndex]

      // Find and swap the next word to current index position
      const currentIndexInOriginal = session.originalItems.indexOf(
        updatedRemainingWords[state.currentIndex]
      )
      const nextIndexInOriginal = session.originalItems.indexOf(nextWord)

      // Swap positions in original array
      const temp = session.originalItems[currentIndexInOriginal]
      session.originalItems[currentIndexInOriginal] =
        session.originalItems[nextIndexInOriginal]
      session.originalItems[nextIndexInOriginal] = temp
    }

    this._notifyUpdate(session)
    return currentWord
  }

  // Helper method for exercise mode - get words that haven't reached streak target
  getRemainingExerciseWords(streakTarget, allWords) {
    return allWords.filter(
      (word) => !word.isCorrectlyAnswered && (word.streak || 0) < streakTarget
    )
  }

  isExerciseCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const state = session.progression[NavigationMode.EXERCISE]

    // Check if any words are still remaining
    const remainingWords = this.getRemainingExerciseWords(
      session.streakTarget,
      session.originalItems
    )

    return (
      state.isCompleted ||
      state.currentIndex === -1 ||
      remainingWords.length === 0
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
          lastIndex: shuffledLearnList.length - 1,
          activeOrder: shuffledLearnList,
          history: [],
        }

        return initialLearnProgression
      case NavigationMode.EXERCISE:
        const shuffledExerciseList = ListUtils.shuffleArray([...items])

        const initialExerciseProgression = {
          isCompleted: false,
          currentIndex: 0,
          lastIndex: shuffledExerciseList.length - 1,
          activeOrder: shuffledExerciseList,
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

    if (session.mode === NavigationMode.LEARN) {
      const state = session.progression[NavigationMode.EXERCISE]
      if (
        state.isCompleted ||
        state.currentIndex === -1 ||
        state.activeOrder.length === 0
      ) {
        return null
      }

      return state.activeOrder[state.currentIndex] || null
    } else if (session.mode === NavigationMode.EXERCISE) {
      const state = session.progression[NavigationMode.EXERCISE]

      if (state.isCompleted || state.currentIndex === -1) return null

      // Filter remaining words on-the-fly
      const remainingWords = this.getRemainingExerciseWords(
        session.streakTarget,
        session.originalItems
      )

      if (remainingWords.length === 0) {
        state.isCompleted = true
        return null
      }

      return remainingWords[state.currentIndex] || null
    }
  }

  _notifyUpdate(session) {
    console.info(
      `SESSION ITEMS UPDATED:\n > ${JSON.stringify(
        session.originalItems,
        null,
        4
      )}`
    )

    session.callbacks.onUpdate(session)

    if (session.mode === NavigationMode.LEARN) {
      const learnProgressionState = session.progression[NavigationMode.LEARN]

      session.callbacks.onLearnUpdate({
        currentWord: this._getCurrentItem(session),
        currentIndex: learnProgressionState.currentIndex + 1, // visual index starts from 1
        lastIndex: learnProgressionState.lastIndex + 1, // visual index ends at n + 1
      })
    } else if (session.mode === NavigationMode.EXERCISE) {
      const exerciseProgressionState =
        session.progression[NavigationMode.EXERCISE]

      session.callbacks.onExerciseUpdate({
        currentWord: this._getCurrentItem(session),
        currentIndex: exerciseProgressionState.currentIndex + 1, // visual index starts from 1
        lastIndex: exerciseProgressionState.lastIndex + 1, // visual index ends at n + 1
        allWords: this.getRemainingExerciseWords(
          session.streakTarget,
          session.originalItems
        ),
        score: exerciseProgressionState.score,
      })
    }
  }
}

export const navigationService = new NavigationService()
