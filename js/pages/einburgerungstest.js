import QuestionManager from '../utils/einburgerungstest/QuestionManager.js'

import LocalStorageManager from '../utils/LocalStorageManager.js'

import ElementUtils from '../utils/ElementUtils.js'

import {
  CURRENT_STATE_KEY,
  LEARN__STATE__QUESTION_INDEX_KEY,
  SHOULD_SHOW_ANSWER_KEY,
  DEFAULT_VALUE,
  LEARN_QUESTION_USER_ANSWER_KEY,
} from '../constants/storageKeys.js'
import { testTabClickHandler } from '../components/einburgerungstest/testTab.js'

// On Initial Load
document.addEventListener('DOMContentLoaded', () => {
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

  // get previous question info
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
    event.preventDefault()
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
    console.log('showing learn answers...')
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
    console.log('hiding learn answers...')
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
const wrongAnswerEventListener = (event) => {
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
const correctAnswerEventListener = (event) => {
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

// TODO: On Test Tab Click
// document
//   .getElementById('test-tab')
//   .addEventListener('click', testTabClickHandler)

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
  document.getElementById('learn-question-index').innerText =
    currentQuestionIndex
  document.getElementById('learn-questions-length').innerText =
    totalNumberOfQuestions

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

      // answerElement.removeEventListener('click', wrongAnswerEventListener)
      // answerElement.removeEventListener('click', correctAnswerEventListener)

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
          // answerElement.removeEventListener('click', wrongAnswerEventListener)

          newAnswerElement.setAttribute('correct-input', true)
          newAnswerElement.addEventListener('click', correctAnswerEventListener)
        }
        // answer is incorrect
        else {
          newAnswerElement.removeAttribute('wrong-input')
          newAnswerElement.removeAttribute('correct-input')
          // answerElement.removeEventListener('click', correctAnswerEventListener)

          newAnswerElement.addEventListener('click', wrongAnswerEventListener)
        }
      }
      // user answered
      else {
        // answerElement.removeEventListener('click', wrongAnswerEventListener)
        // answerElement.removeEventListener('click', correctAnswerEventListener)
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

// jQuery for Dropdown

$('a').click(function () {
  $('nav').removeClass('w--open')
})
$('a').click(function () {
  $('div').removeClass('w--open')
})
