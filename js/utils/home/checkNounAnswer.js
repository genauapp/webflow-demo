import { DEFAULT_VALUE, WORD_LIST_EXERCISE_KEY, CURRENT_WORD_TYPE_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import playSound from "./PlaySound.js"
import showExerciseWord from "./ShowExerciseWord.js"
import { artikelRenk } from "./showLearnWord.js"
import InProgressManager from "./InProgressManager.js"
import ListUtils from "../ListUtils.js"

export default function checkNounAnswer(userArtikel) {
  let wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
  // Eğer liste boşsa veya index liste dışındaysa, işlemi durdur
  if (!wordListExercise.length || wordListExercise.length == 0) {
    return
  }

  const currentWord = wordListExercise[0]
  const { artikel, kural } = currentWord
  const buttonDer = document.getElementById('buttonDer')
  const buttonDie = document.getElementById('buttonDie')
  const buttonDas = document.getElementById('buttonDas')

  buttonDer.style.visibility = 'hidden'
  buttonDie.style.visibility = 'hidden'
  buttonDas.style.visibility = 'hidden'

  if (userArtikel.toLowerCase() === artikel.toLowerCase()) {
    document.getElementById(`feedbackMessage-${wordType}`).innerText =
      'Correct! 🎉'
    document.getElementById(`feedbackMessage-${wordType}`).style.color =
      'green'

    playSound(
      'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
    )

    // Doğru artikeli göster
    const renk = artikelRenk(artikel)
    document.getElementById(
      'correctAnswerField'
    ).innerHTML = `<span style="color: ${renk};">${artikel}</span>`

    //InProgress listesine kelimeyi ekle - Eger hic dogru bilinmemisse yeni ekle daha önce bilinmisse progress i arttir
    InProgressManager(true)

    const shuffledList = ListUtils.shuffleArray(wordListExercise)
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, shuffledList)

    setTimeout(() => {
      document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      showExerciseWord()
    }, 1000)
  } else {

    InProgressManager(false)

    document.getElementById(
      `feedbackMessage-${wordType}`
    ).innerText = `Upps! ⚠️ ${kural}`
    document.getElementById(`feedbackMessage-${wordType}`).style.color =
      'red'

    const shuffledList = ListUtils.shuffleArray(wordListExercise)
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, shuffledList)
    
    setTimeout(() => {
      document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      showExerciseWord()
    }, 3000)
  }
}