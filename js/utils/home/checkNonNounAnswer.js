import { DEFAULT_VALUE, IN_PROGRESS_WORDS_KEY, WORD_LIST_EXERCISE_KEY, LEARNED_WITH_EXERCISE_WORDS_KEY, WORD_LIST_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import { showExerciseWord } from "../../pages/home.js"
import playSound from "./PlaySound.js"
import { showModalExercise } from "./ModalManager.js"


let currentExerciseIndex = 0
let totalWordsExercise = 0


export default function checkNonNounAnswer(isUserInputCorrect, level, wordType, category) {
    let wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
    let wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
    // Eğer liste boşsa veya index liste dışındaysa, işlemi durdur
    if (
        !wordListExercise.length ||
        currentExerciseIndex >= wordListExercise.length
    ) {
        currentExerciseIndex = 0
        return
    }

    let learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
    totalWordsExercise = wordList.length
    const inProgressWords = LocalStorageManager.load(IN_PROGRESS_WORDS_KEY, DEFAULT_VALUE.IN_PROGRESS_WORDS)
    const currentWord = wordListExercise[currentExerciseIndex]
    const buttonWrong = document.getElementById(`wrongButton-${wordType}`)
    const buttonCorrect = document.getElementById(`correctButton-${wordType}`)

    // is current word in inProgressWords
    const inProgressIndex = inProgressWords[level][category][wordType].findIndex(
        (item) => item.almanca === currentWord.almanca
    )

    buttonWrong.style.visibility = 'hidden'
    buttonCorrect.style.visibility = 'hidden'

    const isAnswerCorrect = !buttonWrong.hasAttribute('wrong-but')

    if (isUserInputCorrect === isAnswerCorrect) {
        document.getElementById(`feedbackMessage-${wordType}`).innerText =
            'Correct! 🎉'
        document.getElementById(`feedbackMessage-${wordType}`).style.color =
            'green'

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
            LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
            document.getElementById('progressLeft-' + wordType).style.opacity = '1'

            // Liste manipülasyonlarından sonra index kontrolü
            if (currentExerciseIndex >= wordListExercise.length) {
                currentExerciseIndex = 0
            }

            // Remove the current word from its current position in the exercise list
            // Calculate a random position to reinsert the current word back into the exercise list
            // The random position is between the current index and the end of the list
            // Reinsert the current word at the calculated random position
            wordListExercise.splice(currentExerciseIndex, 1);
            const randomPosition = Math.floor(Math.random() * (wordListExercise.length - currentExerciseIndex)) + currentExerciseIndex + 1;
            wordListExercise.splice(randomPosition, 0, currentWord);
            LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)

            currentExerciseIndex++
            if (currentExerciseIndex >= wordListExercise.length) {
                currentExerciseIndex = 0
            }
        } else {
            inProgressWords[level][category][wordType][inProgressIndex].counter += 1
            LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
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

                // if exercise is ended
                if (learnedWithExerciseWords[level][category][wordType].length === totalWordsExercise) {
                    showModalExercise('You completed all exercise words! 🎉', wordType)
                }
                document.getElementById(
                    `feedbackMessage-${wordType}`
                ).innerText = `This word: ${currentWord.almanca} added to learned list!🏆`
                document.getElementById(
                    `feedbackMessage-${wordType}`
                ).style.color = 'green'
                document.getElementById(
                    `progressRight-${wordType}`
                ).style.opacity = '1'

                // updateExerciseCounter(level, wordType, learnedWithExerciseWords)
                // Remove the current word from the exercise list
                wordListExercise.splice(currentExerciseIndex, 1)
                // Decrement the current exercise index
                currentExerciseIndex--
                // Ensure the current exercise index is within bounds
                if (currentExerciseIndex >= wordListExercise.length) {
                    currentExerciseIndex = currentExerciseIndex % wordListExercise.length
                    // If the index is zero, increment it to avoid out-of-bounds error
                    if (currentExerciseIndex == 0) {
                        currentExerciseIndex++
                    }
                }

                LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, wordListExercise)
                // Remove the current word from the inProgressWords list
                inProgressWords[level][category][wordType].splice(inProgressIndex, 1);
                LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords);

                setTimeout(() => {
                    showExerciseWord()
                }, 1000)
            }
        }

        LocalStorageManager.save(
            LEARNED_WITH_EXERCISE_WORDS_KEY,
            learnedWithExerciseWords
        )

        setTimeout(() => {
            showExerciseWord()
        }, 1000)

    } else {
        if (inProgressIndex !== -1) {
            wordListExercise.splice(currentExerciseIndex, 1)

            /*
            if (wordListExercise.length > currentExerciseIndex + 10) {
              wordListExercise.splice(currentExerciseIndex + 10, 0, currentWord)
            } else {
              wordListExercise.push(currentWord)
            }
            */

            const randomPosition = Math.floor(Math.random() * (wordListExercise.length - currentExerciseIndex)) + currentExerciseIndex + 1;
            wordListExercise.splice(randomPosition, 0, currentWord);

            inProgressWords[level][category][wordType][inProgressIndex].counter = 0
            document.getElementById(`progressRight-${wordType}`).style.opacity =
                '0.5'
            document.getElementById(`progressMiddle-${wordType}`).style.opacity =
                '0.5'
            document.getElementById(`progressLeft-${wordType}`).style.opacity =
                '0.5'

            currentExerciseIndex++
            if (currentExerciseIndex >= wordListExercise.length) {
                currentExerciseIndex =
                    currentExerciseIndex % wordListExercise.length
                if (currentExerciseIndex == 0) {
                    currentExerciseIndex++
                }
            }
        } else {
            currentExerciseIndex++
            if (currentExerciseIndex >= wordListExercise.length) {
                currentExerciseIndex =
                    currentExerciseIndex % wordListExercise.length
                if (currentExerciseIndex == 0) {
                    currentExerciseIndex++
                }
            }
        }
        LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
        document.getElementById(
            `feedbackMessage-${wordType}`
        ).innerText = `Upps! Try again. 💪`
        document.getElementById(`feedbackMessage-${wordType}`).style.color =
            'red'
        setTimeout(() => {

            showExerciseWord()
        }, 3000)
    }

    buttonWrong.removeAttribute('wrong-but')
    LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, inProgressWords)
}