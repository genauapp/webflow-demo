import LocalStorageManager from '../LocalStorageManager.js'
import {
  DEFAULT_VALUE,
  CURRENT_CATEGORY_KEY,
  WORD_LIST_KEY,
  TOTAL_WORD_LEARN_KEY,
  LEARNED_WITH_LEARN_WORDS_KEY,
  CURRENT_WORD_TYPE_KEY,
} from '../../constants/storageKeys.js'
import showLearnWord from './showLearnWord.js'
import { showFinishScreen } from './UIUtils.js'
import {
  decideShowingPaymentWorkflowOn,
  PaymentTriggerEvent,
} from '../payment/PaymentUtils.js'
import LevelManager from '../LevelManager.js'

// On Learn: Repeat Click
export function repeatLearn() {
  const totalWordsLearn = LocalStorageManager.load(
    TOTAL_WORD_LEARN_KEY,
    DEFAULT_VALUE.TOTAL_WORD_LEARN
  )
  let wordList = LocalStorageManager.load(
    WORD_LIST_KEY,
    DEFAULT_VALUE.WORD_LIST
  )

  if (totalWordsLearn === 0) {
    return
  }

  // Get current word and move it to the end
  const currentWord = wordList.splice(0, 1)[0]
  wordList.push(currentWord)
  LocalStorageManager.save(WORD_LIST_KEY, wordList)

  // Show the next word
  showLearnWord()
}

// On Learn: I Know Click
export function iKnowLearn() {
  const level = LevelManager.getCurrentLevel()
  const wordType = LocalStorageManager.load(
    CURRENT_WORD_TYPE_KEY,
    DEFAULT_VALUE.CURRENT_WORD_TYPE
  )
  let learnedWithLearnWords = LocalStorageManager.load(
    LEARNED_WITH_LEARN_WORDS_KEY,
    DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS
  )
  const category = LocalStorageManager.load(
    CURRENT_CATEGORY_KEY,
    DEFAULT_VALUE.CURRENT_CATEGORY
  )
  const totalWordsLearn = LocalStorageManager.load(
    TOTAL_WORD_LEARN_KEY,
    DEFAULT_VALUE.TOTAL_WORD_LEARN
  )
  let wordList = LocalStorageManager.load(
    WORD_LIST_KEY,
    DEFAULT_VALUE.WORD_LIST
  )
  //add current word into wordList and save it to the localstorage
  const currentWord = wordList[0]
  learnedWithLearnWords[level][category][wordType].push({ ...currentWord })
  LocalStorageManager.save(LEARNED_WITH_LEARN_WORDS_KEY, learnedWithLearnWords)
  //Remove last learned word from wordList and save it to the localStorage
  wordList.splice(0, 1)
  LocalStorageManager.save(WORD_LIST_KEY, wordList)
  document.getElementById(`remainingWordsCountLearn-${wordType}`).innerText =
    learnedWithLearnWords[level][category][wordType].length

  if (
    learnedWithLearnWords[level][category][wordType].length === totalWordsLearn
  ) {
    showFinishScreen()
    decideShowingPaymentWorkflowOn(PaymentTriggerEvent.LEARN)
    return
  }
  showLearnWord()
}
