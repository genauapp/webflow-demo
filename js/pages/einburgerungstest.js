import QuestionManager from '../utils/einburgerungstest/QuestionManager.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'
import ElementUtils from '../utils/ElementUtils.js'

// Payment Integration - Two-Wall System
import paymentService from '../service/payment/PaymentService.js'
import paymentModal from '../components/payment/PaymentModal.js'
import { ProductType } from '../constants/payment.js'
import { PaymentElementIds, PaymentElementClasses, PaymentElementSelectors } from '../constants/paymentElements.js'
import eventService from '../service/events/EventService.js'
import { EinburgerungstestPaymentEvent } from '../constants/events.js'
import AuthService from '../service/AuthService.js'
import {
  showSigninModal,
  hideSigninModal,
  initSigninComponent,
} from '../components/layout/signin.js'
import { AuthEvent } from '../constants/events.js'

import {
  CURRENT_STATE_KEY,
  LEARN__STATE__QUESTION_INDEX_KEY,
  SHOULD_SHOW_ANSWER_KEY,
  DEFAULT_VALUE,
  LEARN_QUESTION_USER_ANSWER_KEY,
  // PAYMENT_TRIGGER_COUNTER_KEY,
} from '../constants/storageKeys.js'
import { testTabClickHandler } from '../components/einburgerungstest/testTab.js'

// On Initial Load - Enhanced with Two-Wall System
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Signin Component (modal and button) following level.js pattern
  initSigninComponent({
    signinModal: 'modal-signin-container',
    googleSigninButton: 'btn-modal-google-signin',
  })
  
  // Subscribe to AuthEvent.AUTH_STATE_CHANGED using eventService
  eventService.subscribe(AuthEvent.AUTH_STATE_CHANGED, (event) => {
    handleAuthStateChanged(event.detail)
  })
  
  // Trigger initial auth check
  AuthService.initialize()

  // Initialize existing einburgerungstest functionality
  initializeEinburgerungstestContent()
})

/**
 * Handle authentication state changes following level.js pattern
 * Implements WALL 1: Authentication
 */
function handleAuthStateChanged({ unauthorized, user }) {
  if (unauthorized || !user) {
    // WALL 1: Authentication - blocks entire page
    showSigninModal()
    hideAllPageContent()
    return
  } else {
    hideSigninModal()
    // User authenticated, now check payment status
    checkPaymentStatusAndShowContent()
  }
}

/**
 * Hide all page content when user is not authenticated
 */
function hideAllPageContent() {
  // Hide the entire page content during authentication wall
  const mainContent = document.querySelector('.main-content, #main-content, .page-content, .container')
  if (mainContent) {
    mainContent.style.display = 'none'
  }
  
  // Also hide specific content areas
  const learnContainer = document.getElementById('learn-question-container')
  const testTab = document.getElementById('test-tab')
  
  if (learnContainer) learnContainer.style.display = 'none'
  if (testTab) testTab.style.display = 'none'
}

/**
 * Check payment status and show appropriate content or payment wall
 * Implements WALL 2: Payment
 */
async function checkPaymentStatusAndShowContent() {
  try {
    // Initialize payment service if Stripe key is available
    const stripeKey = window.STRIPE_PUBLISHABLE_KEY || 
                     document.querySelector(PaymentElementSelectors.STRIPE_KEY_META)?.content
    
    if (stripeKey) {
      await paymentService.initialize(stripeKey)
      paymentModal.init()
    }
    
    // Check payment access
    const currency = detectUserCurrency()
    const accessResult = await paymentService.checkEinburgerungstestAccess(currency)
    
    if (accessResult.error) {
      console.error('[EinburgerungstestPage] Payment check failed:', accessResult.error)
      // Fallback to showing content on error (graceful degradation)
      showAllPageContent()
      return
    }
    
    if (!accessResult.hasAccess) {
      // WALL 2: Payment - blocks page content until payment
      showPaymentWall(accessResult.productInfo)
    } else {
      // User has access - show full page functionality
      showAllPageContent()
      console.log('[EinburgerungstestPage] Full access granted')
    }
    
  } catch (error) {
    console.error('[EinburgerungstestPage] Payment check failed:', error)
    
    // Fallback to showing content on error (graceful degradation)
    showAllPageContent()
  }
}

