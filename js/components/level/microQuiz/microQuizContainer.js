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
  streakTarget: 3, // Default streak target (1-5)
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
    
    // Learn navigation elements
    learnRepeat: () => document.getElementById(elementIds.learnRepeat),
    learnNext: () => document.getElementById(elementIds.learnNext), // "I Know" button
    learnReset: () => document.getElementById(elementIds.learnReset),
    
    // Exercise navigation elements
    exerciseCorrect: () => document.getElementById(elementIds.exerciseCorrect), // "True" button
    exerciseWrong: () => document.getElementById(elementIds.exerciseWrong), // "False" button
    exerciseReset: () => document.getElementById(elementIds.exerciseReset),
    
    // Optional streak configuration
    streakSelector: () => document.getElementById(elementIds.streakSelector),
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
  const learnRepeatBtn = els.learnRepeat()
  const learnNextBtn = els.learnNext() // "I Know" button
  const learnResetBtn = els.learnReset()
  
  if (learnRepeatBtn) {
    // Disable repeat if no current item
    learnRepeatBtn.disabled = !navigationState.currentItem || navigationState.activeListLength === 0
  }
  if (learnNextBtn) {
    // Disable "I Know" if no current item  
    learnNextBtn.disabled = !navigationState.currentItem || navigationState.activeListLength === 0
  }
  if (learnResetBtn) {
    // Show reset button only when all words are known
    learnResetBtn.style.display = navigationState.isLearnCompleted ? 'block' : 'none'
  }
  
  // Exercise navigation buttons
  const exerciseCorrectBtn = els.exerciseCorrect() // "True" button
  const exerciseWrongBtn = els.exerciseWrong() // "False" button
  const exerciseResetBtn = els.exerciseReset()
  
  if (exerciseCorrectBtn) {
    exerciseCorrectBtn.disabled = !navigationState.currentItem || navigationState.activeListLength === 0
  }
  if (exerciseWrongBtn) {
    exerciseWrongBtn.disabled = !navigationState.currentItem || navigationState.activeListLength === 0
  }
  if (exerciseResetBtn) {
    // Show reset button only when all exercises are completed
    exerciseResetBtn.style.display = navigationState.isExerciseCompleted ? 'block' : 'none'
  }
}

/** Enhance words with required properties */
function enhanceWordsWithProperties(words) {
  return words.map(word => ({
    ...word,
    // Learn list properties
    isKnown: false,
    // Exercise list properties  
    streak: 0,
    isCorrectlyAnswered: false
  }))
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
      // Enhance words with required properties
      state.words = enhanceWordsWithProperties(words || [])
      state.error = null
      
      // Initialize navigation service with the enhanced words
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
    streakTarget: state.streakTarget,
    onUpdate: (navigationState) => {
      // Called whenever navigation state changes
      updateTabStates(navigationState)
      updateNavigationButtons(navigationState)
    },
    onLearnUpdate: (navigationState) => {
      // Update learn component
      if (navigationState.currentItem) {
        initLearn(navigationState.currentItem, navigationState.currentIndex, navigationState.totalItems)
      }
    },
    onExerciseUpdate: (navigationState) => {
      // Update exercise component  
      if (navigationState.currentItem) {
        initExercise(navigationState.currentItem, navigationState.currentIndex, navigationState.totalItems, navigationState.exerciseState.score)
      }
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

/** Learn navigation handlers */
function onLearnRepeat() {
  navigationService.learnRepeat(state.sessionId)
}

function onLearnNext() {
  navigationService.learnNext(state.sessionId)
}

function onLearnReset() {
  navigationService.learnReset(state.sessionId)
}

/** Exercise navigation handlers */
function onExerciseCorrect() {
  navigationService.exerciseCorrect(state.sessionId)
}

function onExerciseWrong() {
  navigationService.exerciseWrong(state.sessionId) 
}

function onExerciseReset() {
  navigationService.exerciseReset(state.sessionId)
}

/** Streak target configuration handler */
function onStreakChange(newStreakTarget) {
  state.streakTarget = newStreakTarget
  navigationService.updateStreakTarget(state.sessionId, newStreakTarget)
}

/** Initialize event listeners */
function initEventListeners() {
  // Tab switching
  els.learnTab().addEventListener('click', onLearnTabClick)
  els.exerciseTab().addEventListener('click', onExerciseTabClick)
  
  // Learn navigation
  els.learnRepeat().addEventListener('click', onLearnRepeat)
  els.learnNext().addEventListener('click', onLearnNext) // "I Know" button
  els.learnReset().addEventListener('click', onLearnReset)
  
  // Exercise navigation  
  els.exerciseCorrect().addEventListener('click', onExerciseCorrect) // "True" button
  els.exerciseWrong().addEventListener('click', onExerciseWrong) // "False" button
  els.exerciseReset().addEventListener('click', onExerciseReset)
  
  // Optional streak configuration
  const streakSelector = els.streakSelector()
  if (streakSelector) {
    streakSelector.addEventListener('change', (e) => {
      const newTarget = parseInt(e.target.value, 10)
      if (newTarget >= 1 && newTarget <= 5) {
        onStreakChange(newTarget)
      }
    })
  }
}

/** Initialize the micro quiz container */
export async function initMicroQuizContainer(elementIds, elementClasses, config = {}) {
  // Set streak target from config if provided
  if (config.streakTarget && config.streakTarget >= 1 && config.streakTarget <= 5) {
    state.streakTarget = config.streakTarget
  }

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

/** Get current navigation state (useful for debugging or external access) */
export function getCurrentState() {
  return navigationService.getCurrentState(state.sessionId)
}