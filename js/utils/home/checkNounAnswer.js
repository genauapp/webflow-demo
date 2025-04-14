import { DEFAULT_VALUE, IN_PROGRESS_WORDS_KEY, WORD_LIST_EXERCISE_KEY, LEARNED_WITH_EXERCISE_WORDS_KEY, WORD_LIST_KEY, CURRENT_LEVEL_KEY, CURRENT_WORD_TYPE_KEY, CURRENT_CATEGORY_KEY, CURRENT_EXERCISE_INDEX_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import playSound from "./PlaySound.js"
import showExerciseWord from "./ShowExerciseWord.js"
import { artikelRenk } from "./showLearnWord.js"
import InProgressManager from "./InProgressManager.js"
import ListUtils from "../ListUtils.js"

export default function checkNounAnswer(userArtikel) {
  let wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
  let wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
  let learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
  let inProgressWords = LocalStorageManager.load(IN_PROGRESS_WORDS_KEY, DEFAULT_VALUE.inProgressWords)
  let currentExerciseIndex = LocalStorageManager.load(CURRENT_EXERCISE_INDEX_KEY, DEFAULT_VALUE.CURRENT_EXERCISE_INDEX)
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

    ListUtils.shuffleArray(wordListExercise)
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)

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

    ListUtils.shuffleArray(wordListExercise)
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)
    setTimeout(() => {
      document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
      showExerciseWord()
    }, 3000)
  }
}