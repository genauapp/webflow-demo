import questionsJson from '../../../json/einburgerungstest/questions.json' with { type: 'json' }

export default class QuestionManager {
  static getQuestionsByState = (state) => {
    const questions = questionsJson

    if (
      questions === null ||
      questions.length === 0 ||
      state === null ||
      state.trim().length === 0
    ) {
      return []
    }

    const questionsByState = questions.filter(
      (question) => question.state === state
    )

    return questionsByState
  }
}
