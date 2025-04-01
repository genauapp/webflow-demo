import questionsJson from '../../../json/einburgerungstest/questions.json' with { type: 'json' }
import { ALL_NATIONWIDE_TEST_QUESTION_LIST_SIZE, NATIONWIDE_TEST_QUESTION_LIST_SIZE, STATEWIDE_TEST_QUESTION_LIST_SIZE } from '../../constants/questions.js'
import { STATE_NATIONWIDE } from '../../constants/states.js'
import ListUtils from '../ListUtils.js'

export default class QuestionManager {
  static getLearnQuestionsByState = (state) => {
    const questions = questionsJson

    // Return an empty list if json is null/empty or state is null/empty
    if (
      questions === null ||
      questions.length === 0 ||
      state === null ||
      state.trim().length === 0
    ) {
      return []
    }

    // const learnQuestionsByNationwide = questions.filter(
    //   (question) => question.state === STATE_NATIONWIDE
    // )

    const learnQuestionsByState = questions.filter(
      (question) => question.state === state
    )

    const learnQuestions = [
      // ...learnQuestionsByNationwide,
      ...learnQuestionsByState
    ]

    return learnQuestions
  }

  static getCurrentLearnQuestion = (currentState, currentLearnQuestionIndex) => {
    const questions = QuestionManager.getLearnQuestionsByState(currentState)
    return questions[currentLearnQuestionIndex - 1]
  }

  static getTotalNumberOfLearnQuestions = (currentState) => {
    const questions = QuestionManager.getLearnQuestionsByState(currentState)

    return questions.length
  }

  /** Test Tab */
  static getTestQuestionsByState = (state) => {
    const questions = questionsJson

    // Return an empty list if json is null/empty or state is null/empty
    if (
      questions === null ||
      questions.length === 0 ||
      state === null ||
      state.trim().length === 0
    ) {
      return []
    }

    // selected state is nationwide
    if (state === STATE_NATIONWIDE) {
      const updatedTestQuestionsByNationWide = QuestionManager.getRandomTestQuestionsByState(questions, state, ALL_NATIONWIDE_TEST_QUESTION_LIST_SIZE)

      // shuffle them
      const shuffledTestQuestions = ListUtils.shuffleArray(updatedTestQuestionsByNationWide)
      // console.log(`new list: ${JSON.stringify(shuffledTestQuestions, null, 2)}`)
      return shuffledTestQuestions
    }

    // create nationwide questions
    const updatedTestQuestionsByNationWide = QuestionManager.getRandomTestQuestionsByState(questions, STATE_NATIONWIDE, NATIONWIDE_TEST_QUESTION_LIST_SIZE)
    // create statewide questions
    const updatedTestQuestionsByState = QuestionManager.getRandomTestQuestionsByState(questions, state, STATEWIDE_TEST_QUESTION_LIST_SIZE)

    // merge nationwide and statewide question lists
    const testQuestions = [
      ...updatedTestQuestionsByNationWide,
      ...updatedTestQuestionsByState
    ]

    // shuffle them
    const shuffledTestQuestions = ListUtils.shuffleArray(testQuestions)

    // console.log(`new list: ${JSON.stringify(shuffledTestQuestions, null, 2)}`)

    return shuffledTestQuestions
  }

  static getRandomTestQuestionsByState = (questions, state, numberOfRandomItems) => {
    const testQuestionsByState = questions.filter(
      (question) => question.state === state
    )
    const randomTestQuestionsByState = ListUtils.getRandomItems(testQuestionsByState, numberOfRandomItems)
    const updatedTestQuestionsByState = randomTestQuestionsByState.map(question => {
      const updatedQuestion = QuestionManager.getTestQuestionWithImprovedAnswers(question)

      return updatedQuestion
    })

    return updatedTestQuestionsByState
  }

  static getTestQuestionWithImprovedAnswers = (question) => {
          // add isSelected property to each answer
          const updatedAnswers = question.answers.map((answer, index) => {
            return {
            text: answer,
            isSelected: false,
            }
          })
    
          // update answers to include this new property for each
          const testQuestion = {
            ...question,
            answers: [...updatedAnswers]
          }
    
          return testQuestion
  }

  // starting from 1
  static getCorrectAnswerIndex = (question) => {
    const correctAnswerIndex = question.answers.map((answer, index) => {
      if (answer.text === question.correct_answer) {
        return index + 1
      }
      // else
      return null
      
    })
    // clean nulls
    .filter(a => a !== null)[0]

    return correctAnswerIndex
  }


  static getCurrentTestQuestion = (
    currentIndex,
    questions
  ) => {
    return questions[currentIndex - 1]
  }
}