/**
 * Show payment wall that blocks entire page content
 */
function showPaymentWall(productInfo) {
  // Hide main page content
  hideAllPageContent()
  
  // Show payment modal as a wall (not dismissible by clicking outside)
  paymentModal.show(productInfo.currency || detectUserCurrency())
  
  console.log('[EinburgerungstestPage] Payment wall active')
}

/**
 * Show all page content after walls are passed
 */
function showAllPageContent() {
  // Show the main page content
  const mainContent = document.querySelector('.main-content, #main-content, .page-content, .container')
  if (mainContent) {
    mainContent.style.display = 'block'
  }
  
  // Show specific content areas
  const learnContainer = document.getElementById('learn-question-container')
  const testTab = document.getElementById('test-tab')
  
  if (learnContainer) learnContainer.style.display = 'block'
  if (testTab) testTab.style.display = 'block'
  
  // All components (testTab, learnTab, etc.) work normally now
  // No individual access checks needed
  console.log('[EinburgerungstestPage] All content accessible')
}

/**
 * Detect user's preferred currency
 * @returns {string} Currency code
 */
function detectUserCurrency() {
  const userLocale = navigator.language || navigator.userLanguage
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  if (userLocale.startsWith('tr') || timeZone.includes('Istanbul')) return 'TRY'
  if (userLocale.startsWith('en-US') || timeZone.includes('America')) return 'USD'
  return 'EUR'
}

/**
 * Initialize all existing einburgerungstest content
 * This encapsulates all the original functionality
 */
function initializeEinburgerungstestContent() {
  LocalStorageManager.clearDeprecatedLocalStorageItems()
  
  showLearnSkeleton()

  // set toggle to default one
  LocalStorageManager.save(
    SHOULD_SHOW_ANSWER_KEY,
    DEFAULT_VALUE.SHOULD_SHOW_ANSWER
  )
  // set user answer to default one
  LocalStorageManager.save(
    LEARN_QUESTION_USER_ANSWER_KEY,
    DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
  )
  // // set payment trigger storage item
  // LocalStorageManager.load(PAYMENT_TRIGGER_COUNTER_KEY, DEFAULT_VALUE.PAYMENT_TRIGGER_COUNTER)

  // set current state to default one
  // get recent local storage items
  LocalStorageManager.save(CURRENT_STATE_KEY, DEFAULT_VALUE.CURRENT_STATE)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    LEARN__STATE__QUESTION_INDEX_KEY(DEFAULT_VALUE.CURRENT_STATE),
    DEFAULT_VALUE.LEARN_QUESTION_INDEX
  )

  // get most recent question info
  const recentQuestion = QuestionManager.getCurrentLearnQuestion(
    DEFAULT_VALUE.CURRENT_STATE,
    currentLearnQuestionIndex
  )
  const totalNumberOfQuestions = QuestionManager.getTotalNumberOfLearnQuestions(
    DEFAULT_VALUE.CURRENT_STATE
  )

  // UI Changes
  hideLearnSkeleton()
  // // show initial previous/next buttons
  switchLearnPreviousNextButtons(
    currentLearnQuestionIndex,
    totalNumberOfQuestions
  )
  // // show initial question
  setLearnTabElements(
    currentLearnQuestionIndex,
    totalNumberOfQuestions,
    DEFAULT_VALUE.SHOULD_SHOW_ANSWER,
    recentQuestion,
    DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
  )
}

/**
 * Handle successful payment completion
 */
eventService.subscribe(EinburgerungstestPaymentEvent.PURCHASE_COMPLETED, async (event) => {
  const { purchaseId } = event.detail
  
  console.log('[EinburgerungstestPage] Purchase completed:', purchaseId)
  
  // Refresh access status and show content
  setTimeout(() => {
    window.location.reload()
  }, 2000)
})

