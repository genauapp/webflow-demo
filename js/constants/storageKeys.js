import { STATE_NATIONWIDE } from './states.js'

/*
  Homepage
*/
export const CURRENT_LEVEL_KEY = 'CURRENT_LEVEL'
export const LEARNED_WITH_LEARN_WORDS_KEY = 'LEARNED_WITH_LEARN_WORDS'
export const LEARNED_WITH_EXERCISE_WORDS_KEY = 'LEARNED_WITH_EXERCISE_WORDS'
/*
  Einbürgerungstest
*/

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
  /** 
  Homepage
  */
  static CURRENT_LEVEL = 'b1telcpt1'

  static LEARNED_WITH_LEARN_WORDS = {
    b1telcpt1: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    b1telcpt2: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    b1telcpt3: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    b1telcpt4: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
    einburgerungstest: {
      noun: [],
      verb: [],
      adjective: [],
      adverb: [],
    },
  }

  static LEARNED_WITH_EXERCISE_WORDS = {
    b1telcpt1: { noun: [], verb: [], adjective: [], adverb: [] },
    b1telcpt2: { noun: [], verb: [], adjective: [], adverb: [] },
    b1telcpt3: { noun: [], verb: [], adjective: [], adverb: [] },
    b1telcpt4: { noun: [], verb: [], adjective: [], adverb: [] },
    einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] },
  }

  /** 
  Einbürgerungstest
  */
  static CURRENT_STATE = STATE_NATIONWIDE

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
      startedAt: startedAt,
      isCompleted: false,
      completedAt: null,
      score: 0,
    }
  }
}
