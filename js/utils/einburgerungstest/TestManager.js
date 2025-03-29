import { TEST_SCORE_TO_PASS } from '../../constants/test.js'
import { ListUtils } from '../ListUtils.js'

export default class TestManager {
  static checkTestIsCompleted = (questions) => {
    return questions.every((q) => q.answers.some((a) => a.isSelected))
  }

  static calculateScore = (questions) => {
    return questions.reduce((total, question) => {
      const isCorrect = question.answers.some(
        (answer) => answer.isSelected && answer.text === question.correct_answer
      )
      return total + (isCorrect ? 1 : 0)
    }, 0)
  }

  static resetCompletedTest = (questions) => {
    const resettedQuestions = questions.map((q) => {
      const resettedAnswers = q.answers.map((a) => ({
        ...a,
        isSelected: false,
      }))

      return {
        ...q,
        answers: resettedAnswers,
      }
    })

    const shuffledQuestions = ListUtils.shuffleArray(resettedQuestions)

    return shuffledQuestions
  }

  static isTestResultSuccessful = (score) => {
    return score >= TEST_SCORE_TO_PASS
  }
}
