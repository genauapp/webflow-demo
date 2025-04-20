import {
  DEFAULT_VALUE,
  WORD_LIST_EXERCISE_KEY,
  CURRENT_WORD_TYPE_KEY,
} from '../../constants/storageKeys.js'
import LocalStorageManager from '../LocalStorageManager.js'
import playSound from './PlaySound.js'
import showExerciseWord from './ShowExerciseWord.js'
import ListUtils from '../ListUtils.js'
import InProgressManager from './InProgressManager.js'

export default function checkNonNounAnswer(isUserInputCorrect) {
  let wordListExercise = LocalStorageManager.load(
    WORD_LIST_EXERCISE_KEY,
    DEFAULT_VALUE.WORD_LIST_EXERCISE
  )
  const wordType = LocalStorageManager.load(
    CURRENT_WORD_TYPE_KEY,
    DEFAULT_VALUE.CURRENT_WORD_TYPE
  )
  // Eğer liste boşsa veya index liste dışındaysa, işlemi durdur
  if (!wordListExercise.length || wordListExercise.length === 0) {
    return
  }

  const currentWord = wordListExercise[0]
  const buttonWrong = document.getElementById(`wrongButton-${wordType}`)
  const buttonCorrect = document.getElementById(`correctButton-${wordType}`)

  buttonWrong.style.visibility = 'hidden'
  buttonCorrect.style.visibility = 'hidden'

  const isAnswerCorrect = !buttonWrong.hasAttribute('wrong-but')

  // CORRECT ANSWER
  if (isUserInputCorrect === isAnswerCorrect) {
    document.getElementById(`feedbackMessage-${wordType}`).innerText =
      'Correct! 🎉'
    document.getElementById(`feedbackMessage-${wordType}`).style.color = 'green'
    playSound(
      'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
    )

    //InProgress listesine wordyi ekle - Eger hic dogru bilinmemisse yeni ekle daha önce bilinmisse progress i arttir
    InProgressManager(true)

    const shuffledList = ListUtils.shuffleArray(wordListExercise)
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, shuffledList)

    setTimeout(() => {
      showExerciseWord()
    }, 1000)
    buttonWrong.removeAttribute('wrong-but')
    return
  } else {
    InProgressManager(false)
    document.getElementById(
      `feedbackMessage-${wordType}`
    ).innerText = `Upps! Try again. 💪`
    document.getElementById(`feedbackMessage-${wordType}`).style.color = 'red'

    const shuffledList = ListUtils.shuffleArray(wordListExercise)
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, shuffledList)

    setTimeout(() => {
      showExerciseWord()
    }, 3000)
    buttonWrong.removeAttribute('wrong-but')
    return
  }
}
