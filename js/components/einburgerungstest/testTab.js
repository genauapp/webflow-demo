import ElementUtils from '../../utils/ElementUtils.js'

export const testTabClickHandler = (event) => {
  const testTabElement = event.target

  console.log('I am clicked!')


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

  //   testTabElement.removeEventListener('click', testTabClickHandler)
}

/** UI Changes
 * They are only responsible for displaying whatever they receive as parameter
 * NO ACCESS to Local Storage or Question managers
 * */
const setTestTabElements = (
  currentQuestionIndex,
  totalNumberOfQuestions,
  currentQuestion,
  userAnswer
) => {
  // Example: Load current state and test question index (replace placeholders as needed)
  const currentState =
    LocalStorageManager.load(LEARN_STATE_KEY) || 'DefaultState'
  const testQuestionIndex = /* PLACEHOLDER: retrieve the appropriate test question index */ 1

  // Get test question info using a hypothetical function from QuestionManager
  // (Assuming you have a corresponding method for test questions)
  const testQuestion = QuestionManager.getCurrentTestQuestion
    ? QuestionManager.getCurrentTestQuestion(currentState, testQuestionIndex)
    : {
        question: 'Test Question Placeholder',
        answers: ['A', 'B', 'C', 'D'],
        correct_answer: 'B',
      }

  // Update the UI for the test tab (use placeholder IDs for test tab elements)
  document.getElementById('test-question-index').innerText = testQuestionIndex
  document.getElementById(
    'test-question-label'
  ).innerText = `Aufgabe ${testQuestionIndex}`
  document.getElementById('test-question-description').innerText =
    testQuestion.question

  // Update answers, etc. (you might call a similar helper as setLearnTabElements)
  switchTestAnswers(
    shouldShowAnswer,
    userAnswer,
    testQuestion.answers,
    testQuestion.correct_answer
  )
}

const switchTestAnswers = (
  shouldShowAnswer,
  userAnswer,
  answers,
  correctAnswer
) => {
  answers.forEach((answer, i) => {
    const answerElement = document.getElementById(
      `test-current-question-answer-${i + 1}`
    )

    const newAnswerElement = answerElement.cloneNode(true)
    answerElement.parentNode.replaceChild(newAnswerElement, answerElement)
    newAnswerElement.innerText = answer
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
    { previousButton, nextButton }
  )
}
