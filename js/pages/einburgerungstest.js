import QuestionManager from '../utils/einburgerungstest/QuestionManager.js'

import LocalStorageManager from '../utils/LocalStorageManager.js'

import {
  LEARN__STATE__QUESTION_INDEX_KEY,
  LEARN_STATE_KEY,
  SHOULD_SHOW_ANSWER_KEY,
  DEFAULT_VALUE,
  LEARN_QUESTION_USER_ANSWER_KEY,
} from '../constants/storageKeys.js'

// On Initial Load
document.addEventListener('DOMContentLoaded', () => {
  // set toggle to default one
  LocalStorageManager.save(
    SHOULD_SHOW_ANSWER_KEY,
    DEFAULT_VALUE.SHOULD_SHOW_ANSWER
  )

  // get recent local storage items
  const currentState = LocalStorageManager.load(
    LEARN_STATE_KEY,
    DEFAULT_VALUE.LEARN_STATE
  )
  const currentLearnQuestionIndex = LocalStorageManager.load(
    new LEARN__STATE__QUESTION_INDEX_KEY(currentState),
    DEFAULT_VALUE.LEARN_QUESTION_INDEX
  )
  const learnQuestionUserAnswer = LocalStorageManager.load(
    LEARN_QUESTION_USER_ANSWER_KEY,
    DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
  )

  // get most recent question info
  const recentQuestion = QuestionManager.getCurrentLearnQuestion(
    currentState,
    currentLearnQuestionIndex
  )
  const totalNumberOfQuestions =
    QuestionManager.getTotalNumberOfLearnQuestions(currentState)

  setLearnTabElements(
    currentLearnQuestionIndex,
    totalNumberOfQuestions,
    DEFAULT_VALUE.SHOULD_SHOW_ANSWER,
    recentQuestion,
    learnQuestionUserAnswer
  )
})

// On State Change
document.querySelectorAll('.state-dropdown-link').forEach((stateLink) => {
  stateLink.addEventListener('click', function (event) {
    event.preventDefault()
    // set updated local storage item
    const currentState = stateLink.getAttribute('data-option')
    LocalStorageManager.save(LEARN_STATE_KEY, currentState)
    // get recent local storage items
    const shouldShowAnswer = LocalStorageManager.load(
      SHOULD_SHOW_ANSWER_KEY,
      DEFAULT_VALUE.SHOULD_SHOW_ANSWER
    )
    const currentLearnQuestionIndex = LocalStorageManager.load(
      new LEARN__STATE__QUESTION_INDEX_KEY(currentState),
      DEFAULT_VALUE.LEARN_QUESTION_INDEX
    )
    const learnQuestionUserAnswer = LocalStorageManager.load(
      LEARN_QUESTION_USER_ANSWER_KEY,
      DEFAULT_VALUE.LEARN_QUESTION_USER_ANSWER
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
    // // show updated question
    setLearnTabElements(
      currentLearnQuestionIndex,
      totalNumberOfQuestions,
      shouldShowAnswer,
      updatedQuestion,
      learnQuestionUserAnswer
    )
  })
})

// On Toggle Change
// // button: OFF
document.getElementById('hide-answers-option').addEventListener('click', () => {
  // get recent local storage items
  const currentState = LocalStorageManager.load(LEARN_STATE_KEY)
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    new LEARN__STATE__QUESTION_INDEX_KEY(currentState)
  )
  const learnQuestionUserAnswer = LocalStorageManager.load(
    LEARN_QUESTION_USER_ANSWER_KEY
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
      learnQuestionUserAnswer,
      currentQuestion.answers,
      currentQuestion.correct_answer
    )
  }

  return
})

// // button: ON
document.getElementById('show-answers-option').addEventListener('click', () => {
  // get recent local storage items
  const currentState = LocalStorageManager.load(LEARN_STATE_KEY)
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    new LEARN__STATE__QUESTION_INDEX_KEY(currentState)
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
const wrongAnswerEventListener = (event) => {
  event.target.removeAttribute('correct-input')
  event.target.setAttribute('wrong-input', true)

  const userAnswer = {
    answered: true,
    wasCorrect: false,
  }
  LocalStorageManager.save(LEARN_QUESTION_USER_ANSWER_KEY, userAnswer)

  // get recent local storage items
  const currentState = LocalStorageManager.load(LEARN_STATE_KEY)
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    new LEARN__STATE__QUESTION_INDEX_KEY(currentState)
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

const correctAnswerEventListener = (event) => {
  event.target.removeAttribute('wrong-input')
  event.target.setAttribute('correct-input', true)

  const userAnswer = {
    answered: true,
    wasCorrect: true,
  }
  LocalStorageManager.save(LEARN_QUESTION_USER_ANSWER_KEY, userAnswer)

  // get recent local storage items
  const currentState = LocalStorageManager.load(LEARN_STATE_KEY)
  const shouldShowAnswer = LocalStorageManager.load(SHOULD_SHOW_ANSWER_KEY)
  const currentLearnQuestionIndex = LocalStorageManager.load(
    new LEARN__STATE__QUESTION_INDEX_KEY(currentState)
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

/** UI Changes
 * They are only responsible for displaying whatever they receive as parameter
 * NO ACCESS to Local Storage or Question managers
 * */

const setLearnTabElements = (
  currentQuestionIndex,
  totalNumberOfQuestions,
  shouldShowAnswer,
  currentQuestion,
  learnQuestionUserAnswer
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
    learnQuestionUserAnswer,
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
    answerElement.innerText = answer

    // answers toggled ON
    if (shouldShowAnswer) {
      answerElement.removeEventListener('click')

      answerElement.classList.remove('wrong')
      // answer is correct
      if (answer === correctAnswer) {
        answerElement.classList.remove('inactive')
        answerElement.classList.add('active')
      }
      // answer is incorrect
      else {
        answerElement.classList.remove('active')
        answerElement.classList.add('inactive')
      }
    }
    // answers toggled OFF
    else {
      // user is not answered
      if (userAnswer.answered === false) {
        answerElement.classList.remove('active')
        answerElement.classList.remove('wrong')
        answerElement.classList.add('inactive')
        answerElement.removeEventListener('click')
        // answer is correct
        if (answer === correctAnswer) {
          answerElement.addEventListener('click', correctAnswerEventListener)
        }
        // answer is incorrect
        else {
          answerElement.addEventListener('click', wrongAnswerEventListener)
        }
      }
      // user is answered
      else {
        // answered correctly
        answerElement.removeEventListener('click')
        if (userAnswer.wasCorrect) {
          answerElement.classList.remove('inactive')
          answerElement.classList.remove('wrong')
          answerElement.classList.add('active')
        }
        // answered incorrectly
        else {
          // incorrect user input
          if (answerElement.getAttribute('wrong-input') === true) {
            answerElement.classList.remove('inactive')
            answerElement.classList.remove('active')
            answerElement.classList.add('wrong')
          }
          // correct user input
          else if (answerElement.getAttribute('correct-input') === true) {
            answerElement.classList.remove('inactive')
            answerElement.classList.remove('wrong')
            answerElement.classList.add('active')
          }
          // other answers
          else {
            answerElement.classList.remove('active')
            answerElement.classList.remove('wrong')
            answerElement.classList.add('inactive')
          }
        }
      }
    }
  })
}
