// /components/microQuiz/exercise/grammarExerciseCard.js
import {
  ExerciseType,
  ExerciseTypeSettingsMap,
} from '../../../../constants/props.js'
import ListUtils from '../../../../utils/ListUtils.js'

let els = {}

/** Initialize elements for exercise component */
function initElements() {
  els = {
    grammarSentenceContainer: () =>
      document.getElementById('exercise-grammar-sentence-container'),
    grammarSentence: () => document.getElementById('exercise-grammar-sentence'),
    grammarBlank: () => document.getElementById('exercise-grammar-blank'),

    // Options
    optionsContainer: () =>
      document.getElementById('exercise-options-container'),

    // Feedback elements
    feedbackContainer: () =>
      document.getElementById('exercise-feedback-container'),
    feedbackText: () => document.getElementById('exercise-feedback-text'),
    correctAnswer: () => document.getElementById('exercise-correct-answer'),
  }
}

/** NEW: Parse sentence and extract German word */
function parseSentence(sentence, germanWord) {
  const index = sentence.indexOf(germanWord)
  if (index === -1) {
    return { before: sentence, after: '', found: false }
  }

  const before = sentence.substring(0, index).trim()
  const after = sentence.substring(index + germanWord.length).trim()

  return { before, after, found: true }
}

/** NEW: Generate options for grammar exercise */
function generateGrammarOptions(correctWord, allWords, optionsCount) {
  const options = [correctWord]
  const otherWords = allWords.filter((w) => w.german !== correctWord.german)

  // Randomly select other German words
  while (options.length < optionsCount && options.length < allWords.length) {
    const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)]
    if (!options.includes(randomWord)) {
      options.push(randomWord)
    }
  }

  // Shuffle the options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[options[i], options[j]] = [options[j], options[i]]
  }

  return options
}

/** NEW: Render grammar exercise options */
function renderGrammarOptions(options, correctWord, onAnswerCallback) {
  const container = els.optionsContainer()
  if (!container) return

  container.innerHTML = ''

  options.forEach((option, index) => {
    const button = document.createElement('button')
    button.className = 'action-button exercise-option-btn'

    button.textContent = option.german || option.text || ''
    button.setAttribute('data-word', JSON.stringify(option))
    button.setAttribute(
      'data-correct',
      option === correctWord ? 'true' : 'false'
    )

    button.addEventListener('click', () => {
      const isCorrect = option === correctWord

      // Fill the blank with selected answer
      if (els.grammarBlank()) {
        const blank = els.grammarBlank()
        blank.textContent = option.german || option.text || ''
        blank.classList.remove(
          'exercise-grammar-blank-correct',
          'exercise-grammar-blank-incorrect'
        )

        blank.classList.add(
          isCorrect
            ? 'exercise-grammar-blank-correct'
            : 'exercise-grammar-blank-incorrect'
        )
      }

      // Show immediate feedback
      showGrammarFeedback(isCorrect, correctWord, option)

      // Disable all buttons
      const allButtons = container.querySelectorAll('.exercise-option-btn')
      allButtons.forEach((btn) => {
        btn.disabled = true
        if (btn.getAttribute('data-correct') === 'true') {
          btn.classList.add('correct-answer')
        } else if (btn === button) {
          btn.classList.add('selected-answer')
        }
      })

      // Call navigation service after a short delay for user to see feedback
      setTimeout(() => {
        onAnswerCallback(isCorrect)
        hideGrammarFeedback()
      }, 1500)
    })

    container.appendChild(button)
  })
}

/** NEW: Show grammar-specific feedback */
function showGrammarFeedback(isCorrect, correctWord, selectedWord) {
  const feedbackContainer = els.feedbackContainer()
  const feedbackText = els.feedbackText()
  const correctAnswerEl = els.correctAnswer()

  if (!feedbackContainer) return

  feedbackContainer.style.display = 'block'
  feedbackContainer.classList.remove('feedback-correct', 'feedback-incorrect')

  if (feedbackContainer && feedbackText) {
    feedbackContainer.classList.add(
      isCorrect ? 'feedback-correct' : 'feedback-incorrect'
    )
    feedbackText.textContent = isCorrect
      ? 'Correct! 🎉'
      : `✨ No worries! ${correctWord.rule || ''}`
  }

  if (correctAnswerEl && !isCorrect) {
    correctAnswerEl.textContent = `Correct answer: ${correctWord.german || ''}`
    correctAnswerEl.style.display = 'block'
  } else if (correctAnswerEl) {
    correctAnswerEl.style.display = 'none'
  }
}

/** NEW: Hide grammar feedback and reset blank */
function hideGrammarFeedback() {
  const feedbackContainer = els.feedbackContainer()
  if (feedbackContainer) {
    feedbackContainer.style.display = 'none'
  }

  // Reset blank for next question
  const blank = els.grammarBlank()
  if (blank) {
    blank.textContent = ' ______ '
    blank.className = 'grammar-blank'
  }
}

/** NEW: Render grammar exercise card */
function renderGrammarExerciseCard(
  { currentWord: word, currentIndex, lastIndex, allWords, score },
  optionsCount,
  onAnswerCallback
) {
  if (!word || !allWords) return

  // Hide feedback from previous question
  hideGrammarFeedback()

  // Parse the sentence
  const { before, after, found } = parseSentence(
    word.example || '',
    word.german || ''
  )

  // if (!found) {
  //   // Fallback to regular vocabulary mode if parsing fails
  //   renderVocabularyExerciseCard(
  //     {
  //       streakTarget,
  //       currentWord: word,
  //       currentIndex,
  //       lastIndex,
  //       allWords,
  //       score,
  //     },
  //     onAnswerCallback
  //   )
  //   return
  // }

  // Show grammar sentence elements
  if (els.grammarSentenceContainer()) {
    els.grammarSentenceContainer().style.display = 'flex'
  }

  const sentenceEl = els.grammarSentence()
  sentenceEl.style.display = 'flex'
  // generate span in here
  const blankElStr = `<span id="exercise-grammar-blank" class="exercise-grammar-sentence grammar-blank"> ______ </span>`
  sentenceEl.innerHTML = `${before} ${blankElStr} ${after}`

  // Generate options from German words
  const options = generateGrammarOptions(word, allWords, optionsCount)
  renderGrammarOptions(options, word, onAnswerCallback)
}

export function mountGrammarExerciseCard(exerciseState, onAnswerCallback) {
  // Initialize elements
  initElements()

  const optionsCount =
    ExerciseTypeSettingsMap[ExerciseType.GRAMMAR].optionsCount

  renderGrammarExerciseCard(exerciseState, optionsCount, onAnswerCallback)
}
