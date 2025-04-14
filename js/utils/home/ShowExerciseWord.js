import { DEFAULT_VALUE, IN_PROGRESS_WORDS_KEY, WORD_LIST_EXERCISE_KEY, WORD_LIST_KEY, CURRENT_CATEGORY_KEY, CURRENT_LEVEL_KEY, LEARNED_WITH_EXERCISE_WORDS_KEY, CURRENT_WORD_TYPE_KEY, CURRENT_EXERCISE_INDEX_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import ExerciseUtils from "./ExerciseUtils.js"
import { staticWordLists } from "../../constants/urls.js"

export default function showExerciseWord() {
    const wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
    let wordListExercise= LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
    const level = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
    const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
    const inProgressWords = LocalStorageManager.load(IN_PROGRESS_WORDS_KEY, DEFAULT_VALUE.IN_PROGRESS_WORDS)
    let currentIndex = LocalStorageManager.load(CURRENT_EXERCISE_INDEX_KEY, DEFAULT_VALUE.CURRENT_EXERCISE_INDEX)
    // updated indexes
    document.getElementById(
      `remainingWordsCountExercise-${wordType}`
    ).innerText = learnedWithExerciseWords[level][category][wordType].length
    document.getElementById('totalWordsCountExercise-' + wordType).innerText =
      wordList.length
  
    const buttonDer = document.getElementById('buttonDer')
    const buttonDie = document.getElementById('buttonDie')
    const buttonDas = document.getElementById('buttonDas')
    const buttonWrong = document.getElementById(`wrongButton-${wordType}`)
    const buttonCorrect = document.getElementById(`correctButton-${wordType}`)
  
    // max index -> hiding buttons, early return
    if (
      learnedWithExerciseWords[level][category][wordType].length ===
      wordList.length
    ) {
      document.getElementById(`levelTagExercise-${wordType}`).innerText = ''
      document.getElementById(`exerciseWord-${wordType}`).innerText = ''
      document.getElementById(`exerciseTranslation-${wordType}`).innerText = ''
      document.getElementById(
        `feedbackMessage-${wordType}`
      ).innerText = `You completed all exercise words! 🎉`
  
      if (wordType === 'noun') {
        buttonDer.style.visibility = 'hidden'
        buttonDie.style.visibility = 'hidden'
        buttonDas.style.visibility = 'hidden'
      } else if (['verb', 'adjective', 'adverb'].includes(wordType)) {
        buttonWrong.style.visibility =
          'hidden'
        buttonCorrect.style.visibility =
          'hidden'
      }
      return
    }
  
    // // reactivate buttons
    if (wordType === 'noun') {
      buttonDer.style.visibility = 'visible'
      buttonDie.style.visibility = 'visible'
      buttonDas.style.visibility = 'visible'
    } else if (['verb', 'adjective', 'adverb'].includes(wordType)) {
      buttonWrong.style.visibility =
        'visible'
      buttonCorrect.style.visibility =
        'visible'
    }
  
    // Index kontrolü
    if (currentIndex >= wordListExercise.length) {
      currentIndex = 0
      LocalStorageManager.save(CURRENT_EXERCISE_INDEX_KEY, currentIndex)
    }

    // 🟢 `wordList` içinden `learnedWords`'de olanları çıkar
    if (learnedWithExerciseWords[level][category][wordType].length > 0) {
      wordListExercise = wordListExercise.filter(
        (word) =>
          !learnedWithExerciseWords[level][category][wordType].some(
            (learned) => learned.almanca === word.almanca
          )
      )
      LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)
    }

  /* Önemsiz duruyor
    if (wordListExercise.length === 0) {
      document.getElementById(`levelTagExercise-${wordType}`).innerText = ''
      return
    }
  */
    const currentWord = wordListExercise[currentIndex]
    const progressWord = inProgressWords[level][category][wordType].find(
      (item) => item.almanca === currentWord.almanca
    )
  
    const { kelime, ingilizce, seviye } =
      currentWord
    // const renk = artikelRenk(artikel)
  
    // Kelimenin Almanca kısmını göster
    document.getElementById(`exerciseWord-${wordType}`).innerText = kelime
    document.getElementById(`levelTagExercise-${wordType}`).innerText =
      seviye || 'N/A'
  
    // İngilizce çeviriyi göster (ID üzerinden erişim)
    const exerciseTranslationElement = document.getElementById(
      `exerciseTranslation-${wordType}`
    )
    if (exerciseTranslationElement) {
      let exerciseTranslationText = ''
  
      if (wordType === 'noun') {
        exerciseTranslationText = ingilizce
      } else if (
        wordType === 'verb' ||
        wordType === 'adjective' ||
        wordType === 'adverb'
      ) {
        if (ExerciseUtils.shouldUseOwnMeaning()) {
          exerciseTranslationText = ingilizce
        } else {
          exerciseTranslationText = ExerciseUtils.getRandomTranslationResult(level, currentWord, staticWordLists, category)
          // todo: transfer data for checking the answer later
          const buttonWrong = document.getElementById(
            `wrongButton-${wordType}`
          )
          buttonWrong.setAttribute('wrong-but', true)
        }
      }
  
      exerciseTranslationElement.innerText = exerciseTranslationText
    } else {
      console.error('exerciseTranslation ID not found!')
    }
  
    if (progressWord) {
      const counter = progressWord.counter
      document.getElementById(`progressLeft-${wordType}`).style.opacity =
        counter >= 1 ? '1' : '0.5'
      document.getElementById(`progressMiddle-${wordType}`).style.opacity =
        counter >= 2 ? '1' : '0.5'
      document.getElementById(`progressRight-${wordType}`).style.opacity =
        counter >= 3 ? '1' : '0.5'
    } else {
      // Default state
      document.getElementById(`progressLeft-${wordType}`).style.opacity = '0.5'
      document.getElementById(`progressMiddle-${wordType}`).style.opacity =
        '0.5'
      document.getElementById(`progressRight-${wordType}`).style.opacity =
        '0.5'
    }
  
    // Default olarak boş bırakılan artikel alanı
    if (wordType === 'noun') {
      document.getElementById('correctAnswerField').innerHTML = '___'
    }
  
    document.getElementById(`feedbackMessage-${wordType}`).innerText = ''
  }