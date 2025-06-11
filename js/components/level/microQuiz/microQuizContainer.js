// /components/microQuiz/microQuizContainer.js
import { initLearn } from './learn.js'
import { initExercise } from './exercise.js'
import { navigationService } from '../../../service/level/NavigationService.js'
import { publicApiService } from '../../../service/apiService.js'

let els = {}
let state = {
  loading: false,
  error: null,
  words: [],
  sessionId: 'microQuiz',   // Unique session identifier
  streakTarget: 3,          // Default streak target (1-5)
  mounted: false,           // New: has the component been initialized?
}

/** Initialize elements dynamically using provided IDs */
function initElements() {
  els = {
    container: () => document.getElementById("micro-quiz-container"),
    // loadingContainer: () => document.getElementById("tbd"),
    // errorContainer: () => document.getElementById("tbd"),
    // emptyContainer: () => document.getElementById("tbd"),
    learnTab: () => document.getElementById("micro-quiz-tab-learn"),
    exerciseTab: () => document.getElementById("micro-quiz-tab-exercise"),
    learnContainer: () => document.getElementById("micro-quiz-learn-container"),
    exerciseContainer: () => document.getElementById("micro-quiz-exercise-container"),
    learnRepeat: () => document.getElementById("micro-quiz-learn-repeat-button"),
    learnNext: () => document.getElementById("micro-quiz-learn-i-know-button"),
    learnCompletedContainer: () => document.getElementById("micro-quiz-learn-completed-container"),
    learnReset: () => document.getElementById("micro-quiz-learn-reset-button"),
    // exerciseCorrect: () => document.getElementById("tbd"),
    // exerciseWrong: () => document.getElementById("tbd"),
    // exerciseReset: () => document.getElementById("tbd"),
    // streakSelector: () => document.getElementById("tbd"),
  }
}

/** Show/hide according to state flags */
function render() {
  if (state.loading) {
    // els.loadingContainer().style.display = 'flex'
    // els.errorContainer().style.display = 'none'
    // els.emptyContainer().style.display = 'none'
    els.container().style.display = 'none'
    return
  }
  if (state.error) {
    // els.loadingContainer().style.display = 'none'
    // els.errorContainer().style.display = 'flex'
    // els.emptyContainer().style.display = 'none'
    els.container().style.display = 'none'
    return
  }
  if (state.words.length === 0) {
    // els.loadingContainer().style.display = 'none'
    // els.errorContainer().style.display = 'none'
    // els.emptyContainer().style.display = 'flex'
    els.container().style.display = 'none'
    return
  }
  // els.loadingContainer().style.display = 'none'
  // els.errorContainer().style.display = 'none'
  // els.emptyContainer().style.display = 'none'
  els.container().style.display = 'block'
}

/** Update tab button states based on navigation service */
function updateTabStates(navigationState) {
  const learnTabEl = els.learnTab()
  const exerciseTabEl = els.exerciseTab()
  if (navigationState.mode === 'learn') {
    learnTabEl.classList.add('active')
    exerciseTabEl.classList.remove('active')
    els.learnContainer().style.display = 'block'
    els.exerciseContainer().style.display = 'none'
  } else {
    learnTabEl.classList.remove('active')
    exerciseTabEl.classList.add('active')
    els.learnContainer().style.display = 'none'
    els.exerciseContainer().style.display = 'block'
  }
}

/** Update navigation button states */
function updateNavigationButtons(navigationState) {
  const { currentItem, activeListLength, isLearnCompleted, isExerciseCompleted } = navigationState

  // Learn buttons
  els.learnRepeat().disabled = !currentItem || activeListLength === 0
  els.learnNext().disabled   = !currentItem || activeListLength === 0
  els.learnReset().style.display = isLearnCompleted ? 'block' : 'none'

  // Exercise buttons
  // els.exerciseCorrect().disabled = !currentItem || activeListLength === 0
  // els.exerciseWrong().disabled   = !currentItem || activeListLength === 0
  // els.exerciseReset().style.display = isExerciseCompleted ? 'block' : 'none'
}

/** Enhance words with required properties */
function enhanceWordsWithProperties(words) {
  return words.map(word => ({
    ...word,
    isKnown: false,
    streak: 0,
    isCorrectlyAnswered: false,
  }))
}

/** Fetch words from API service */
async function fetchWords() {
  try {
    state.loading = true
    state.error = null
    render()

    const { data: words, error } = await publicApiService.getWords()

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
  navigationService.createSession(state.sessionId, state.words, {
    mode: 'learn',
    streakTarget: state.streakTarget,
    onUpdate: (nav) => {
      updateTabStates(nav)
      updateNavigationButtons(nav)
    },
    onLearnUpdate: (nav) => nav.currentItem && initLearn(nav.currentItem, nav.currentIndex, nav.totalItems),
    onExerciseUpdate: (nav) => nav.currentItem && initExercise(nav.currentItem, nav.currentIndex, nav.totalItems, nav.exerciseState.score),
  })
}

/** Handlers */
const onLearnTabClick = () => navigationService.switchMode(state.sessionId, 'learn')
const onExerciseTabClick = () => navigationService.switchMode(state.sessionId, 'exercise')
const onLearnRepeat    = () => navigationService.learnRepeat(state.sessionId)
const onLearnNext      = () => navigationService.learnNext(state.sessionId)
const onLearnReset     = () => navigationService.learnReset(state.sessionId)
const onExerciseCorrect= () => navigationService.exerciseCorrect(state.sessionId)
const onExerciseWrong  = () => navigationService.exerciseWrong(state.sessionId)
const onExerciseReset  = () => navigationService.exerciseReset(state.sessionId)
const onStreakChange   = (newTarget) => {
  state.streakTarget = newTarget
  navigationService.updateStreakTarget(state.sessionId, newTarget)
}

/** Initialize event listeners */
function initEventListeners() {
  els.learnTab().addEventListener('click', onLearnTabClick)
  els.exerciseTab().addEventListener('click', onExerciseTabClick)
  els.learnRepeat().addEventListener('click', onLearnRepeat)
  els.learnNext().addEventListener('click', onLearnNext)
  els.learnReset().addEventListener('click', onLearnReset)
  // els.exerciseCorrect().addEventListener('click', onExerciseCorrect)
  // els.exerciseWrong().addEventListener('click', onExerciseWrong)
  // els.exerciseReset().addEventListener('click', onExerciseReset)
  // const sel = els.streakSelector()
  // if (sel) sel.addEventListener('change', e => {
  //   const v = parseInt(e.target.value, 10)
  //   if (v >= 1 && v <= 5) onStreakChange(v)
  // })
}

/**
 * Mount: set up everything once and show container
 * Prevents double-init via state.mounted
 */
export async function mountMicroQuiz({streakTarget = 3}) {
  if (state.mounted) return
  state.mounted = true

  if (streakTarget >= 1 && streakTarget <= 5) {
    state.streakTarget = streakTarget
  }

  initElements()
  initEventListeners()
  render()
  await fetchWords()
}

/**
 * Unmount: teardown session & reset state, hide container
 */
export function unmountMicroQuiz() {
  if (!state.mounted) return
  navigationService.destroySession(state.sessionId)

  // Reset local state
  state.words = []
  state.loading = false
  state.error = null
  state.mounted = false

  // Clear element refs
  els = {}

  // Hide root
  const c = els.container()
  if (c) c.style.display = 'none'
}

/** For debugging or external inspection */
export function getCurrentState() {
  return navigationService.getCurrentState(state.sessionId)
}
