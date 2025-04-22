import { DEFAULT_VALUE, WORD_LIST_EXERCISE_KEY } from '../../constants/storageKeys.js'
import LocalStorageManager from '../LocalStorageManager.js'
import NumberUtils from '../NumberUtils.js'

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
    const wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
    const selectedWord = wordListExercise[0]
    const wordListExerciseInstance = wordListExercise
    
    const filteredWordList = wordListExerciseInstance.filter(
      (wordExercise) => wordExercise.german !== selectedWord.german
    )

    const randomIndex = NumberUtils.getRandomNumber(
      filteredWordList.length - 1
    )
    const randomResult = filteredWordList[randomIndex].english

    return randomResult
  }
}