// On Previous Click
document.getElementById('learn-previous').addEventListener('click', (event) => {
  // set user answer to default one
  LocalStorageManager.save(
    LEARN_QUESTION_USER_ANSWER_KEY,
    DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
  )

  // get recent local storage items
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentState = LocalStorageManager.load(CURRENT_STATE_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    LEARN__STATE__QUESTION_INDEX_KEY(currentState)
  )

  const previousIndex = currentLearnQuestionIndex - 1

  // get previous question info
  const previousQuestion = QuestionManager.getCurrentLearnQuestion(
    currentState,
    previousIndex
  )
  const totalNumberOfQuestions =
    QuestionManager.getTotalNumberOfLearnQuestions(currentState)

  LocalStorageManager.save(
    LEARN__STATE__QUESTION_INDEX_KEY(currentState),
    previousIndex
  )

  // UI Changes
  // // show new previous/next buttons
  switchLearnPreviousNextButtons(previousIndex, totalNumberOfQuestions)
  // // show previous question
  setLearnTabElements(
    previousIndex,
    totalNumberOfQuestions,
    shouldShowAnswer,
    previousQuestion,
    DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
  )
})

// On Next Click
document.getElementById('learn-next').addEventListener('click', (event) => {
  // set user answer to default one
  LocalStorageManager.save(
    LEARN_QUESTION_USER_ANSWER_KEY,
    DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
  )

  // get recent local storage items
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentState = LocalStorageManager.load(CURRENT_STATE_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    LEARN__STATE__QUESTION_INDEX_KEY(currentState)
  )

  const nextIndex = currentLearnQuestionIndex + 1

  // get next question info
  const nextQuestion = QuestionManager.getCurrentLearnQuestion(
    currentState,
    nextIndex
  )
  const totalNumberOfQuestions =
    QuestionManager.getTotalNumberOfLearnQuestions(currentState)

  LocalStorageManager.save(
    LEARN__STATE__QUESTION_INDEX_KEY(currentState),
    nextIndex
  )

  // UI Changes
  // // show new previous/next buttons
  switchLearnPreviousNextButtons(nextIndex, totalNumberOfQuestions)
  // // show next question
  setLearnTabElements(
    nextIndex,
    totalNumberOfQuestions,
    shouldShowAnswer,
    nextQuestion,
    DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
  )
})

// On State Change
document.querySelectorAll('.state-dropdown-link').forEach((stateLink) => {
  stateLink.addEventListener('click', function (event) {
    showLearnSkeleton()
    // event.preventDefault()
    // set updated local storage item
    const currentState = stateLink.getAttribute('data-option')
    LocalStorageManager.save(CURRENT_STATE_KEY, currentState)
    // set user answer to default one
    LocalStorageManager.save(
      LEARN_QUESTION_USER_ANSWER_KEY,
      DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
    )

    // get recent local storage items
    const shouldShowAnswer = LocalStorageManager.load(
      SHOULD_SHOW_ANSWER_KEY,
      DEFAULT_VALUE.SHOULD_SHOW_ANSWER
    )
    const currentLearnQuestionIndex = LocalStorageManager.load(
      LEARN__STATE__QUESTION_INDEX_KEY(currentState),
      DEFAULT_VALUE.LEARN_QUESTION_INDEX
    )
    // get updated question info
    const updatedQuestion = QuestionManager.getCurrentLearnQuestion(
      currentState,
      currentLearnQuestionIndex
    )
    const totalNumberOfQuestions =
      QuestionManager.getTotalNumberOfLearnQuestions(currentState)

    // update ui
    hideLearnSkeleton()
    // // show updated state header
    document.getElementById('dropdown-header').innerText = currentState
    // // show updated previous/next buttons
    switchLearnPreviousNextButtons(
      currentLearnQuestionIndex,
      totalNumberOfQuestions
    )
    // // show updated question
    setLearnTabElements(
      currentLearnQuestionIndex,
      totalNumberOfQuestions,
      shouldShowAnswer,
      updatedQuestion,
      DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
    )
  })
})

// On Toggle Change
// // button: OFF
document.getElementById('hide-answers-option').addEventListener('click', () => {
  // set user answer to default one
  LocalStorageManager.save(
    LEARN_QUESTION_USER_ANSWER_KEY,
    DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
  )

  // get recent local storage items
  const currentState = LocalStorageManager.load(CURRENT_STATE_KEY)
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    LEARN__STATE__QUESTION_INDEX_KEY(currentState)
  )

  // get current question
  const currentQuestion = QuestionManager.getCurrentLearnQuestion(
    currentState,
    currentLearnQuestionIndex
  )

  if (!shouldShowAnswer) {
    // console.log('showing learn answers...')
    LocalStorageManager.save(SHOULD_SHOW_ANSWER_KEY, true)
    switchLearnAnswers(
      true,
      DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER,
      currentQuestion.answers,
      currentQuestion.correct_answer
    )
  }

  return
})

