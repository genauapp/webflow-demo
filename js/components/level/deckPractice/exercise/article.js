// /components/level/deckPractice/exercise/article.js
import { NounArticleColorMap } from '../../../../constants/props.js'
import StringUtils from '../../../../utils/StringUtils.js'

let els = {}

/** Initialize elements for exercise component */
function initElements() {
  els = {
    wordText: () => document.getElementById('exercise-article-word-text'),
    wordEnglish: () => document.getElementById('exercise-article-word-english'),

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

/** Render article exercise options */
function renderArticleOptions(options, correctWord, onAnswerCallback) {
  const container = els.optionsContainer()
  if (!container) return

  container.innerHTML = ''

  options.forEach((option, index) => {
    const button = document.createElement('button')
    button.className = 'action-button exercise-option-btn'

    button.textContent = option.article

    // Apply color styling based on article
    const color =
      NounArticleColorMap[option.article] || NounArticleColorMap.default
    button.style.color = color
    button.style.borderColor = color

    button.setAttribute('data-option', JSON.stringify(option))
    button.setAttribute('data-correct', option.isCorrect ? 'true' : 'false')

    // Prevent focus on mobile to avoid state persistence
    button.addEventListener('touchstart', (e) => {
      e.target.blur()
    })

    button.addEventListener('click', async () => {
      const isCorrect = option.isCorrect

      // Immediately blur this button to prevent focus retention
      button.blur()

      // 1) show feedback immediately
      showArticleFeedback(isCorrect, correctWord, option.article)

      // If correct, prepend article to word text with color
      if (isCorrect && els.wordText()) {
        const wordEl = els.wordText()
        wordEl.textContent = `${correctWord.article} ${StringUtils.capitalize(
          correctWord.german
        )}`
        wordEl.style.color =
          NounArticleColorMap[correctWord.article] ||
          NounArticleColorMap['default']
      }

      // disable all buttons
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
      hideArticleFeedback()
    })

    container.appendChild(button)
  })

  // Clear any residual focus immediately after rendering
  document.activeElement?.blur()
}

/** Show article-specific feedback */
function showArticleFeedback(isCorrect, correctWord, selectedArticle) {
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
      : // : `No worries! Let's try again 💪`
      correctWord.rule && correctWord.rule.length !== 0
      ? correctWord.rule
      : `No worries! Let's try again 💪`
  }

  if (correctAnswerEl && !isCorrect) {
    correctAnswerEl.textContent = `Correct answer: ${correctWord.article || ''}`
    correctAnswerEl.style.display = 'block'
  } else if (correctAnswerEl) {
    correctAnswerEl.style.display = 'none'
  }
}

/** Hide article feedback */
function hideArticleFeedback() {
  const feedbackContainer = els.feedbackContainer()
  if (feedbackContainer) {
    feedbackContainer.style.display = 'none'
  }
}

/** Render article exercise card */
function renderArticle(
  { currentWord: word, options, currentIndex, lastIndex, allWords, score },
  onAnswerCallback
) {
  if (!word || !options) return

  // Hide feedback from previous question
  hideArticleFeedback()

  // Update question and word
  if (els.wordText()) {
    els.wordText().textContent = `___ ${StringUtils.capitalize(word.german)}`
    els.wordText().style.color = NounArticleColorMap['default']
  }
  // Update English word
  if (els.wordEnglish()) {
    els.wordEnglish().textContent = word.english || ''
    // els.wordEnglish().style.display = 'flex'
  }

  renderArticleOptions(options, word, onAnswerCallback)
}

export function mountArticle(exerciseState, onAnswerCallback) {
  // Initialize elements
  initElements()

  renderArticle(exerciseState, onAnswerCallback)
}
