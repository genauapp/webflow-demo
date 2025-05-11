import { DEFAULT_VALUE, IN_PROGRESS_WORDS_KEY, WORD_LIST_EXERCISE_KEY, CURRENT_CATEGORY_KEY, CURRENT_LEVEL_KEY, LEARNED_WITH_EXERCISE_WORDS_KEY, CURRENT_WORD_TYPE_KEY, TOTAL_WORD_EXERCISE_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import ExerciseUtils from "./ExerciseUtils.js"
import { hideFinishScreen, showFinishScreen } from "./UIUtils.js"

export default function showExerciseWord() {
    let wordListExercise= LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
    const currentLevel = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
    const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
    const inProgressWords = LocalStorageManager.load(IN_PROGRESS_WORDS_KEY, DEFAULT_VALUE.IN_PROGRESS_WORDS)
    const totalWordsExercise = LocalStorageManager.load(TOTAL_WORD_EXERCISE_KEY, DEFAULT_VALUE.TOTAL_WORD_EXERCISE)
    // updated indexes
    document.getElementById(
      `remainingWordsCountExercise-${wordType}`
    ).innerText = learnedWithExerciseWords[currentLevel][category][wordType].length
    document.getElementById('totalWordsCountExercise-' + wordType).innerText =
      totalWordsExercise
  
    const buttonDer = document.getElementById('buttonDer')
    const buttonDie = document.getElementById('buttonDie')
    const buttonDas = document.getElementById('buttonDas')
    const buttonWrong = document.getElementById(`wrongButton-${wordType}`)
    const buttonCorrect = document.getElementById(`correctButton-${wordType}`)
  
    // max index -> hiding buttons, early return
    if (learnedWithExerciseWords[currentLevel][category][wordType].length === totalWordsExercise) {
      showFinishScreen()
      // Trigger Payment Modal
      const paymentTriggerCount = LocalStorageManager.load("PAYMENT_TRIGGER_COUNTER")
        if(paymentTriggerCount.exercise == 0) {
            showPaymentContainerModal()
            const updatedPaymentTriggerCount = {
                ...paymentTriggerCount,
                exercise : paymentTriggerCount.exercise + 1
            }
            LocalStorageManager.save("PAYMENT_TRIGGER_COUNTER", updatedPaymentTriggerCount)
        }        
      return
    }

    hideFinishScreen()

    document.getElementById(`remainingWordsCountExercise-${wordType}`).innerText = learnedWithExerciseWords[currentLevel][category][wordType].length
    document.getElementById(`totalWordsCountExercise-${wordType}`).innerText = totalWordsExercise
  
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

    // 🟢 `wordList` içinden `learnedWords`'de olanları çıkar
    if (learnedWithExerciseWords[currentLevel][category][wordType].length > 0) {
      wordListExercise = wordListExercise.filter(
        (word) =>
          !learnedWithExerciseWords[currentLevel][category][wordType].some(
            (learned) => learned.german === word.german
          )
      )
      LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)
    }

    const currentWord = wordListExercise[0]
    const progressWord = inProgressWords[currentLevel][category][wordType].find(
      (item) => item.german === currentWord.german
    )
  
    const { word, english, level } =
      currentWord
    // const renk = artikelRenk(artikel)
  
    // wordnin german kısmını göster
    document.getElementById(`exerciseWord-${wordType}`).innerText = word
    document.getElementById(`levelTagExercise-${wordType}`).innerText =
      level || 'N/A'
  
    // İngilizce çeviriyi göster (ID üzerinden erişim)
    const exerciseTranslationElement = document.getElementById(`exerciseTranslation-${wordType}`)
    if (exerciseTranslationElement) {
      let exerciseTranslationText = ''
  
      if (wordType === 'noun') {
        exerciseTranslationText = english
      } else if (
        wordType === 'verb' ||
        wordType === 'adjective' ||
        wordType === 'adverb'
      ) {
        if (ExerciseUtils.shouldUseOwnMeaning()) {
          exerciseTranslationText = english
        } else {
          exerciseTranslationText = ExerciseUtils.getRandomTranslationResult()
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
      document.getElementById(`progressMiddle-${wordType}`).style.opacity = '0.5'
      document.getElementById(`progressRight-${wordType}`).style.opacity = '0.5'
    }
  
    // Default olarak boş bırakılan artikel alanı
    if (wordType === 'noun') {
      document.getElementById('correctAnswerField').innerHTML = '___'
    }
  
    document.getElementById(`feedbackMessage-${wordType}`).innerText = ''
  }