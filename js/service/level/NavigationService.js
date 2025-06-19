import {
  ExerciseType,
  ExerciseTypeSettingsMap,
  NavigationMode,
} from '../../constants/props.js'
import ListUtils from '../../utils/ListUtils.js'
import { DURATION_FEEDBACK_MS } from '../../constants/timeout.js'
import NavigationUtils from '../../utils/level/NavigationUtils.js'

class NavigationService {
  constructor() {
    this.sessions = new Map()
  }

  createSession(sessionId, items, configOptions = {}) {
    const baseItems = [...items]
    const currentMode = configOptions.mode || NavigationMode.LEARN

    const session = {
      id: sessionId,
      originalItems: baseItems,
      mode: currentMode,
      exerciseType: configOptions.exerciseType,
      streakTarget: configOptions.streakTarget || 0,
      callbacks: {
        onUpdate: configOptions.onUpdate || (() => {}),
        onLearnUpdate: configOptions.onLearnUpdate || (() => {}),
        onExerciseUpdate: configOptions.onExerciseUpdate || (() => {}),
        onStreakUpdate: configOptions.onStreakUpdate || (() => {}),
      },
      progression: {
        learn: this._getInitialLearnProgression(items),
        exercise: this._getInitialExerciseProgression(
          items,
          configOptions.exerciseType
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

  // STREAK TARGET
  updateStreakTarget(sessionId, newTarget) {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    session.streakTarget = newTarget
    this._notifyUpdate(session)
    return session
  }

  // LEARN/EXERCISE MODE
  switchMode(sessionId, mode) {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    session.mode = mode
    this._notifyUpdate(session)
    return session
  }

  // // LEARN MODE NAVIGATION
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
    const remainingUnknownWords = state.activeOrder.filter(
      (word) => !word.isKnown
    )

    // Handle case with only one unknown word
    if (remainingUnknownWords.length > 1) {
      const swappedActiveOrder = NavigationUtils.getSwappedActiveOrder(
        state.activeOrder,
        state.currentIndex,
        remainingUnknownWords
      )

      // Assign it back
      state.activeOrder = swappedActiveOrder
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
    session.progression[NavigationMode.LEARN] =
      this._getInitialLearnProgression(session.originalItems)

    this._notifyUpdate(session)
    return this._getCurrentItem(session)
  }

  isLearnCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const state = session.progression[NavigationMode.LEARN]

    return state.isCompleted || state.currentIndex === -1
  }

  // // EXERCISE MODE NAVIGATION
  async exerciseAnswer(sessionId, isCorrect) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.progression[NavigationMode.EXERCISE]
    if (state.currentIndex === -1) return null // Completed

    const currentWord = state.activeOrder[state.currentIndex]
    if (!currentWord) return null

    // 1) update score
    state.score.total++

    // 2) streak logic lives here only
    if (isCorrect) {
      currentWord.streak = (currentWord.streak || 0) + 1
      state.score.correct++

      if (currentWord.streak >= session.streakTarget) {
        // SAME as learnNext: Mark as mastered and move to next
        currentWord.isCorrectlyAnswered = true

        if (state.currentIndex < state.activeOrder.length - 1) {
          state.currentIndex++
        } else {
          // Reached end of list
          state.currentIndex = -1
          state.isCompleted = true
        }
      } else {
        // SAME as learnRepeat: Keep same index, change current word
        // Get all words that haven't reached streak target
        const remainingWords = state.activeOrder.filter(
          (word) =>
            !word.isCorrectlyAnswered &&
            (word.streak || 0) < session.streakTarget
        )

        // Only swap when there’s more than one candidate
        if (remainingWords.length > 1) {
          const swappedActiveOrder = NavigationUtils.getSwappedActiveOrder(
            state.activeOrder,
            state.currentIndex,
            remainingWords
          )

          // Assign it back
          state.activeOrder = swappedActiveOrder
        }
      }
    } else {
      // Wrong answer: reset streak and apply learnRepeat logic
      currentWord.streak = 0

      // const wrong = state.wrongAnswerCountMap.get(wrong + 1) || 0
      // state.wrongAnswerCountMap.set(wrong + 1, currentWord)

      // SAME as learnRepeat: Keep same index, change current word
      const remainingWords = state.activeOrder.filter(
        (word) =>
          !word.isCorrectlyAnswered && (word.streak || 0) < session.streakTarget
      )

      // Only swap when there’s more than one candidate
      if (remainingWords.length > 1) {
        const swappedActiveOrder = NavigationUtils.getSwappedActiveOrder(
          state.activeOrder,
          state.currentIndex,
          remainingWords
        )

        // Assign it back
        state.activeOrder = swappedActiveOrder
      }
    }

    // Clear options for new word
    state.currentOptions = []

    // 3) fire immediate streak‐update callback
    this._notifyStreakUpdate(session, currentWord)

    // 4) WAIT for the feedback duration _inside_ the service
    await new Promise((res) => setTimeout(res, DURATION_FEEDBACK_MS))

    // 5) notify other UI elements after the delay
    this._notifyUpdate(session)
    return currentWord
  }

  // Helper method for exercise mode - get words that haven't reached streak target
  getRemainingExerciseWords(streakTarget, allWords) {
    return allWords.filter(
      (word) => !word.isCorrectlyAnswered && (word.streak || 0) < streakTarget
    )
  }

  /**
   * Reset exercise progression: wipe streaks, isCorrectlyAnswered flags,
   * and re‑init the exercise state.
   */
  exerciseReset(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    // Reset per‑word exercise flags
    session.originalItems.forEach((word) => {
      word.streak = 0
      word.isCorrectlyAnswered = false
    })

    // Re‑init exercise progression
    session.progression[NavigationMode.EXERCISE] =
      this._getInitialExerciseProgression(
        session.originalItems,
        session.exerciseType
      )

    this._notifyUpdate(session)
    return this._getCurrentItem(session)
  }

  isExerciseCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const state = session.progression[NavigationMode.EXERCISE]

    // Simple check: completed if index is -1 or explicitly marked as completed
    return state.isCompleted || state.currentIndex === -1
  }

  // UTILITY METHODS
  // getCurrentItem() {
  //   return this._getCurrentItem(this.getSession())
  // }

  // PRIVATE METHODS
  _getInitialLearnProgression(items) {
    const shuffledLearnList = ListUtils.shuffleArray([...items])

    const initialLearnProgression = {
      isCompleted: false,
      currentIndex: 0,
      lastIndex: shuffledLearnList.length - 1,
      activeOrder: shuffledLearnList,
      history: [],
    }

    return initialLearnProgression
  }

  _getInitialExerciseProgression(items, exerciseType) {
    const shuffledExerciseList = ListUtils.shuffleArray([...items])

    const initialExerciseProgression = {
      exerciseType: exerciseType,
      isCompleted: false,
      currentOptions: [],
      currentIndex: 0,
      lastIndex: shuffledExerciseList.length - 1,
      activeOrder: shuffledExerciseList,
      score: { correct: 0, total: 0 },
      wrongAnswerCountMap: new Map(), // Map of word -> wrong answer count
    }

    return initialExerciseProgression
  }

  _getCurrentItem(session) {
    if (!session) return null

    if (session.mode === NavigationMode.LEARN) {
      // BUG FIX: was using EXERCISE state instead of LEARN state
      const state = session.progression[NavigationMode.LEARN]
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

      // Simplified: just return the current word at current index
      return state.activeOrder[state.currentIndex] || null
    }
  }

  _getCurrentExerciseOptions(
    exerciseType,
    correctWord,
    allWords,
    optionsCount
  ) {
    if (exerciseType === ExerciseType.VOCABULARY) {
      return NavigationUtils.generateVocabularyOptions(
        correctWord,
        allWords,
        optionsCount
      )
    } else if (exerciseType === ExerciseType.GRAMMAR) {
      return NavigationUtils.generateGrammarOptions(
        correctWord,
        allWords,
        optionsCount
      )
    }
  }

  _notifyUpdate(session) {
    session.callbacks.onUpdate(session)

    const currentWord = this._getCurrentItem(session)

    if (session.mode === NavigationMode.LEARN) {
      const learnProgressionState = session.progression[NavigationMode.LEARN]

      session.callbacks.onLearnUpdate({
        currentWord: currentWord,
        currentIndex: learnProgressionState.currentIndex + 1, // visual index starts from 1
        lastIndex: learnProgressionState.lastIndex + 1, // visual index ends at n + 1
      })
    } else if (session.mode === NavigationMode.EXERCISE) {
      console.info(
        `EXERCISE PROGRESSION UPDATE:\n > ${JSON.stringify(
          session.progression[NavigationMode.EXERCISE],
          null,
          4
        )}`
      )
      const exerciseProgressionState =
        session.progression[NavigationMode.EXERCISE]

      // Generate options only if:
      // - We have a current word
      // - Options array is empty
      if (currentWord && exerciseProgressionState.currentOptions.length === 0) {
        // shuffle it to change their order
        const cachedOptions = this._getCurrentExerciseOptions(
          session.exerciseType,
          currentWord,
          session.originalItems,
          ExerciseTypeSettingsMap[session.exerciseType].optionsCount
        )

        exerciseProgressionState.currentOptions = cachedOptions
      }

      session.callbacks.onExerciseUpdate({
        exerciseType: session.exerciseType,
        streakTarget: session.streakTarget,
        currentWord: currentWord,
        options: ListUtils.shuffleArray(
          exerciseProgressionState.currentOptions
        ), // for shuffling options visually
        currentIndex: exerciseProgressionState.currentIndex + 1, // visual index starts from 1
        lastIndex: exerciseProgressionState.lastIndex + 1, // visual index ends at n + 1
        allWords: session.originalItems,
        score: exerciseProgressionState.score,
      })
    }
  }

  _notifyStreakUpdate(session, word) {
    if (session.callbacks.onStreakUpdate) {
      session.callbacks.onStreakUpdate({
        word: word,
        streak: word.streak,
        streakTarget: session.streakTarget,
      })
    }
  }
}

export const navigationService = new NavigationService()
