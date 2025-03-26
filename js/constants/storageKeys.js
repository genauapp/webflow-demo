export const LEARN_STATE_KEY = 'LEARN_STATE'
export const SHOULD_SHOW_ANSWER_KEY = 'SHOULD_SHOW_ANSWER'
export class LEARN__STATE__QUESTION_INDEX_KEY {
  constructor(state) {
    return `LEARN_${state}_QUESTION_INDEX`
  }
}

export class DEFAULT_VALUE {
  static SHOULD_SHOW_ANSWER = true
  static LEARN_STATE = 'Berlin'
  static LEARN_QUESTION_INDEX = 1
}
