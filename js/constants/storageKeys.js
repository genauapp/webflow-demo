import { STATE_NATIONWIDE } from "./states.js";

/*
  App
*/
export const APP_VERSION_KEY = "APP_VERSION";
/*
  Homepage
*/
export const CURRENT_LEVEL_KEY = "CURRENT_LEVEL";
export const CURRENT_CATEGORY_KEY = "CURRENT_CATEGORY";
export const CURRENT_WORD_TYPE_KEY = "CURRENT_WORD_TYPE";
export const LEARNED_WITH_LEARN_WORDS_KEY = "LEARNED_WITH_LEARN_WORDS";
export const LEARNED_WITH_EXERCISE_WORDS_KEY = "LEARNED_WITH_EXERCISE_WORDS";
export const WORD_LIST_EXERCISE_KEY = "WORD_LIST_EXERCISE";
export const WORD_LIST_KEY = "WORD_LIST";
export const IN_PROGRESS_WORDS_KEY = "IN_PROGRESS_WORDS";
export const CURRENT_EXERCISE_INDEX_KEY = "CURRENT_EXERCISE_INDEX"
export const CURRENT_LEARN_INDEX_KEY = "CURRENT_LEARN_INDEX"
/*
  Einbürgerungstest
*/

export const CURRENT_STATE_KEY = "CURRENT_STATE";
export const SHOULD_SHOW_ANSWER_KEY = "SHOULD_SHOW_ANSWER";
export const LEARN__STATE__QUESTION_INDEX_KEY = (state) => {
  // Factory Function
  return `LEARN_${state}_QUESTION_INDEX`;
};
export const LEARN_QUESTION_USER_ANSWER_KEY = "LEARN_QUESTION_USER_ANSWER";
export const TEST_QUESTION_USER_ANSWER_KEY = "TEST_QUESTION_USER_ANSWER";
export const TEST_PROGRESSION_KEY = "TEST_PROGRESSION";

export class DEFAULT_VALUE {
  /**
   * App
   */
  static APP_VERSION = "1.2.45";

  /** 
  Homepage
  */
  static WORD_LIST_EXERCISE = [];
  static WORD_LIST = [];
  static CURRENT_LEVEL = "b1telcpt1";
  static CURRENT_WORD_TYPE = "noun";
  static CURRENT_CATEGORY = "default";
  static CURRENT_LEARN_INDEX = 0
  static CURRENT_EXERCISE_INDEX = 0

  static LEARNED_WITH_LEARN_WORDS = {
    b1telcpt1: {
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
    b1telcpt2: {
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
    b1telcpt3: {
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
    b1telcpt4: {
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
      einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] }
    }
  };

  static LEARNED_WITH_EXERCISE_WORDS = {
    b1telcpt1: {
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
    b1telcpt2: {
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
    b1telcpt3: {
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
    b1telcpt4: {
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
      einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] }
    }
  };

  static IN_PROGRESS_WORDS = {
    b1telcpt1: {
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
    b1telcpt2: {
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
    b1telcpt3: {
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
    b1telcpt4: {
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
      einburgerungstest: { noun: [], verb: [], adjective: [], adverb: [] }
    },
  }

  /** 
  Einbürgerungstest
  */
  static CURRENT_STATE = STATE_NATIONWIDE;

  static SHOULD_SHOW_ANSWER = true;
  static LEARN_QUESTION_INDEX = 1;
  static LEARN_QUESTION_USER_ANSWER = {
    answered: false,
    wasCorrect: false,
  };
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
    };
  };
}
