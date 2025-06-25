// /components/microQuiz/exercise/grammarExerciseCard.js
import StringUtils from '../../../../utils/StringUtils.js'

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

/** Parse sentence and extract German word */
function parseSentence(sentence, germanWord) {
  const lower = germanWord
  const cap = StringUtils.capitalize(germanWord)

  // try lowercase first, then capitalized
  let index = sentence.indexOf(lower)
  let match = lower
  let isCapitalized = false

  if (index === -1) {
    index = sentence.indexOf(cap)
    match = cap
    isCapitalized = true
  }

  // if neither of them are found, early return
  if (index === -1) {
    return { before: sentence, after: '', found: false, isCapitalized: false }
  }

  const before = sentence.substring(0, index).trim()
  const after = sentence.substring(index + match.length).trim()
  return { before, after, found: true, isCapitalized }
}

/** Render grammar exercise options */
function renderGrammarOptions(
  options,
  correctWord,
  onAnswerCallback,
  isCapitalized
) {
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

    button.addEventListener('click', async () => {
      const isCorrect = option === correctWord

      // 1) show blank + feedback immediately
      // // fill the blank with selected answer
      if (els.grammarBlank()) {
        const blank = els.grammarBlank()
        blank.classList.remove(
          'exercise-grammar-blank-correct',
          'exercise-grammar-blank-incorrect'
        )

        // Get the word text and apply capitalization if needed
        const wordText = option.german || option.text || ''
        const displayText = isCapitalized
          ? StringUtils.capitalize(wordText)
          : wordText

        blank.textContent = displayText

        blank.classList.add(
          isCorrect
            ? 'exercise-grammar-blank-correct'
            : 'exercise-grammar-blank-incorrect'
        )
      }
      // // show feedback
      showGrammarFeedback(isCorrect, correctWord, option)

      // // disable all buttons
      const allButtons = container.querySelectorAll('.exercise-option-btn')
      allButtons.forEach((btn) => {
        btn.disabled = true
        if (btn.getAttribute('data-correct') === 'true') {
          btn.classList.add('correct-answer')
        } else if (btn === button) {
          btn.classList.add('selected-answer')
        }
      })

      // 2) await the service taking its own delay then updating state
      await onAnswerCallback(isCorrect)

      // 3) hide feedback after service has done its update+delay
      hideGrammarFeedback()
    })

    container.appendChild(button)
  })
}

/** Show grammar-specific feedback */
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
      : `No worries! Let’s try again 💪` // ${correctWord.rule || ''}`
  }

  if (correctAnswerEl && !isCorrect) {
    correctAnswerEl.textContent = `Correct answer: ${correctWord.german || ''}`
    correctAnswerEl.style.display = 'block'
  } else if (correctAnswerEl) {
    correctAnswerEl.style.display = 'none'
  }
}

/** Hide grammar feedback and reset blank */
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

/** Render grammar exercise card */
function renderGrammarExerciseCard(
  { currentWord: word, options, currentIndex, lastIndex, allWords, score },
  onAnswerCallback
) {
  if (!word || !options) return

  // Hide feedback from previous question
  hideGrammarFeedback()

  // Parse the sentence (also learn if it was capitalized)
  const { before, after, found, isCapitalized } = parseSentence(
    word.example || '',
    word.german || ''
  )

  // Show grammar sentence elements
  if (els.grammarSentenceContainer()) {
    els.grammarSentenceContainer().style.display = 'flex'
  }

  const sentenceEl = els.grammarSentence()
  sentenceEl.style.display = 'flex'
  // generate span in here
  const blankElStr = `<span id="exercise-grammar-blank" class="exercise-grammar-sentence grammar-blank"> ______ </span>`
  sentenceEl.innerHTML = `${before} ${blankElStr} ${after}`

  renderGrammarOptions(options, word, onAnswerCallback, isCapitalized)
}

export function mountGrammarExerciseCard(exerciseState, onAnswerCallback) {
  // Initialize elements
  initElements()

  renderGrammarExerciseCard(exerciseState, onAnswerCallback)
}
