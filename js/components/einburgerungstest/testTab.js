import LocalStorageManager from '../../utils/LocalStorageManager.js'
import QuestionManager from '../../utils/einburgerungstest/QuestionManager.js'
import DateUtils from '../../utils/DateUtils.js'
import ElementUtils from '../../utils/ElementUtils.js'

import {
  CURRENT_STATE_KEY,
  DEFAULT_VALUE,
  TEST_PROGRESSION_KEY,
} from '../../constants/storageKeys.js'

// On Tab Click
export const testTabClickHandler = (event) => {
  const testTabElement = event.target
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
  console.log(`lose progression is triggered via click of: ${event.target}`)

  const userConfirmed = window.confirm(
    'Are you sure you want to leave? Your progress will be lost.'
  )
  if (!userConfirmed) {
    event.preventDefault() // Prevents the action if user cancels
  }

  // else
  document.getElementById('learn-tab').click()
}

// On (State Content) Load?
// // Reload new random test questions
// On State Change
document.querySelectorAll('.state-dropdown-link').forEach((stateLink) => {
  stateLink.addEventListener('click', loseProgressionClickHandler)
})

// On Tab Change
document
  .getElementById('learn-tab')
  .addEventListener('click', loseProgressionClickHandler)

// On Test Tab's User Answer
// // on wrong answer
// // on correct answer
const answerClickHandler = (event) => {
  const correctAnswerElement = event.target
  const answerIndexAttr = correctAnswerElement.getAttribute('answer-index') // starts from 1
  const answerIndex = parseInt(answerIndexAttr)

  const currentState = LocalStorageManager.load(CURRENT_STATE_KEY)
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
    state: currentState,
    questions: [...updatedQuestions],
    currentIndex: testProgression.currentIndex,
    isCompleted: testProgression.isCompleted, // todo: check if it's finished later
    startedAt: testProgression.startedAt,
    completedAt: testProgression.completedAt, // todo: check if it's finished later
  }

  LocalStorageManager.save(TEST_PROGRESSION_KEY, updatedTestProgression)

  switchTestAnswers(answeredQuestion)
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
