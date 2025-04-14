import { DEFAULT_VALUE, IN_PROGRESS_WORDS_KEY, WORD_LIST_EXERCISE_KEY, LEARNED_WITH_EXERCISE_WORDS_KEY, WORD_LIST_KEY, CURRENT_LEVEL_KEY, CURRENT_WORD_TYPE_KEY, CURRENT_CATEGORY_KEY, CURRENT_EXERCISE_INDEX_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import playSound from "./PlaySound.js"
import { showModalExercise } from "./ModalManager.js"
import showExerciseWord from "./ShowExerciseWord.js"
import { artikelRenk } from "./showLearnWord.js"

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
    if (
      !wordListExercise.length ||
      currentExerciseIndex >= wordListExercise.length
    ) {
      currentExerciseIndex = 0
      LocalStorageManager.save(CURRENT_EXERCISE_INDEX_KEY, currentExerciseIndex)
      return
    }
  
    const currentWord = wordListExercise[currentExerciseIndex]
    const { artikel, kural, kelime } = currentWord
    const buttonDer = document.getElementById('buttonDer')
    const buttonDie = document.getElementById('buttonDie')
    const buttonDas = document.getElementById('buttonDas')

    const inProgressIndex = inProgressWords[level][category][wordType].findIndex(
      (item) => item.almanca === currentWord.almanca
    )
  
    buttonDer.style.visibility = 'hidden'
    buttonDie.style.visibility = 'hidden'
    buttonDas.style.visibility = 'hidden'
  
    if (userArtikel.toLowerCase() === artikel.toLowerCase()) {
      document.getElementById(`feedbackMessage-${wordType}`).innerText =
        'Correct! 🎉'
      document.getElementById(`feedbackMessage-${wordType}`).style.color =
        'green'
  
      // Doğru artikeli göster
      const renk = artikelRenk(artikel)
      document.getElementById(
        'correctAnswerField'
      ).innerHTML = `<span style="color: ${renk};">${artikel}</span>`
  
      //InProgress listesine kelimeyi ekle - Eger hic dogru bilinmemisse yeni ekle daha önce bilinmisse progress i arttir
      if (inProgressIndex === -1) {
        playSound(
          'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/correct.mp3'
        )
        inProgressWords[level][category][wordType].push({
          type: currentWord.type,
          almanca: currentWord.almanca,
          counter: 1,
        })
        document.getElementById(`progressLeft-${wordType}`).style.opacity = '1'
        LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
        // Liste manipülasyonlarından sonra index kontrolü
        if (currentExerciseIndex >= wordListExercise.length) {
          currentExerciseIndex = 0
          LocalStorageManager.save(CURRENT_EXERCISE_INDEX_KEY, currentExerciseIndex)
        }
  
        wordListExercise.splice(currentExerciseIndex, 1);
        const randomPosition = Math.floor(Math.random() * (wordListExercise.length - currentExerciseIndex)) + currentExerciseIndex + 1;
        wordListExercise.splice(randomPosition, 0, currentWord);
        LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)
  
        currentExerciseIndex++
        if (currentExerciseIndex >= wordListExercise.length) {
          currentExerciseIndex = 0
        }
        LocalStorageManager.save(CURRENT_EXERCISE_INDEX_KEY, currentExerciseIndex)
      } else {
        inProgressWords[level][category][wordType][inProgressIndex].counter += 1
        if (
          inProgressWords[level][category][wordType][inProgressIndex].counter ===
          2
        ) {
          document.getElementById(`progressMiddle-${wordType}`).style.opacity =
            '1'
        }
        //3 kere bilindiyse learnede ekle
        if (
          inProgressWords[level][category][wordType][inProgressIndex].counter >= 3
        ) {
          playSound(
            'https://github.com/heroofdarkroom/proje/raw/refs/heads/master/streak.mp3'
          )
  
          learnedWithExerciseWords[level][category][wordType].push({
            type: currentWord.type,
            almanca: currentWord.almanca,
            ingilizce: currentWord.ingilizce,
            seviye: currentWord.seviye || 'N/A',
          })
  
          LocalStorageManager.save(LEARNED_WITH_EXERCISE_WORDS_KEY, learnedWithExerciseWords)
          
          document.getElementById(
            `feedbackMessage-${wordType}`
          ).innerText = `This word: ${currentWord.almanca} added to learned list!🏆`
          document.getElementById(
            `feedbackMessage-${wordType}`
          ).style.color = 'green'
          document.getElementById(
            `progressRight-${wordType}`
          ).style.opacity = '1'
  
          // if exercise is ended
          if (learnedWithExerciseWords[level][category][wordType].length === wordList.length) {
            showModalExercise('You completed all exercise words! 🎉', wordType)
          }
  
          // updateExerciseCounter(level, wordType, learnedWithExerciseWords)
          wordListExercise.splice(currentExerciseIndex, 1)
          if (currentExerciseIndex >= wordListExercise.length) {
            currentExerciseIndex =
              currentExerciseIndex % wordListExercise.length
            if (currentExerciseIndex == 0) {
              currentExerciseIndex++
            }
          }
          // inProgressWords.splice(inProgressIndex, 1); // inProgressWords'ten çıkar
          inProgressWords[level][category][wordType].splice(inProgressIndex, 1);
          LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords);
          LocalStorageManager.save(CURRENT_EXERCISE_INDEX_KEY, currentExerciseIndex)

          setTimeout(() => {
            showExerciseWord()
          }, 1000)
        }
      }
  
      setTimeout(() => {
        document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
        // buttonDer.style.visibility = 'visible'
        // buttonDie.style.visibility = 'visible'
        // buttonDas.style.visibility = 'visible'
        showExerciseWord()
      }, 1000)
      LocalStorageManager.save(
        LEARNED_WITH_EXERCISE_WORDS_KEY,
        learnedWithExerciseWords
      )
      LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
    } else {
      if (inProgressIndex !== -1) {
        
        wordListExercise.splice(currentExerciseIndex, 1)
        const randomPosition = Math.floor(Math.random() * (wordListExercise.length - currentExerciseIndex)) + currentExerciseIndex + 1;
        wordListExercise.splice(randomPosition, 0, currentWord);
        LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)
  
        inProgressWords[level][category][wordType][inProgressIndex].counter = 0
        document.getElementById(`progressRight-${wordType}`).style.opacity =
          '0.5'
        document.getElementById(`progressMiddle-${wordType}`).style.opacity =
          '0.5'
        document.getElementById(`progressLeft-${wordType}`).style.opacity =
          '0.5'
        LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
        currentExerciseIndex++
        if (currentExerciseIndex >= wordListExercise.length) {
          currentExerciseIndex =
            currentExerciseIndex % wordListExercise.length
          if (currentExerciseIndex == 0) {
            currentExerciseIndex++
          }
        }
        LocalStorageManager.save(CURRENT_EXERCISE_INDEX_KEY, currentExerciseIndex)
      } else {
        currentExerciseIndex++
        if (currentExerciseIndex >= wordListExercise.length) {
          currentExerciseIndex =
            currentExerciseIndex % wordListExercise.length
          if (currentExerciseIndex == 0) {
            currentExerciseIndex++
          }
        }
        LocalStorageManager.save(CURRENT_EXERCISE_INDEX_KEY, currentExerciseIndex)
      }
      document.getElementById(
        `feedbackMessage-${wordType}`
      ).innerText = `Upps! ⚠️ ${kural}`
      document.getElementById(`feedbackMessage-${wordType}`).style.color =
        'red'
      setTimeout(() => {
        document.getElementById('correctAnswerField').innerHTML = '___' // Tekrar boş bırak
        // buttonDer.style.visibility = 'visible'
        // buttonDie.style.visibility = 'visible'
        // buttonDas.style.visibility = 'visible'
        showExerciseWord()
      }, 3000)
    }
    console.log(`'${currentExerciseIndex}' index bu sayiya güncellendi.`)
    console.log(
      `'${wordListExercise.length}' liste uzunlugu bu sayiya güncellendi.`
    )
    LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
  }