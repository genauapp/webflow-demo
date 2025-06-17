// /components/microQuiz/shared/exercise.js
import { ExerciseType } from '../../../../constants/props.js'
import {
  mountGrammarExerciseCard,
} from '../exercise/grammarExerciseCard.js'

let els = {}

/** Initialize elements for exercise component */
function initElements() {
  els = {
    // Exercise card elements
    exerciseCard: () =>
      document.getElementById('micro-quiz-exercise-word-card'),
    currentIndexLabel: () =>
      document.getElementById('exercise-word-card-index-current'),
    lastIndexLabel: () =>
      document.getElementById('exercise-word-card-index-last'),
    wordType: () => document.getElementById('exercise-word-card-type'),
    wordText: () => document.getElementById('exercise-word-card-text'),

    // Options
    optionsContainer: () =>
      document.getElementById('exercise-options-container'),

    // Feedback elements
    feedbackContainer: () =>
      document.getElementById('exercise-feedback-container'),
    feedbackText: () => document.getElementById('exercise-feedback-text'),
    correctAnswer: () => document.getElementById('exercise-correct-answer'),

    // Progress elements
    //    progressText: () => document.getElementById('exercise-progress-text'),
    progressBarContainer: () =>
      document.getElementById('exercise-streak-progress-bar-container'),

    scoreText: () => document.getElementById('exercise-score-text'),
  }
}

/** Generate multiple choice options for a word */

function generateVocabularyOptions(correctWord, allWords, optionsCount = null) {
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

    button.addEventListener('click', () => {
      const isCorrect = option === correctWord

      // Show immediate feedback
      showVocabularyFeedback(isCorrect, correctWord, option)

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
        hideVocabularyFeedback()
      }, 1500)
    })

    container.appendChild(button)
  })
}

/** Render the streak bars into the progress bar container */
function renderStreakProgression(word, streakTarget) {
  const container = els.progressBarContainer()
  if (!container) return
  container.innerHTML = ''
  for (let i = 1; i <= streakTarget; i++) {
    const bar = document.createElement('div')
    bar.className = 'streak-progression-bar'
    if ((word.streak || 0) >= i) bar.classList.add('reached')
    container.appendChild(bar)
  }
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
function mountVocabularyExerciseCard(
  { streakTarget, currentWord: word, currentIndex, lastIndex, allWords, score },
  onAnswerCallback
) {
  if (!word || !allWords) return

  // Hide feedback from previous question
  hideVocabularyFeedback()

  // Update question and word

  if (els.wordText()) {
    els.wordText().textContent = word.german || word.text || word.turkish || ''
  }

  // Generate and render options with dynamic count (2-4)
  const options = generateVocabularyOptions(word, allWords, 3)
  renderVocabularyOptions(options, word, onAnswerCallback)
}

/** UPDATED: Main render function with exercise type routing */
function renderExerciseCard(
  {
    exerciseType,
    streakTarget,
    currentWord: word,
    currentIndex,
    lastIndex,
    allWords,
    score,
  },
  onAnswerCallback
) {
  if (!word || !allWords) return

  if (els.currentIndexLabel()) {
    els.currentIndexLabel().textContent = `${currentIndex}`
  }

  if (els.lastIndexLabel()) {
    els.lastIndexLabel().textContent = `${lastIndex}`
  }

  if (els.wordType()) {
    els.wordType().textContent = word.type || ''
  }

  // Route to appropriate renderer based on exercise type
  if (exerciseType === ExerciseType.VOCABULARY) {
    // Default to vocabulary exercise
    mountVocabularyExerciseCard(
      {
        streakTarget,
        currentWord: word,
        currentIndex,
        lastIndex,
        allWords,
        score,
      },
      onAnswerCallback
    )
  } else if (exerciseType === ExerciseType.GRAMMAR) {
    mountGrammarExerciseCard(
      {
        streakTarget,
        currentWord: word,
        currentIndex,
        lastIndex,
        allWords,
        score,
      },
      onAnswerCallback
    )
  }

  renderStreakProgression(word, streakTarget)

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

export function initExercise(exerciseState, onAnswerCallback) {
  // Initialize elements
  initElements()

  // Validate input
  // if (!currentWord || !allWords || allWords.length === 0) {
  //   hideExerciseCard()
  //   return
  // }

  renderExerciseCard(exerciseState, onAnswerCallback)
}
