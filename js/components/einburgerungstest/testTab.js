import LocalStorageManager from '../../utils/LocalStorageManager.js'
import QuestionManager from '../../utils/einburgerungstest/QuestionManager.js'
import DateUtils from '../../utils/DateUtils.js'
import ElementUtils from '../../utils/ElementUtils.js'
import TestManager from '../../utils/einburgerungstest/TestManager.js'

import {
  CURRENT_STATE_KEY,
  DEFAULT_VALUE,
  TEST_PROGRESSION_KEY,
} from '../../constants/storageKeys.js'

// On Initial Load
document.addEventListener('DOMContentLoaded', () => {
  // remove test progression
  LocalStorageManager.remove(TEST_PROGRESSION_KEY)
})

// On Tab Click
export const testTabClickHandler = (event) => {
  // do nothing if test tab is selected
  if (event.currentTarget.ariaSelected === 'true') {
    event.preventDefault()
    return
  }

  document
    .getElementById('learn-tab')
    .addEventListener('click', loseProgressionClickHandler, true)
  document.querySelectorAll('.state-dropdown-link').forEach((stateLink) => {
    stateLink.addEventListener('click', loseProgressionClickHandler, true) // true means capturing
  })

  // get recent local storage items
  const currentState = LocalStorageManager.load(
    CURRENT_STATE_KEY,
    DEFAULT_VALUE.CURRENT_STATE
  )

  // load questions
  const testQuestions = QuestionManager.getTestQuestionsByState(currentState)

  const initialTestProgression = DEFAULT_VALUE.TEST_PROGRESSION(
    crypto.randomUUID(),
    currentState,
    testQuestions,
    DateUtils.getCurrentDateTime()
  )

  // set test progression to default one
  LocalStorageManager.save(TEST_PROGRESSION_KEY, initialTestProgression)

  // get first question info
  const firstQuestion = QuestionManager.getCurrentTestQuestion(
    initialTestProgression.currentIndex,
    initialTestProgression.questions
  )

  // UI Changes
  // // show initial previous/next buttons
  switchTestPreviousNextButtons(
    initialTestProgression.currentIndex,
    initialTestProgression.questions.length
  )
  // // show initial question
  setTestTabElements(
    initialTestProgression.currentIndex,
    initialTestProgression.questions.length,
    firstQuestion
  )

  //   testTabElement.removeEventListener('click', testTabClickHandler)
}

// On Previous Click
document.getElementById('test-previous').addEventListener('click', (event) => {
  const testProgression = LocalStorageManager.load(TEST_PROGRESSION_KEY)

  const updatedTestProgression = {
    ...testProgression,
    currentIndex: testProgression.currentIndex - 1,
  }

  LocalStorageManager.save(TEST_PROGRESSION_KEY, updatedTestProgression)

  // get previous question info
  const previousQuestion = QuestionManager.getCurrentTestQuestion(
    updatedTestProgression.currentIndex,
    updatedTestProgression.questions
  )

  // UI Changes
  // // show new previous/next buttons
  switchTestPreviousNextButtons(
    updatedTestProgression.currentIndex,
    updatedTestProgression.questions.length
  )
  // // show previous question
  setTestTabElements(
    updatedTestProgression.currentIndex,
    updatedTestProgression.questions.length,
    previousQuestion
  )
})

// On Next Click
document.getElementById('test-next').addEventListener('click', (event) => {
  const testProgression = LocalStorageManager.load(TEST_PROGRESSION_KEY)

  const updatedTestProgression = {
    ...testProgression,
    currentIndex: testProgression.currentIndex + 1,
  }

  LocalStorageManager.save(TEST_PROGRESSION_KEY, updatedTestProgression)

  // get next question info
  const nextQuestion = QuestionManager.getCurrentTestQuestion(
    updatedTestProgression.currentIndex,
    updatedTestProgression.questions
  )

  // UI Changes
  // // show new previous/next buttons
  switchTestPreviousNextButtons(
    updatedTestProgression.currentIndex,
    updatedTestProgression.questions.length
  )
  // // show next question
  setTestTabElements(
    updatedTestProgression.currentIndex,
    updatedTestProgression.questions.length,
    nextQuestion
  )
})

