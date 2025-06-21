// /components/microQuiz/exercise/vocabularyExerciseCard.js

import {
  ExerciseType,
  ExerciseTypeSettingsMap,
} from '../../../../constants/props.js'

let els = {}

/** Initialize elements for exercise component */
function initElements() {
  els = {
    wordText: () => document.getElementById('exercise-word-card-text'),

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

/** Render exercise options */
function renderVocabularyOptions(options, correctWord, onAnswerCallback) {
  const container = els.optionsContainer()
  if (!container) return

  container.innerHTML = ''

  options.forEach((option, index) => {
    const button = document.createElement('button')
    button.className = 'action-button exercise-option-btn'

    button.textContent =
      option.english || option.definition || option.meaning || option.text || ''
    button.setAttribute('data-word', JSON.stringify(option))
    button.setAttribute(
      'data-correct',
      option === correctWord ? 'true' : 'false'
    )

    button.addEventListener('click', async () => {
      const isCorrect = option === correctWord

      // 1) show feedback immediately
      showVocabularyFeedback(isCorrect, correctWord, option)

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
      hideVocabularyFeedback()
    })

    container.appendChild(button)
  })
}

/** Show feedback */
function showVocabularyFeedback(isCorrect, correctWord, selectedWord) {
  const feedbackContainer = els.feedbackContainer()
  const feedbackText = els.feedbackText()
  const correctAnswerEl = els.correctAnswer()

  if (!feedbackContainer) return

  feedbackContainer.style.display = 'block'

  if (feedbackText) {
    feedbackText.textContent = isCorrect ? 'Correct!' : 'Incorrect!'
    feedbackText.className = isCorrect
      ? 'feedback-correct'
      : 'feedback-incorrect'
  }

  if (correctAnswerEl && !isCorrect) {
    correctAnswerEl.textContent = `Correct answer: ${
      correctWord.definition || correctWord.meaning || ''
    }`
    correctAnswerEl.style.display = 'block'
  } else if (correctAnswerEl) {
    correctAnswerEl.style.display = 'none'
  }
}

/** Hide feedback */
function hideVocabularyFeedback() {
  const feedbackContainer = els.feedbackContainer()
  if (feedbackContainer) {
    feedbackContainer.style.display = 'none'
  }
}

/** Render vocabulary card */
function renderVocabularyExerciseCard(
  {
    streakTarget,
    currentWord: word,
    options,
    currentIndex,
    lastIndex,
    allWords,
    score,
  },
  onAnswerCallback
) {
  if (!word || !options) return

  // Hide feedback from previous question
  hideVocabularyFeedback()

  // Update question and word
  if (els.wordText()) {
    els.wordText().textContent = word.german || word.text || word.turkish || ''
  }

  renderVocabularyOptions(options, word, onAnswerCallback)
}

export function mountVocabularyExerciseCard(exerciseState, onAnswerCallback) {
  // Initialize elements
  initElements()

  renderVocabularyExerciseCard(exerciseState, onAnswerCallback)
}
