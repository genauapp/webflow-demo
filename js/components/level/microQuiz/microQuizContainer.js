// /components/microQuiz/microQuizContainer.js
import { initLearn } from './learn.js'
import { initExercise } from './exercise.js'
import { navigationService } from '../../service/navigationService.js'
import { protectedApiService } from '../../service/apiService.js' // Assuming you have this service

let els = {}
let state = {
  loading: false,
  error: null,
  words: [],
  sessionId: 'microQuiz', // Unique session identifier
}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds, elementClasses) {
  els = {
    // Container elements
    container: () => document.getElementById(elementIds.container),
    loadingContainer: () => document.getElementById(elementIds.loadingContainer),
    errorContainer: () => document.getElementById(elementIds.errorContainer),
    emptyContainer: () => document.getElementById(elementIds.emptyContainer),
    
    // Tab elements
    learnTab: () => document.getElementById(elementIds.learnTab),
    exerciseTab: () => document.getElementById(elementIds.exerciseTab),
    learnContainer: () => document.getElementById(elementIds.learnContainer),
    exerciseContainer: () => document.getElementById(elementIds.exerciseContainer),
    
    // Navigation elements
    learnPrevious: () => document.getElementById(elementIds.learnPrevious),
    learnNext: () => document.getElementById(elementIds.learnNext),
    learnReset: () => document.getElementById(elementIds.learnReset),
    learnShuffle: () => document.getElementById(elementIds.learnShuffle),
    
    exercisePrevious: () => document.getElementById(elementIds.exercisePrevious),
    exerciseNext: () => document.getElementById(elementIds.exerciseNext),
    exerciseCorrect: () => document.getElementById(elementIds.exerciseCorrect),
    exerciseWrong: () => document.getElementById(elementIds.exerciseWrong),
  }
}

/** Show/hide according to state flags */
function render() {
  // loading state
  if (state.loading) {
    els.loadingContainer().style.display = 'flex'
    els.errorContainer().style.display = 'none'
    els.emptyContainer().style.display = 'none'
    els.container().style.display = 'none'
    return
  }

  // error state
  if (state.error) {
    els.loadingContainer().style.display = 'none'
    els.errorContainer().style.display = 'flex'
    els.emptyContainer().style.display = 'none'
    els.container().style.display = 'none'
    return
  }

  // empty state
  if (state.words.length === 0) {
    els.loadingContainer().style.display = 'none'
    els.errorContainer().style.display = 'none'
    els.emptyContainer().style.display = 'flex'
    els.container().style.display = 'none'
    return
  }

  // success state with data
  els.loadingContainer().style.display = 'none'
  els.errorContainer().style.display = 'none'
  els.emptyContainer().style.display = 'none'
  els.container().style.display = 'flex'
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
  // Learn navigation buttons
  const learnPrevBtn = els.learnPrevious()
  const learnNextBtn = els.learnNext()
  
  if (learnPrevBtn) {
    learnPrevBtn.disabled = !navigationState.canGoPrevious
  }
  if (learnNextBtn) {
    learnNextBtn.disabled = !navigationState.canGoNext
  }
  
  // Exercise navigation buttons
  const exercisePrevBtn = els.exercisePrevious()
  const exerciseNextBtn = els.exerciseNext()
  
  if (exercisePrevBtn) {
    exercisePrevBtn.disabled = !navigationState.canGoPrevious
  }
  if (exerciseNextBtn) {
    exerciseNextBtn.disabled = !navigationState.canGoNext
  }
}

/** Fetch words from API service */
async function fetchWords() {
  try {
    state.loading = true
    state.error = null
    render()

    // Assuming your API service has a method to get words
    const { data: words, error } = await protectedApiService.getWords()
    
    if (error) {
      state.error = error
      state.words = []
    } else {
      state.words = words || []
      state.error = null
      
      // Initialize navigation service with the words
      if (state.words.length > 0) {
        initializeNavigationService()
      }
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
    mode: 'learn', // Start with learn mode
    onUpdate: (navigationState) => {
      // Called whenever navigation state changes
      updateTabStates(navigationState)
      updateNavigationButtons(navigationState)
    },
    onLearnUpdate: (navigationState) => {
      // Update learn component
      initLearn(state.words, navigationState.currentIndex)
    },
    onExerciseUpdate: (navigationState) => {
      // Update exercise component
      initExercise(state.words, navigationState.currentIndex)
    }
  })
}

/** Tab switching handlers */
function onLearnTabClick() {
  navigationService.switchMode(state.sessionId, 'learn')
}

function onExerciseTabClick() {
  navigationService.switchMode(state.sessionId, 'exercise')
}

/** Learn navigation handlers - now just delegate to navigation service */
function onLearnPrevious() {
  navigationService.learnPrevious(state.sessionId)
}

function onLearnNext() {
  navigationService.learnNext(state.sessionId)
}

function onLearnReset() {
  navigationService.learnReset(state.sessionId)
}

function onLearnShuffle() {
  navigationService.learnShuffle(state.sessionId)
}

/** Exercise navigation handlers - now just delegate to navigation service */
function onExercisePrevious() {
  navigationService.exercisePrevious(state.sessionId)
}

function onExerciseNext() {
  navigationService.exerciseNext(state.sessionId)
}

function onExerciseCorrect() {
  navigationService.exerciseCorrect(state.sessionId, true) // auto-advance enabled
}

function onExerciseWrong() {
  navigationService.exerciseWrong(state.sessionId, true) // auto-advance enabled
}

/** Initialize event listeners */
function initEventListeners() {
  // Tab switching
  els.learnTab().addEventListener('click', onLearnTabClick)
  els.exerciseTab().addEventListener('click', onExerciseTabClick)
  
  // Learn navigation - all logic now handled by navigation service
  els.learnPrevious().addEventListener('click', onLearnPrevious)
  els.learnNext().addEventListener('click', onLearnNext)
  els.learnReset().addEventListener('click', onLearnReset)
  els.learnShuffle().addEventListener('click', onLearnShuffle)
  
  // Exercise navigation - all logic now handled by navigation service
  els.exercisePrevious().addEventListener('click', onExercisePrevious)
  els.exerciseNext().addEventListener('click', onExerciseNext)
  els.exerciseCorrect().addEventListener('click', onExerciseCorrect)
  els.exerciseWrong().addEventListener('click', onExerciseWrong)
}

/** Initialize the micro quiz container */
export async function initMicroQuizContainer(elementIds, elementClasses) {
  // Initialize elements with provided IDs
  initElements(elementIds, elementClasses)
  
  // Initialize event listeners
  initEventListeners()
  
  // Set initial render state
  render()
  
  // Fetch words and initialize navigation service
  await fetchWords()
}

/** Cleanup function to destroy navigation session */
export function destroyMicroQuizContainer() {
  navigationService.destroySession(state.sessionId)
}