// // Tell that they are going to lose progression
const loseProgressionClickHandler = (event) => {
  // console.log(
  //   `lose progression is triggered via click of: ${event.currentTarget}`
  // )

  const userConfirmed = window.confirm(
    'Are you sure you want to leave? Your progress will be lost.'
  )

  if (!userConfirmed) {
    event.preventDefault() // Prevents the action if user cancels
    event.stopPropagation()
    return false
  }

  // else
  // // remove test progression
  LocalStorageManager.remove(TEST_PROGRESSION_KEY)

  // // hide test results modal if any
  hideTestResultsModal()

  // // remove event listeners from state and learn tabs for losing progression
  const learnTabElement = document.getElementById('learn-tab')
  learnTabElement.removeEventListener(
    'click',
    loseProgressionClickHandler,
    true
  )
  document.querySelectorAll('.state-dropdown-link').forEach((stateLink) => {
    stateLink.removeEventListener('click', loseProgressionClickHandler, true)
  })
  // // click on learn tab imperatively
  learnTabElement.click()
}

// On Test Tab's User Answer
// // on wrong answer
// // on correct answer
const answerClickHandler = (event) => {
  const correctAnswerElement = event.target
  const answerIndexAttr = correctAnswerElement.getAttribute('answer-index') // starts from 1
  const answerIndex = parseInt(answerIndexAttr)

  const testProgression = LocalStorageManager.load(TEST_PROGRESSION_KEY)

  const updatedQuestions = testProgression.questions.map(
    (question, questionI) => {
      if (questionI + 1 === testProgression.currentIndex) {
        // update answer with newly selected one
        const updatedAnswers = question.answers.map((answer, answerI) => {
          if (answerI + 1 === answerIndex) {
            return {
              ...answer,
              isSelected: true,
            }
          } else {
            return {
              ...answer,
            }
          }
        })

        // update question with new answers
        const updatedQuestion = {
          ...question,
          answers: updatedAnswers,
        }

        return updatedQuestion
      }
      // else
      return {
        ...question,
      }
    }
  )

  const answeredQuestion = updatedQuestions.filter(
    (question, i) => i + 1 === testProgression.currentIndex
  )[0]

  const updatedTestProgression = {
    testId: testProgression.testId,
    state: testProgression.state,
    questions: [...updatedQuestions],
    currentIndex: testProgression.currentIndex,
    startedAt: testProgression.startedAt,
    isCompleted: testProgression.isCompleted,
    completedAt: testProgression.completedAt,
    score: testProgression.score,
  }

  // complete test if all questions are answered
  if (TestManager.checkTestIsCompleted(updatedQuestions)) {
    updatedTestProgression.isCompleted = true
    updatedTestProgression.completedAt = DateUtils.getCurrentDateTime()
    updatedTestProgression.score = TestManager.calculateScore(
      updatedTestProgression.questions
    )
    showTestResultsModal(
      updatedTestProgression,
      TestManager.isTestResultSuccessful(updatedTestProgression.score)
    )
  }

  LocalStorageManager.save(TEST_PROGRESSION_KEY, updatedTestProgression)

  switchTestAnswers(answeredQuestion)
}

