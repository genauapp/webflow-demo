import questionsJson from '../../../json/einburgerungstest/questions.json' with { type: 'json' }
import { STATE_NATIONWIDE } from '../../constants/states.js'

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

    const learnQuestionsByNationwide = questions.filter(
      (question) => question.state === STATE_NATIONWIDE
    )

    const learnQuestionsByState = questions.filter(
      (question) => question.state === state
    )

    const learnQuestions = [
      ...learnQuestionsByNationwide,
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

    const testQuestionsByNationwide = questions.filter(
      (question) => question.state === STATE_NATIONWIDE
    ).map(question => {
      const updatedQuestion = QuestionManager.getQuestionWithImprovedAnswers(question)

      return updatedQuestion
    })

    const testQuestionsByState = questions.filter(
      (question) => question.state === state
    ).map(question => {
      const updatedQuestion = QuestionManager.getQuestionWithImprovedAnswers(question)

      return updatedQuestion
    })

    const testQuestions = [
      ...testQuestionsByNationwide,
      ...testQuestionsByState
    ]

    return testQuestions
  }

  static getQuestionWithImprovedAnswers = (question) => {
          // add isSelected property to each answer
          const updatedAnswers = question.answers.map(answer => {
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

  static getCurrentTestQuestion = (
    currentIndex,
    questions
  ) => {
    return questions[currentIndex - 1]
  }
}