// // button: ON
document.getElementById('show-answers-option').addEventListener('click', () => {
  // get recent local storage items
  const currentState = LocalStorageManager.load(CURRENT_STATE_KEY)
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    LEARN__STATE__QUESTION_INDEX_KEY(currentState)
  )
  const learnQuestionUserAnswer = LocalStorageManager.load(
    LEARN_QUESTION_USER_ANSWER_KEY
  )

  // get current question
  const currentQuestion = QuestionManager.getCurrentLearnQuestion(
    currentState,
    currentLearnQuestionIndex
  )

  if (shouldShowAnswer) {
    // console.log('hiding learn answers...')
    LocalStorageManager.save(SHOULD_SHOW_ANSWER_KEY, false)
    switchLearnAnswers(
      false,
      learnQuestionUserAnswer,
      currentQuestion.answers,
      currentQuestion.correct_answer
    )
  }

  return
})

// On Learn Tab's User Answer
// // on wrong answer
const wrongAnswerClickHandler = (event) => {
  const userAnswer = {
    answered: true,
    wasCorrect: false,
  }
  LocalStorageManager.save(LEARN_QUESTION_USER_ANSWER_KEY, userAnswer)

  // get recent local storage items
  const currentState = LocalStorageManager.load(CURRENT_STATE_KEY)
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    LEARN__STATE__QUESTION_INDEX_KEY(currentState)
  )

  // get current question
  const currentQuestion = QuestionManager.getCurrentLearnQuestion(
    currentState,
    currentLearnQuestionIndex
  )

  event.target.setAttribute('wrong-input', true)

  switchLearnAnswers(
    shouldShowAnswer,
    userAnswer,
    currentQuestion.answers,
    currentQuestion.correct_answer
  )
}

// // on correct answer
const correctAnswerClickHandler = (event) => {
  const userAnswer = {
    answered: true,
    wasCorrect: true,
  }
  LocalStorageManager.save(LEARN_QUESTION_USER_ANSWER_KEY, userAnswer)

  // get recent local storage items
  const currentState = LocalStorageManager.load(CURRENT_STATE_KEY)
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    LEARN__STATE__QUESTION_INDEX_KEY(currentState)
  )

  // get current question
  const currentQuestion = QuestionManager.getCurrentLearnQuestion(
    currentState,
    currentLearnQuestionIndex
  )

  switchLearnAnswers(
    shouldShowAnswer,
    userAnswer,
    currentQuestion.answers,
    currentQuestion.correct_answer
  )
}

// On Test Tab Click
document
  .getElementById('test-tab')
  .addEventListener('click', testTabClickHandler)

/** UI Changes
 * They are only responsible for displaying whatever they receive as parameter
 * NO ACCESS to Local Storage or Question managers
 * */

const setLearnTabElements = (
  currentQuestionIndex,
  totalNumberOfQuestions,
  shouldShowAnswer,
  currentQuestion,
  userAnswer
) => {
  document.getElementById('learn-question-state-label').innerText =
    currentQuestion.state
  document.getElementById('learn-question-index').innerText =
    currentQuestionIndex
  document.getElementById('learn-questions-length').innerText =
    totalNumberOfQuestions

  ElementUtils.showImageIfExists(
    'learn-question-image',
    'learn-question-image-container',
    currentQuestion
  )

  document.getElementById(
    'learn-current-question-index-label'
  ).innerText = `Aufgabe ${currentQuestionIndex}`
  document.getElementById(
    'learn-current-question-description-label'
  ).innerText = currentQuestion.question

  switchLearnAnswers(
    shouldShowAnswer,
    userAnswer,
    currentQuestion.answers,
    currentQuestion.correct_answer
  )
}

