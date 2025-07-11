import { NavigationMode, PackType } from '../../../constants/props.js'
import { protectedApiService } from '../../../service/apiService.js'
import { navigationService } from '../../../service/level/NavigationService.js'
import { initLearn } from './shared/learn.js'
import { initStreakSettings } from './shared/streakSettings.js'
import { initExercise, updateStreakProgression } from './shared/exercise.js'
import { initExerciseResults } from './shared/exerciseResults.js'

const DEFAULT_STATE = Object.freeze({
  loading: false,
  error: null,
  words: [],
  sessionId: 'pack-practice', // Unique session identifier
  streakTarget: 0, // Initially unset streak target
  mounted: false, // New: has the component been initialized?
})

let els = {}
let state = {}

/** Initialize elements dynamically using provided IDs */
function initElements() {
  els = {
    container: () => document.getElementById('pack-practice-container'),
    // loadingContainer: () => document.getElementById("tbd"),
    // errorContainer: () => document.getElementById("tbd"),
    // emptyContainer: () => document.getElementById("tbd"),

    learnTab: () => document.getElementById('pack-practice-tab-learn'),
    learnContainer: () => document.getElementById('pack-practice-learn-container'),
    learnWordCard: () => document.getElementById('pack-practice-learn-word-card'),
    learnRepeat: () =>
      document.getElementById('pack-practice-learn-repeat-button'),
    learnNext: () => document.getElementById('pack-practice-learn-i-know-button'),
    learnCompletedCard: () =>
      document.getElementById('pack-practice-learn-completed-card'),
    learnReset: () => document.getElementById('pack-practice-learn-reset-button'),

    exerciseTab: () => document.getElementById('pack-practice-tab-exercise'),
    exerciseContainer: () =>
      document.getElementById('pack-practice-exercise-container'),
    exerciseStreakSettingsCard: () =>
      document.getElementById('pack-practice-exercise-streak-settings-card'),
    exerciseWordCard: () =>
      document.getElementById('pack-practice-exercise-word-card'),
    exerciseResultsCard: () =>
      document.getElementById('pack-practice-exercise-results-card'),
    exerciseReset: () =>
      document.getElementById('pack-practice-exercise-reset-button'),
  }
}

function resetElements() {
  els = {}
}

function initState(exerciseType) {
  state = {
    ...DEFAULT_STATE,
    exerciseType,
  }
}

function resetState() {
  state = {}
}

/** Show/hide according to state flags */
function render() {
  if (state.loading) {
    // els.loadingContainer().style.display = 'flex'
    // els.errorContainer().style.display = 'none'
    // els.emptyContainer().style.display = 'none'
    els.learnContainer().style.display = 'none'
    els.exerciseContainer().style.display = 'none'

    return
  }
  if (state.error) {
    // els.loadingContainer().style.display = 'none'
    // els.errorContainer().style.display = 'flex'
    // els.emptyContainer().style.display = 'none'
    els.learnContainer().style.display = 'none'
    els.exerciseContainer().style.display = 'none'
    return
  }
  if (state.words.length === 0) {
    // els.loadingContainer().style.display = 'none'
    // els.errorContainer().style.display = 'none'
    // els.emptyContainer().style.display = 'flex'
    els.learnContainer().style.display = 'none'
    els.exerciseContainer().style.display = 'none'
    return
  }
  // els.loadingContainer().style.display = 'none'
  // els.errorContainer().style.display = 'none'
  // els.emptyContainer().style.display = 'none'
  els.learnContainer().style.display = 'block'
}

/** Update tab button states based on navigation service */
function updateTabStates(sessionState) {
  const activeClasses = ['active', 'w--current']
  const learnTabEl = els.learnTab()
  const exerciseTabEl = els.exerciseTab()

  learnTabEl.classList.remove(...activeClasses)
  exerciseTabEl.classList.remove(...activeClasses)

  if (sessionState.mode === NavigationMode.LEARN) {
    learnTabEl.classList.add(...activeClasses)

    els.learnContainer().style.display = 'block'
    els.exerciseContainer().style.display = 'none'

    // Show completed container if learn is completed
    if (sessionState.progression[sessionState.mode].isCompleted) {
      els.learnCompletedCard().style.display = 'flex'
      els.learnWordCard().style.display = 'none'
    } else {
      els.learnCompletedCard().style.display = 'none'
      els.learnWordCard().style.display = 'flex'
    }
  } else if (sessionState.mode === NavigationMode.EXERCISE) {
    exerciseTabEl.classList.add(...activeClasses)
    els.learnContainer().style.display = 'none'
    els.exerciseContainer().style.display = 'block'

    // Check if exercise streak settings are set
    if (sessionState.streakTarget === 0) {
      els.exerciseWordCard().style.display = 'none'
      els.exerciseStreakSettingsCard().style.display = 'flex'
    } else {
      els.exerciseStreakSettingsCard().style.display = 'none'
      // Show completed container if exercise is completed
      if (sessionState.progression[sessionState.mode].isCompleted) {
        els.exerciseResultsCard().style.display = 'flex'
        els.exerciseWordCard().style.display = 'none'
      } else {
        els.exerciseResultsCard().style.display = 'none'
        els.exerciseWordCard().style.display = 'flex'
      }
    }
  }
}