// On Repeat Click
document
  .getElementById('test-results-repeat-button')
  .addEventListener('click', () => {
    // Load the current test progression
    const currentProgression = LocalStorageManager.load(TEST_PROGRESSION_KEY)

    // Reset the test progression using your helper function
    const repeatedQuestions = TestManager.resetCompletedTest(
      currentProgression.questions
    )

    const resettedTestProgression = DEFAULT_VALUE.TEST_PROGRESSION(
      crypto.randomUUID(),
      currentProgression.state,
      repeatedQuestions,
      DateUtils.getCurrentDateTime()
    )

    LocalStorageManager.save(TEST_PROGRESSION_KEY, resettedTestProgression)

    // Hide the test results modal if it's visible
    hideTestResultsModal()

    // Get the first question for the repeated test
    const firstQuestion = QuestionManager.getCurrentTestQuestion(
      resettedTestProgression.currentIndex,
      resettedTestProgression.questions
    )

    // Update UI: adjust previous/next buttons and set the question elements
    switchTestPreviousNextButtons(
      resettedTestProgression.currentIndex,
      resettedTestProgression.questions.length
    )
    setTestTabElements(
      resettedTestProgression.currentIndex,
      resettedTestProgression.questions.length,
      firstQuestion
    )
  })

// On Try More Click

/** UI Changes
 * They are only responsible for displaying whatever they receive as parameter
 * NO ACCESS to Local Storage or Question managers
 * */
const setTestTabElements = (
  currentQuestionIndex,
  totalNumberOfQuestions,
  currentQuestion
) => {
  document.getElementById('test-question-index').innerText =
    currentQuestionIndex
  document.getElementById('test-questions-length').innerText =
    totalNumberOfQuestions
  document.getElementById(
    'test-current-question-index-label'
  ).innerText = `Aufgabe ${currentQuestionIndex}`
  document.getElementById('test-question-description-label').innerText =
    currentQuestion.question

  switchTestAnswers(currentQuestion)
}

const switchTestAnswers = (question) => {
  question.answers.forEach((answer, i) => {
    const answerElement = document.getElementById(
      `test-current-question-answer-${i + 1}`
    )

    const newAnswerElement = answerElement.cloneNode(true)
    answerElement.parentNode.replaceChild(newAnswerElement, answerElement)
    newAnswerElement.innerText = answer.text

    // user answered
    if (question.answers.some((a) => a.isSelected)) {
      newAnswerElement.removeAttribute('answer-index')

      // answer is selected
      if (answer.isSelected) {
        // element is the correct answer
        if (answer.text === question.correct_answer) {
          newAnswerElement.classList.remove('inactive')
          newAnswerElement.classList.remove('wrong')
          newAnswerElement.classList.add('active')
        }
        // element is not the correct answer
        else {
          newAnswerElement.classList.remove('inactive')
          newAnswerElement.classList.add('active')
          newAnswerElement.classList.add('wrong')
        }
      }
      // answer is not selected
      else {
        // element is the correct answer
        if (answer.text === question.correct_answer) {
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
    }
    // user did not answer
    else {
      newAnswerElement.classList.remove('active')
      newAnswerElement.classList.remove('wrong')
      newAnswerElement.classList.add('inactive')

      newAnswerElement.setAttribute('answer-index', i + 1)
      newAnswerElement.addEventListener('click', answerClickHandler)
    }
  })
}

const switchTestPreviousNextButtons = (
  potentialQuestionIndex,
  totalNumberOfQuestions
) => {
  const previousButton = document.getElementById('test-previous')
  const nextButton = document.getElementById('test-next')
  ElementUtils.switchPreviousNextButtons(
    potentialQuestionIndex,
    totalNumberOfQuestions,
    { prevButton: previousButton, nextButton: nextButton }
  )
}

const showTestResultsModal = (progression, isPassed) => {
  document.getElementById('test-results-modal').style.display = 'block'

  if (isPassed) {
    document.getElementById('test-modal-success-message').style.display =
      'block'
    document.getElementById('test-modal-failure-message').style.display = 'none'
  } else {
    document.getElementById('test-modal-failure-message').style.display =
      'block'
    document.getElementById('test-modal-success-message').style.display = 'none'
  }

  document.getElementById('test-total-correct-answers').innerText =
    progression.score
  document.getElementById('test-total-wrong-answers').innerText =
    progression.questions.length - progression.score
}

const hideTestResultsModal = () => {
  const modalElement = document.getElementById('test-results-modal')

  if (modalElement) {
    modalElement.style.display = 'none'
  }
}
