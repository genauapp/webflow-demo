// /components/microQuiz/exercise.js
let els = {}

/** Initialize elements for exercise component */
function initElements() {
  els = {
    // Exercise card elements

    exerciseCard: () =>
      document.getElementById('micro-quiz-exercise-word-card'),
    currentIndexLabel: () =>
      document.getElementById('exercise-word-card-index-current'),
    totalIndexLabel: () =>
      document.getElementById('exercise-word-card-index-total'),

    wordType: () => document.getElementById('learn-word-card-type'),
    wordText: () => document.getElementById('exercise-word-card-text'),
    optionsContainer: () =>
      document.getElementById('exercise-options-container'),

    // Feedback elements
    feedbackContainer: () =>
      document.getElementById('exercise-feedback-container'),
    feedbackText: () => document.getElementById('exercise-feedback-text'),
    correctAnswer: () => document.getElementById('exercise-correct-answer'),

    // Progress elements
    //    progressText: () => document.getElementById('exercise-progress-text'),
    //    progressBar: () => document.getElementById('exercise-progress-bar'),

    scoreText: () => document.getElementById('exercise-score-text'),
  }
}

/** Generate multiple choice options for a word */

function generateOptions(correctWord, allWords, optionsCount = null) {
  // Dynamic option count (2-4) if not specified
  if (optionsCount === null) {
    optionsCount = Math.floor(Math.random() * 3) + 2 // 2, 3, or 4 options
  }

  const options = [correctWord]
  const otherWords = allWords.filter((w) => w.german !== correctWord.german)

  // Randomly select other options
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

/** Render exercise options */
function renderOptions(options, correctWord, onAnswerCallback) {
  const container = els.optionsContainer()
  if (!container) return

  container.innerHTML = ''

  options.forEach((option, index) => {
    const button = document.createElement('button')
    button.className = 'w-button exercise-option-btn'

    button.textContent =
      option.english || option.definition || option.meaning || option.text || ''
    button.setAttribute('data-word', JSON.stringify(option))
    button.setAttribute(
      'data-correct',
      option === correctWord ? 'true' : 'false'
    )

    button.addEventListener('click', () => {
      const isCorrect = option === correctWord

      // Show immediate feedback
      showFeedback(isCorrect, correctWord, option)

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
        hideFeedback()
      }, 1500)
    })

    container.appendChild(button)
  })
}

/** Show feedback */
function showFeedback(isCorrect, correctWord, selectedWord) {
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
function hideFeedback() {
  const feedbackContainer = els.feedbackContainer()
  if (feedbackContainer) {
    feedbackContainer.style.display = 'none'
  }
}

/** Render exercise component with current word */

function renderExerciseCard(
  word,
  currentIndex,
  totalWords,
  score,
  allWords,
  onAnswerCallback
) {
  if (!word || !allWords) return

  // Hide feedback from previous question
  hideFeedback()

  if (els.currentIndexLabel()) {
    els.currentIndexLabel().textContent = `${currentIndex}`
  }

  if (els.totalIndexLabel()) {
    els.totalIndexLabel().textContent = `${totalWords}`
  }

  // Update question and word
  if (els.wordType()) {
    els.wordType().textContent = word.type || ''
  }

  if (els.wordText()) {
    els.wordText().textContent = word.word || word.text || word.turkish || ''
  }

  // Generate and render options with dynamic count (2-4)
  const options = generateOptions(word, allWords)
  renderOptions(options, word, onAnswerCallback)

  // Update score
  updateScore(score)

  // // Show the card
  // if (els.exerciseCard()) {
  //   els.exerciseCard().style.display = 'block'
  // }
}

/** Update score display */
function updateScore(score) {
  if (els.scoreText()) {
    const percentage =
      score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
    els.scoreText().textContent = `Score: ${score.correct}/${score.total} (${percentage}%)`
  }
}

/** Hide exercise component */
function hideExerciseCard() {
  if (els.exerciseCard()) {
    els.exerciseCard().style.display = 'none'
  }
}

/** Initialize exercise component */

export function initExercise(
  currentWord,
  currentIndex,
  totalWords,
  score,
  allWords,
  onAnswerCallback
) {
  // Initialize elements
  initElements()

  // Validate input
  // if (!currentWord || !allWords || allWords.length === 0) {
  //   hideExerciseCard()
  //   return
  // }

  renderExerciseCard(
    currentWord,
    currentIndex,
    totalWords,
    score,
    allWords,
    onAnswerCallback
  )
}
