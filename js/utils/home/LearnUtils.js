import LocalStorageManager from '../LocalStorageManager.js'
import { showModal } from './ModalManager.js'
import {
    DEFAULT_VALUE,
    CURRENT_CATEGORY_KEY,
    WORD_LIST_KEY,
    CURRENT_LEARN_INDEX_KEY,
    TOTAL_WORD_LEARN_KEY,
    LEARNED_WITH_LEARN_WORDS_KEY,
    CURRENT_LEVEL_KEY,
    CURRENT_WORD_TYPE_KEY,
} from '../../constants/storageKeys.js'
import showLearnWord from './showLearnWord.js'

// On Learn: Repeat Click
export function repeatLearn() {
    const totalWordsLearn = LocalStorageManager.load(TOTAL_WORD_LEARN_KEY, DEFAULT_VALUE.TOTAL_WORD_LEARN)
    let wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
    let currentLearnIndex = LocalStorageManager.load(CURRENT_LEARN_INDEX_KEY, DEFAULT_VALUE.CURRENT_LEARN_INDEX)

    if (totalWordsLearn === 0 || currentLearnIndex >= totalWordsLearn) {
        return
    }

    // Get current word and move it to the end
    const currentWord = wordList.splice(currentLearnIndex, 1)[0]
    wordList.push(currentWord)
    LocalStorageManager.save(WORD_LIST_KEY, wordList)

    // Keep the index within bounds
    currentLearnIndex = currentLearnIndex % totalWordsLearn
    LocalStorageManager.save(CURRENT_LEARN_INDEX_KEY, currentLearnIndex)

    // Show the next word
    showLearnWord()
}

// On Learn: I Know Click
export function iKnowLearn() {
    const level = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    let learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
    const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
    let currentLearnIndex = LocalStorageManager.load(CURRENT_LEARN_INDEX_KEY, DEFAULT_VALUE.CURRENT_LEARN_INDEX)
    const totalWordsLearn = LocalStorageManager.load(TOTAL_WORD_LEARN_KEY, DEFAULT_VALUE.TOTAL_WORD_LEARN)
    let wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)

    if (learnedWithLearnWords[level][category][wordType].length === totalWordsLearn) {
        showModal('You learned all words! 🎉', wordType)
    }

    const currentWord = wordList[totalWordsLearn - currentLearnIndex]

    learnedWithLearnWords[level][category][wordType].push({ ...currentWord })
    LocalStorageManager.save(LEARNED_WITH_LEARN_WORDS_KEY, learnedWithLearnWords)

    wordList.splice(currentLearnIndex, 1)
    LocalStorageManager.save(WORD_LIST_KEY, wordList)

    document.getElementById(`remainingWordsCountLearn-${wordType}`).innerText =
        learnedWithLearnWords[level][category][wordType].length

    showLearnWord()
}
