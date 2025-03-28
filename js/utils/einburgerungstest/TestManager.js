import { TEST_SCORE_TO_PASS } from '../../constants/test.ts'

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

  static isTestResultSuccessful = (score) => {
    return score >= TEST_SCORE_TO_PASS
  }
}
