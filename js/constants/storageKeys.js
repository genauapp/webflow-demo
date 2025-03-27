export const CURRENT_STATE_KEY = 'CURRENT_STATE'
export const SHOULD_SHOW_ANSWER_KEY = 'SHOULD_SHOW_ANSWER'
export const LEARN__STATE__QUESTION_INDEX_KEY = (state) => {
  // Factory Function
  return `LEARN_${state}_QUESTION_INDEX`
}
export const LEARN_QUESTION_USER_ANSWER_KEY = 'LEARN_QUESTION_USER_ANSWER'
export const TEST_QUESTION_USER_ANSWER_KEY = 'TEST_QUESTION_USER_ANSWER'
export const TEST_PROGRESSION_KEY = 'TEST_PROGRESSION'

export class DEFAULT_VALUE {
  static CURRENT_STATE = 'Berlin'

  static SHOULD_SHOW_ANSWER = true
  static LEARN_QUESTION_INDEX = 1
  static LEARN_QUESTION_USER_ANSWER = {
    answered: false,
    wasCorrect: false,
  }
  static TEST_PROGRESSION = (
    testId,
    currentState,
    testQuestions,
    startedAt
  ) => {
    return {
      testId: testId,
      state: currentState,
      questions: [...testQuestions],
      currentIndex: 1,
      isCompleted: false,
      startedAt: startedAt,
      completedAt: null,
    }
  }
}
