import questionsJson from '../../../json/einburgerungstest/questions.json' with { type: 'json' }
import { STATE_NATIONWIDE } from '../../constants/states.js'

export default class QuestionManager {
  static getLearnQuestionsByState = (state) => {
    const questions = questionsJson

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

    // TODO
    // const learnQuestionsByState = questions.filter(
    //   (question) => question.state === state
    // )

    const learnQuestions = [
      ...learnQuestionsByNationwide,
      // ...learnQuestionsByState
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
}
