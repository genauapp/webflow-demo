import LocalStorageManager from '../../utils/LocalStorageManager.js'
import QuestionManager from '../../utils/einburgerungstest/QuestionManager.js'
import DateUtils from '../../utils/DateUtils.js'
import ElementUtils from '../../utils/ElementUtils.js'

import {
  CURRENT_STATE_KEY,
  DEFAULT_VALUE,
  TEST_PROGRESSION_KEY,
} from '../../constants/storageKeys.js'

export const testTabClickHandler = (event) => {
  // const testTabElement = event.target
  console.log('I am clicked!')

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

/** UI Changes
 * They are only responsible for displaying whatever they receive as parameter
 * NO ACCESS to Local Storage or Question managers
 * */
const setTestTabElements = (
  currentQuestionIndex,
  totalNumberOfQuestions,
  currentQuestion
) => {
  // Update the UI for the test tab (use placeholder IDs for test tab elements)
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
    newAnswerElement.innerText = answer

    // user answered
    if (question.answers.some((q) => q.isSelected)) {
      // answer is selected
      if (answer.isSelected) {
        // element is the correct answer
        if (answer === question.correct_answer) {
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
        newAnswerElement.classList.remove('active')
        newAnswerElement.classList.remove('wrong')
        newAnswerElement.classList.add('inactive')
      }
    }
    // user did not answer
    else {
      newAnswerElement.classList.remove('active')
      newAnswerElement.classList.remove('wrong')
      newAnswerElement.classList.add('inactive')
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