/** Update navigation button states */
function updateNavigationButtons(sessionState) {
  const { currentItem, progression } = sessionState

  // Learn buttons
  const isLearnCompleted = progression[NavigationMode.LEARN].isCompleted

  els.learnRepeat().disabled = isLearnCompleted
  els.learnNext().disabled = isLearnCompleted
  els.learnReset().style.display = isLearnCompleted ? 'block' : 'none'

  // Exercise buttons
  const isExerciseCompleted = progression[NavigationMode.EXERCISE].isCompleted
  // option buttons are dynamically generated via service to sub-component
  els.exerciseReset().style.display = isExerciseCompleted ? 'block' : 'none'
}

/** Enhance words with required properties */
function enhanceWordsWithProperties(words) {
  return words.map((word) => ({
    ...word,
    isKnown: false, // learn
    streak: 0, // exercise
    isCorrectlyAnswered: false, // exercise
  }))
}

/** Fetch words from API service */
async function fetchWords(packId, packLevel, packType, exerciseType) {
  try {
    state.loading = true
    state.error = null
    render()

    const { data: words, error } = await protectedApiService.getPackWords(
      packId,
      packLevel,
      packType,
      exerciseType
    )

    if (error) {
      state.error = error
      state.words = []
    } else {
      state.words = enhanceWordsWithProperties(words || [])
      state.error = null
      if (state.words.length > 0) initializeNavigationService()
    }
  } catch (err) {
    state.error = err.message || 'Failed to fetch words'
    state.words = []
  } finally {
    state.loading = false
    render()
  }
}

/** Initialize navigation service with callbacks */
function initializeNavigationService() {
  const SESSION_OPTIONS = {
    mode: NavigationMode.LEARN,
    exerciseType: state.exerciseType,
    streakTarget: state.streakTarget,
    onUpdate: (sessionState) => {
      updateTabStates(sessionState)
      updateNavigationButtons(sessionState)
    },
    onLearnUpdate: (learnProgressionState) => {
      if (learnProgressionState) {
        initLearn({ ...learnProgressionState })
      }
    },
    onExerciseUpdate: (exerciseProgressionState) => {
      if (exerciseProgressionState) {
        initExercise({ ...exerciseProgressionState }, (isCorrect) =>
          navigationService.exerciseAnswer(state.sessionId, isCorrect)
        )
      }
    },
    onStreakUpdate: (streakData) => {
      updateStreakProgression(streakData.word, streakData.streakTarget)
    },
    onExerciseResults: (resultsData) => {
      initExerciseResults(resultsData)
    },
  }

  navigationService.createSession(state.sessionId, state.words, SESSION_OPTIONS)
}

function resetNavigationService() {
  navigationService.destroySession(state.sessionId)
}

/** Handlers */
const onLearnTabClick = (e) => {
  // to disable Webflow orchestration
  e.preventDefault()
  e.stopPropagation()

  navigationService.switchMode(state.sessionId, NavigationMode.LEARN)
}
const onExerciseTabClick = (e) => {
  // to disable Webflow orchestration
  e.preventDefault()
  e.stopPropagation()

  navigationService.switchMode(state.sessionId, NavigationMode.EXERCISE)
}
const onLearnRepeat = () => navigationService.learnRepeat(state.sessionId)
const onLearnNext = () => navigationService.learnNext(state.sessionId)
const onLearnReset = () => navigationService.learnReset(state.sessionId)
const onExerciseReset = () => navigationService.exerciseReset(state.sessionId)

/** Initialize event listeners */
function initEventListeners() {
  els.learnTab().addEventListener('click', onLearnTabClick)
  els.exerciseTab().addEventListener('click', onExerciseTabClick)
  els.learnRepeat().addEventListener('click', onLearnRepeat)
  els.learnNext().addEventListener('click', onLearnNext)
  els.learnReset().addEventListener('click', onLearnReset)
  els.exerciseReset().addEventListener('click', onExerciseReset)
}

function handleStreakTargetChange(selectedTarget) {
  // Update both local state and navigation service
  state.streakTarget = selectedTarget
  navigationService.updateStreakTarget(state.sessionId, selectedTarget)
}

function resetEventListeners() {
  els.learnTab().removeEventListener('click', onLearnTabClick)
  els.exerciseTab().removeEventListener('click', onExerciseTabClick)
  els.learnRepeat().removeEventListener('click', onLearnRepeat)
  els.learnNext().removeEventListener('click', onLearnNext)
  els.learnReset().removeEventListener('click', onLearnReset)
  els.exerciseReset().removeEventListener('click', onExerciseReset)
}

/**
 * Mount: set up everything once and show container
 * Prevents double-init via state.mounted
 */
export async function mountPackPractice(packId, packLevel, exerciseType) {
  if (state && state.mounted) return

  // First Step: initialize state
  initState(exerciseType)

  state.mounted = true
  initStreakSettings(handleStreakTargetChange)

  initElements()
  initEventListeners()

  // Show root
  els.container().style.display = 'block'

  // Fetch words, initialize navigation service and render
  await fetchWords(packId, packLevel, PackType.MICRO_QUIZ, state.exerciseType)
}

/**
 * Unmount: teardown session & reset state, hide container
 */
export function unmountPackPractice() {
  if (!state || !state.mounted) return

  // Hide root
  els.container().style.display = 'none'

  resetEventListeners()
  resetElements()

  resetNavigationService()

  // Last Step: reset state
  resetState()
}
