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

  static getRandomTranslationResult = (currentLevel, selectedWord, staticWordLists) => {
    const kelimeListesiInstance = staticWordLists[currentLevel][selectedWord.type]
    const filteredKelimeListesiExercise = kelimeListesiInstance.filter(
      (kelimeExercise) => kelimeExercise.almanca !== selectedWord.almanca
    )

    console.log('kelime listesi exercise Instance:')
    console.log(kelimeListesiInstance)
    console.log('filtered kelime listesi exercise:')
    console.log(filteredKelimeListesiExercise)

    const randomIndex = NumberUtils.getRandomNumber(
      filteredKelimeListesiExercise.length - 1
    )

    console.log(filteredKelimeListesiExercise[randomIndex])

    const randomResult = filteredKelimeListesiExercise[randomIndex].ingilizce

    return randomResult
  }
}
