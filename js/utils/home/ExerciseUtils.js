import { CURRENT_CATEGORY_KEY, CURRENT_LEVEL_KEY, DEFAULT_VALUE, WORD_LIST_EXERCISE_KEY } from '../../constants/storageKeys.js'
import LocalStorageManager from '../LocalStorageManager.js'
import NumberUtils from '../NumberUtils.js'
import { staticWordLists } from '../../constants/urls.js'

export default class ExerciseUtils {
  static shouldUseOwnMeaning = () => {
    // Math.random() returns a number between 0 (inclusive) and 1 (exclusive).
    // If the number is less than 0.6, that's a 60% chance.
    const useOwnMeaning = Math.random() < 0.6
    console.log(
      'decided as: ' + (useOwnMeaning ? 'own meaning' : 'different meaning')
    )
    return useOwnMeaning
  }

  static getRandomTranslationResult = () => {
    const currentLevel = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
    const wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
    const selectedWord = wordListExercise[0]
    const currentCategory = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
    const kelimeListesiInstance = staticWordLists[currentLevel][currentCategory][selectedWord.type]
   
    const filteredKelimeListesiExercise = kelimeListesiInstance.filter(
      (kelimeExercise) => kelimeExercise.almanca !== selectedWord.almanca
    )

    const randomIndex = NumberUtils.getRandomNumber(
      filteredKelimeListesiExercise.length - 1
    )
    const randomResult = filteredKelimeListesiExercise[randomIndex].ingilizce

    return randomResult
  }
}