const switchLearnAnswers = (
  shouldShowAnswer,
  userAnswer,
  answers,
  correctAnswer
) => {
  answers.forEach((answer, i) => {
    const answerElement = document.getElementById(
      `learn-current-question-answer-${i + 1}`
    )

    const newAnswerElement = answerElement.cloneNode(true)
    answerElement.parentNode.replaceChild(newAnswerElement, answerElement)
    newAnswerElement.innerText = answer

    // answers toggled ON
    if (shouldShowAnswer) {
      // // clear toggle OFF event listeners and attributes
      newAnswerElement.removeAttribute('wrong-input')
      newAnswerElement.removeAttribute('correct-input')

      // answerElement.removeEventListener('click', wrongAnswerClickHandler)
      // answerElement.removeEventListener('click', correctAnswerClickHandler)

      newAnswerElement.classList.remove('wrong')
      // newAnswerElement.style.backgroundColor = '#fff0'
      // answer is correct
      if (answer === correctAnswer) {
        newAnswerElement.classList.remove('inactive')
        newAnswerElement.classList.add('active')
      }
      // answer is incorrect
      else {
        newAnswerElement.classList.remove('active')
        newAnswerElement.classList.add('inactive')
      }
    }
    // answers toggled OFF
    else {
      // user did not answer
      if (userAnswer.answered === false) {
        newAnswerElement.classList.remove('active')
        newAnswerElement.classList.remove('wrong')
        newAnswerElement.classList.add('inactive')
        // answer is correct
        if (answer === correctAnswer) {
          newAnswerElement.removeAttribute('wrong-input')
          // answerElement.removeEventListener('click', wrongAnswerClickHandler)

          newAnswerElement.setAttribute('correct-input', true)
          newAnswerElement.addEventListener('click', correctAnswerClickHandler)
        }
        // answer is incorrect
        else {
          newAnswerElement.removeAttribute('wrong-input')
          newAnswerElement.removeAttribute('correct-input')
          // answerElement.removeEventListener('click', correctAnswerClickHandler)

          newAnswerElement.addEventListener('click', wrongAnswerClickHandler)
        }
      }
      // user answered
      else {
        // answerElement.removeEventListener('click', wrongAnswerClickHandler)
        // answerElement.removeEventListener('click', correctAnswerClickHandler)
        // answered correctly
        if (userAnswer.wasCorrect) {
          // element is the correct answer
          if (newAnswerElement.getAttribute('correct-input') == 'true') {
            newAnswerElement.classList.remove('inactive')
            newAnswerElement.classList.remove('wrong')
            newAnswerElement.classList.add('active')
          }
          // element is not the correct answer
          else {
            newAnswerElement.classList.remove('active')
            newAnswerElement.classList.remove('wrong')
            newAnswerElement.classList.add('inactive')
          }
        }
        // answered incorrectly
        else {
          // incorrect user input
          if (newAnswerElement.getAttribute('wrong-input') === 'true') {
            newAnswerElement.classList.remove('inactive')
            newAnswerElement.classList.add('active')
            newAnswerElement.classList.add('wrong')
            // newAnswerElement.style.backgroundColor = '#a560602b'
          }
          // correct user input
          else if (newAnswerElement.getAttribute('correct-input') === 'true') {
            newAnswerElement.classList.remove('inactive')
            newAnswerElement.classList.remove('wrong')
            newAnswerElement.classList.add('active')
          }
          // other answers
          else {
            newAnswerElement.classList.remove('active')
            newAnswerElement.classList.remove('wrong')
            newAnswerElement.classList.add('inactive')
            // newAnswerElement.style.backgroundColor = '#fff0'
          }
        }
      }
    }
  })
}

const switchLearnPreviousNextButtons = (
  potentialQuestionIndex,
  totalNumberOfQuestions
) => {
  const previousButton = document.getElementById('learn-previous')
  const nextButton = document.getElementById('learn-next')
  ElementUtils.switchPreviousNextButtons(
    potentialQuestionIndex,
    totalNumberOfQuestions,
    { prevButton: previousButton, nextButton: nextButton }
  )
}

const showLearnSkeleton = () => {
  ElementUtils.showSkeleton('skeleton-container', 'learn-question-container')
}

const hideLearnSkeleton = () => {
  ElementUtils.hideSkeleton('skeleton-container', 'learn-question-container')
}

// jQuery for Dropdown

$('a').click(function () {
  $('nav').removeClass('w--open')
})
$('a').click(function () {
  $('div').removeClass('w--open')
})
