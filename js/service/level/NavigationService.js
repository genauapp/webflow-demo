import {
  ExerciseStreakTarget,
  ExerciseType,
  ExerciseTypeSettingsMap,
  NavigationMode,
} from '../../constants/props.js'
import ListUtils from '../../utils/ListUtils.js'
import {
  DURATION_FEEDBACK_CORRECT_MS,
  DURATION_FEEDBACK_WRONG_MS,
} from '../../constants/timeout.js'
import NavigationUtils from '../../utils/level/NavigationUtils.js'
import SoundUtils from '../../utils/SoundUtils.js'
import AnimationUtils from '../../utils/AnimationUtils.js'

// =============================================================================
// NAVIGATION SERVICE - LEARNING AND EXERCISE SESSION MANAGEMENT
// =============================================================================
// This service manages user sessions for learning vocabulary/grammar through
// two modes: LEARN (flashcard-style review) and EXERCISE (quiz with streak tracking)
// =============================================================================

class NavigationService {
  constructor() {
    this.sessions = new Map()
  }

  // =============================================================================
  // SESSION LIFECYCLE MANAGEMENT
  // =============================================================================
  // Core session operations: create, retrieve, and destroy user sessions

  /**
   * Initializes a new learning session with specified items and configuration.
   * Sets up both learn and exercise progression states for the session.
   */
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
        onExerciseResults: configOptions.onExerciseResults || (() => {}),
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

  /**
   * Retrieves an existing session by its unique identifier.
   * Returns null if session doesn't exist.
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId)
  }

  /**
   * Permanently removes a session and all its associated data.
   * Returns true if session was found and deleted, false otherwise.
   */
  destroySession(sessionId) {
    return this.sessions.delete(sessionId)
  }

  // =============================================================================
  // GLOBAL SESSION CONFIGURATION
  // =============================================================================
  // Methods to modify session-wide settings that affect both modes

  /**
   * Updates the streak target for exercise mode - how many correct answers
   * in a row are needed to master a word.
   */
  updateStreakTarget(sessionId, newTarget) {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    session.streakTarget = newTarget
    // Set exerciseStartedAt if not already set
    const exerciseState = session.progression[NavigationMode.EXERCISE]
    if (!exerciseState.exerciseStartedAt) {
      exerciseState.exerciseStartedAt = new Date().toISOString()
    }
    this._notifyUpdate(session)
    return session
  }

  /**
   * Switches between LEARN (flashcard) and EXERCISE (quiz) modes.
   * Preserves progress in both modes when switching.
   */
  switchMode(sessionId, mode) {
    const session = this.sessions.get(sessionId)
    if (!session) return null
    session.mode = mode
    this._notifyUpdate(session)
    return session
  }

  // =============================================================================
  // LEARN MODE NAVIGATION
  // =============================================================================
  // Flashcard-style learning where users mark words as known/unknown
  // Words are shuffled and users can repeat unknown words

  /**
   * Marks the current word as known and advances to the next word.
   * Completes the session if this was the last word.
   */
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

  /**
   * Keeps the current word in rotation for continued practice.
   * Shuffles remaining unknown words to vary the learning sequence.
   */
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

  /**
   * Resets all learn progress - marks all words as unknown and
   * starts the session over with a fresh shuffle.
   */
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

  /**
   * Checks if the learn session has been completed.
   * Returns true when all words have been marked as known.
   */
  isLearnCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const state = session.progression[NavigationMode.LEARN]

