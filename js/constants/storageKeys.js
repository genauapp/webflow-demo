import { SigninModalTriggerEvent } from './events.js'
import { STATE_NATIONWIDE } from './states.js'

/*
  App
*/
export const APP_VERSION_KEY = 'APP_VERSION'
/*
  Homepage
*/
export const CURRENT_PACK_KEY = 'CURRENT_PACK'
export const CURRENT_CATEGORY_KEY = 'CURRENT_CATEGORY'
export const CURRENT_WORD_TYPE_KEY = 'CURRENT_WORD_TYPE'
export const LEARNED_WITH_LEARN_WORDS_KEY = 'LEARNED_WITH_LEARN_WORDS'
export const LEARNED_WITH_EXERCISE_WORDS_KEY = 'LEARNED_WITH_EXERCISE_WORDS'
export const WORD_LIST_EXERCISE_KEY = 'WORD_LIST_EXERCISE'
export const WORD_LIST_KEY = 'WORD_LIST'
export const IN_PROGRESS_WORDS_KEY = 'IN_PROGRESS_WORDS'
export const TOTAL_WORD_EXERCISE_KEY = 'TOTAL_WORD_EXERCISE'
export const TOTAL_WORD_LEARN_KEY = 'TOTAL_WORD_LEARN'
export const IS_ON_LEARN_KEY = 'IS_ON_LEARN_OR_EXERCISE'
export const PAYMENT_TRIGGER_COUNTER_KEY = 'PAYMENT_TRIGGER_COUNTER'
export const SIGNIN_TRIGGER_COUNTER_KEY = 'SIGNIN_TRIGGER_COUNTER'
export const BOOKMARKS_KEY = 'BOOKMARKS'

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
   * App
   */

  static APP_VERSION = '2.1.0'

  /** 
  Homepage
  */
  static WORD_LIST_EXERCISE = []
  static WORD_LIST = []
  static CURRENT_WORD_TYPE = 'noun'
  static CURRENT_CATEGORY = 'alltag'
  static TOTAL_WORD_LEARN = 0
  static TOTAL_WORD_EXERCISE = 0
  static IS_ON_LEARN_OR_EXERCISE = 'learn'

  static PAYMENT_TRIGGER_COUNTER = {
    learn: 0,
    exercise: 0,
    einburgerungstest: 0,
  }
  static SIGNIN_TRIGGER_COUNTER = {
    [SigninModalTriggerEvent.HOME_SEARCH_ADD_TO_BOOKMARKS]: {
      current: 0,
      max: 1,
    },
    [SigninModalTriggerEvent.LEVEL_LEARN_ADD_TO_BOOKMARKS]: {
      current: 0,
      max: 1,
    },
    [SigninModalTriggerEvent.LEVEL_LEARN_FINISH]: { current: 0, max: 3 },
    [SigninModalTriggerEvent.LEVEL_EXERCISE_FINISH]: { current: 0, max: 1 },
    [SigninModalTriggerEvent.EINBURGERUNGSTEST_TEST_FINISH]: {
      current: 0,
      max: null,
    },
  }

  static LEARNED_WITH_LEARN_WORDS = {
    a1: {
      alltag: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      einkaufen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      gesundheit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      behoerden: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    a2: {
      alltag: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      freizeit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      medien: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      arbeit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    b1: {
      gefuehle: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      reisen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      slang: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      wohnen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      b1telc: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    b2: {
      bildung: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      kultur: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      politik: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      technik: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    c1: {
      default: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      dirty: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      doctor: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      music: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    c2: {
      default: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      dirty: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      doctor: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      music: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    einburgerungstest: {
      einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] },
    },
  }

  static LEARNED_WITH_EXERCISE_WORDS = {
    a1: {
      alltag: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      einkaufen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      gesundheit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      behoerden: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    a2: {
      alltag: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      freizeit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      medien: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      arbeit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    b1: {
      gefuehle: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      reisen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      slang: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      wohnen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      b1telc: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    b2: {
      bildung: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      kultur: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      politik: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      technik: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    c1: {
      default: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      dirty: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      doctor: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      music: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    c2: {
      default: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      dirty: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      doctor: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      music: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    einburgerungstest: {
      einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] },
    },
  }

  static IN_PROGRESS_WORDS = {
    a1: {
      alltag: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      einkaufen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      gesundheit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      behoerden: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    a2: {
      alltag: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      freizeit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      medien: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      arbeit: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    b1: {
      gefuehle: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      reisen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      slang: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      wohnen: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      b1telc: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    b2: {
      bildung: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      kultur: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      politik: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      technik: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    c1: {
      default: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      dirty: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      doctor: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      music: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    c2: {
      default: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      dirty: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      doctor: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
      music: {
        noun: [],
        verb: [],
        adjective: [],
        adverb: [],
      },
    },
    einburgerungstest: {
      einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] },
    },
  }

  static BOOKMARKS = {
    favorites: [],
    learned: [],
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
