import {
  CURRENT_CATEGORY_KEY,
  CURRENT_WORD_TYPE_KEY,
  DEFAULT_VALUE,
  IN_PROGRESS_WORDS_KEY,
  LEARNED_WITH_EXERCISE_WORDS_KEY,
  WORD_LIST_EXERCISE_KEY,
} from '../../constants/storageKeys.js'
import LevelManager from '../LevelManager.js'
import LocalStorageManager from '../LocalStorageManager.js'
import playSound from './PlaySound.js'
import { confettiAnimation } from './UIUtils.js'

export default function InProgressManager(isAnswerCorrect) {
  const wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
  const currentWord = wordListExercise[0]
  let inProgressWords = LocalStorageManager.load(
    IN_PROGRESS_WORDS_KEY,
    DEFAULT_VALUE.IN_PROGRESS_WORDS
  )
  const level = LevelManager.getCurrentLevel()
  const category = LocalStorageManager.load(
    CURRENT_CATEGORY_KEY,
    DEFAULT_VALUE.CURRENT_CATEGORY
  )
  const wordType = LocalStorageManager.load(
    CURRENT_WORD_TYPE_KEY,
    DEFAULT_VALUE.CURRENT_WORD_TYPE
  )
  let learnedWithExerciseWords = LocalStorageManager.load(
    LEARNED_WITH_EXERCISE_WORDS_KEY,
    DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS
  )

  const inProgressIndex = inProgressWords[level][category][wordType].findIndex(
    (item) => item.german === currentWord.german
  )
  if (isAnswerCorrect) {
    // if currentWord is not in the INPROGRESSWORDS list
    if (inProgressIndex === -1) {
      //Add it into inProgressWordsList and save it into LocalStorage
      inProgressWords[level][category][wordType].push({
        type: currentWord.type,
        german: currentWord.german,
        counter: 1,
      })
      LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
      document.getElementById('progressLeft-' + wordType).style.opacity = '1'
      return
    } else {
      inProgressWords[level][category][wordType][inProgressIndex].counter += 1
      if (inProgressWords[level][category][wordType][inProgressIndex].counter === 1) {
        document.getElementById(`progressLeft-${wordType}`).style.opacity =
          '1'
        LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
        return
      }
      if (
        inProgressWords[level][category][wordType][inProgressIndex].counter ===
        2
      ) {
        document.getElementById(`progressMiddle-${wordType}`).style.opacity =
          '1'
        LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
        return
      }
      if (
        inProgressWords[level][category][wordType][inProgressIndex].counter >= 3
      ) {
        playSound('../../../assets/sound/blob.wav')
        confettiAnimation()

        learnedWithExerciseWords[level][category][wordType].push({
          type: currentWord.type,
          german: currentWord.german,
          english: currentWord.english,
          level: currentWord.level || 'N/A',
        })
        LocalStorageManager.save(
          LEARNED_WITH_EXERCISE_WORDS_KEY,
          learnedWithExerciseWords
        )
        let bookmarkedWords = LocalStorageManager.load('BOOKMARKS')
        let learnedWords = bookmarkedWords.learned
        learnedWords.push({
          type: currentWord.type,
          german: currentWord.german,
          english: currentWord.english,
          level: currentWord.level || 'N/A',
        })
        bookmarkedWords.learned = learnedWords
        LocalStorageManager.save('BOOKMARKS', bookmarkedWords)
        // Remove the current word from the wordListExercise array
        wordListExercise.splice(0, 1)
        LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)

        document.getElementById(`feedbackMessage-${wordType}`).innerText = `This word: ${currentWord.german} added to learned list!🏆`
        document.getElementById(`feedbackMessage-${wordType}`).style.color = 'green'
        document.getElementById(`progressRight-${wordType}`).style.opacity = '1'

        // remove item from inProgressWords
        inProgressWords[level][category][wordType].splice(inProgressIndex, 1)
        LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
        return
      }
    }
  } else if (!isAnswerCorrect) {
    if (inProgressIndex === -1) {
      return
    }

    inProgressWords[level][category][wordType][inProgressIndex].counter = 0
    document.getElementById(`progressRight-${wordType}`).style.opacity = '0.5'
    document.getElementById(`progressMiddle-${wordType}`).style.opacity = '0.5'
    document.getElementById(`progressLeft-${wordType}`).style.opacity = '0.5'
    LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
    return
  }
}