    return state.isCompleted || state.currentIndex === -1
  }

  // =============================================================================
  // EXERCISE MODE NAVIGATION
  // =============================================================================
  // Quiz-style exercises with multiple choice options and streak tracking
  // Words must be answered correctly N times in a row to be mastered

  /**
   * Processes a user's answer in exercise mode with streak tracking.
   * Handles correct/incorrect logic, word advancement, and completion detection.
   * Includes built-in feedback delay before updating UI.
   */
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

      /** Word Count Map for Exercise Results */
      // // get current wrong count of the word
      const currentCount = this._getWordWrongCount(
        state.wrongAnswerCountMap,
        currentWord.id
      )
      // // increment it
      const newCount = currentCount + 1
      // // set it to wrong count map
      this.updateWrongAnswerMap(
        state.wrongAnswerCountMap,
        currentWord,
        currentCount,
        newCount
      )

      /** ************ */

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

    // 4) Play feedback sound for correct answer after streak update
    this._playFeedbackSoundAndAnimation({
      isCorrect,
      streak: currentWord.streak,
      streakTarget: session.streakTarget,
    })

    // 5) WAIT for the feedback duration _inside_ the service
    const feedbackDuration = isCorrect
      ? DURATION_FEEDBACK_CORRECT_MS
      : DURATION_FEEDBACK_WRONG_MS
    await new Promise((res) => setTimeout(res, feedbackDuration))

    // 6) notify other UI elements after the delay
    this._notifyUpdate(session)

    // 7) If exercise is completed, notify results callback
    if (state.isCompleted) {
      // Set exerciseCompletedAt timestamp
      state.exerciseCompletedAt = new Date().toISOString()
      this._notifyExerciseResults(session)
    }
    return currentWord
  }

  /**
   * Resets all exercise progress - clears streaks and mastery flags.
   * Restarts the exercise session with a fresh shuffle.
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

  /**
   * Checks if the exercise session has been completed.
   * Returns true when all words have reached the streak target.
   */
  isExerciseCompleted(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return false

    const state = session.progression[NavigationMode.EXERCISE]

    // Simple check: completed if index is -1 or explicitly marked as completed
    return state.isCompleted || state.currentIndex === -1
  }

  // =============================================================================
  // EXERCISE ANALYTICS AND RESULTS
  // =============================================================================
  // Methods for tracking performance and generating detailed exercise results

  /**
   * Filters words that still need practice based on streak target.
   * Used internally for exercise progression logic.
   */
  getRemainingExerciseWords(streakTarget, allWords) {
    return allWords.filter(
      (word) => !word.isCorrectlyAnswered && (word.streak || 0) < streakTarget
    )
  }

  /**
   * Updates the wrong answer tracking map when a word is answered incorrectly.
   * Manages the count-based grouping of words by mistake frequency.
   */
  updateWrongAnswerMap(wrongAnswerCountMap, word, oldCount, newCount) {
    // Remove from old count
    if (oldCount > 0) {
      const oldWords = wrongAnswerCountMap.get(oldCount) || []
      const filtered = oldWords.filter((w) => w.id !== word.id)
      if (filtered.length > 0) {
        wrongAnswerCountMap.set(oldCount, filtered)
      } else {
        wrongAnswerCountMap.delete(oldCount)
      }
    }

    // Add to new count
    const newWords = wrongAnswerCountMap.get(newCount) || []
    wrongAnswerCountMap.set(newCount, [...newWords, word])
  }

  /**
   * Generates comprehensive exercise results including performance analytics.
   * Categorizes words as 'good' (0-1 mistakes) or 'bad' (2+ mistakes).
   */
  getExerciseResults(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.progression[NavigationMode.EXERCISE]
    const wrongAnswerCountMap = state.wrongAnswerCountMap

    const goodWords = []
    const badWords = []

    // Get all words that have wrong answers
    const wordsInMap = new Set()
    for (const [wrongCount, words] of wrongAnswerCountMap.entries()) {
      const wordsWithCount = words.map((word) => ({ ...word, wrongCount }))

      if (wrongCount <= 1) {
        goodWords.push(...wordsWithCount)
      } else {
        badWords.push(...wordsWithCount)
      }

      words.forEach((word) => wordsInMap.add(word.id))
    }

    // Add perfect words (0 wrong answers)
    const perfectWords = session.originalItems
      .filter((word) => !wordsInMap.has(word.id))
      .map((word) => ({ ...word, wrongCount: 0 }))

    goodWords.unshift(...perfectWords)

    return {
      goodWords,
      badWords,
      totalWords: session.originalItems.length,
      score: state.score,
    }
  }

  /**
   * Generates the payload for completing a deck exercise, formatted for API POST.
   * @param {string} sessionId
   * @param {string} deckId
   * @param {string} exerciseStartedAt - ISO string
   * @param {string} exerciseCompletedAt - ISO string
   * @returns {object} API payload
   */
  getDeckExerciseCompletionPayload(sessionId) {
    const session = this.sessions.get(sessionId)
    if (!session) return null

    const state = session.progression[NavigationMode.EXERCISE]
    const streakTarget = ExerciseStreakTarget[session.streakTarget]
    const exerciseStartedAt = state.exerciseStartedAt
    const exerciseCompletedAt = state.exerciseCompletedAt
    const wordScores = session.originalItems.map((word) => ({
      word_id: word.id,
      wrong_count: this._getWordWrongCount(state.wrongAnswerCountMap, word.id),
    }))

    return {
      deck_id: sessionId,
      exercise_streak_target: streakTarget,
      exercise_started_at: exerciseStartedAt,
      exercise_completed_at: exerciseCompletedAt,
      word_scores: wordScores,
    }
  }

  // =============================================================================
  // PRIVATE HELPER METHODS
  // =============================================================================
  // Internal methods for state management and UI notifications

  /**
   * Creates the initial learn mode state with shuffled word order.
   * Sets up tracking for current position and completion status.
   */
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

  /**
   * Creates the initial exercise mode state with shuffled word order.
   * Initializes scoring, streak tracking, and wrong answer analytics.
   */
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
      wrongAnswerCountMap: new Map(), // Map of wrongCount -> [words]
      exerciseStartedAt: null,
      exerciseCompletedAt: null,
    }

    return initialExerciseProgression
  }

  /**
   * Gets the current active word based on session mode and progression state.
   * Assigns a random example to currentExample every time a word is accessed.
   * Returns null if session is completed or invalid.
   */
  _getCurrentItem(session) {
    if (!session) return null

    let currentWord = null
    if (session.mode === NavigationMode.LEARN) {
      const state = session.progression[NavigationMode.LEARN]
      if (
        state.isCompleted ||
        state.currentIndex === -1 ||
        state.activeOrder.length === 0
      ) {
        return null
      }
      currentWord = state.activeOrder[state.currentIndex] || null
    } else if (session.mode === NavigationMode.EXERCISE) {
      const state = session.progression[NavigationMode.EXERCISE]
      if (state.isCompleted || state.currentIndex === -1) return null
      currentWord = state.activeOrder[state.currentIndex] || null
    }
    // Centralized random example assignment
    if (
      currentWord &&
      Array.isArray(currentWord.examples) &&
      currentWord.examples.length > 0
    ) {
      const shuffled = ListUtils.shuffleArray(currentWord.examples)
      currentWord.example = shuffled[0]
    } else if (currentWord) {
      currentWord.example = null
    }
    return currentWord
  }

  /**
   * Generates multiple choice options for the current exercise question.
   * Adapts option generation based on vocabulary vs grammar exercise type.
   */
  _getCurrentExerciseOptions(
    exerciseType,
    correctWord,
    allWords,
    optionsCount
  ) {
    // Early check for MIXED type - use word-specific exercise type
    if (exerciseType === ExerciseType.MIXED) {
      exerciseType = correctWord.exerciseType
    }
    
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
    } else if (exerciseType === ExerciseType.ARTICLE) {
      return NavigationUtils.generateArticleOptions(
        correctWord,
        allWords,
        optionsCount
      )
    }
  }

  /**
   * Retrieves how many times a specific word has been answered incorrectly.
   * Searches through the wrong answer count map for the word's mistake count.
   */
  _getWordWrongCount(wrongAnswerCountMap, wordId) {
    for (const [count, words] of wrongAnswerCountMap.entries()) {
      if (words.some((w) => w.id === wordId)) {
        return count
      }
    }
    return 0
  }

  /**
   * Notifies UI components about streak updates immediately after answering.
   * Provides real-time feedback for correct/incorrect streak changes.
   */
  _notifyStreakUpdate(session, word) {
    if (session.callbacks.onStreakUpdate) {
      session.callbacks.onStreakUpdate({
        word: word,
        streak: word.streak,
        streakTarget: session.streakTarget,
      })
    }
  }

  /**
   * Plays feedback sound based on answer correctness and streak status.
   */
  _playFeedbackSoundAndAnimation({ isCorrect, streak, streakTarget }) {
    if (!isCorrect) return
    if (streak >= streakTarget) {
      SoundUtils.playStreakSound()
      AnimationUtils.runConfettiAnimation()
    } else {
      SoundUtils.playCorrectSound()
    }
  }

  /**
   * Notifies all registered UI callbacks about session state changes.
   * Handles mode-specific updates and generates fresh exercise options.
   */
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
      // console.info(
      //   `EXERCISE PROGRESSION UPDATE:\n > ${JSON.stringify(
      //     session.progression[NavigationMode.EXERCISE],
      //     null,
      //     4
      //   )}`
      // )
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
        options:
          session.exerciseType === ExerciseType.ARTICLE
            ? exerciseProgressionState.currentOptions // don't shuffle article options
            : ListUtils.shuffleArray(exerciseProgressionState.currentOptions), // for shuffling options visually
        currentIndex: exerciseProgressionState.currentIndex + 1, // visual index starts from 1
        lastIndex: exerciseProgressionState.lastIndex + 1, // visual index ends at n + 1
        allWords: session.originalItems,
        score: exerciseProgressionState.score,
      })
    }
  }

  /**
   * Triggers the exercise results callback when a session is completed.
   * Provides comprehensive analytics and performance summary.
   */
  _notifyExerciseResults(session) {
    if (session.callbacks.onExerciseResults) {
      const results = this.getExerciseResults(session.id)
      const progression = session.progression[NavigationMode.EXERCISE]
      const postPayload = this.getDeckExerciseCompletionPayload(session.id)
      session.callbacks.onExerciseResults(results, postPayload)
    }
  }
}

export const navigationService = new NavigationService()
