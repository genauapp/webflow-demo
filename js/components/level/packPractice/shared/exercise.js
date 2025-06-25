// /components/level/packPractice/shared/exercise.js
import { ExerciseType } from '../../../../constants/props.js'
import { mountGrammarExerciseCard } from '../exercise/grammarExerciseCard.js'
import { mountVocabularyExerciseCard } from '../exercise/vocabularyExerciseCard.js'

let els = {}

/** Initialize elements for exercise component */
function initElements() {
  els = {
    // Exercise card elements
    exerciseCard: () =>
      document.getElementById('pack-practice-exercise-word-card'),

    // header
    currentIndexLabel: () =>
      document.getElementById('exercise-word-card-index-current'),
    lastIndexLabel: () =>
      document.getElementById('exercise-word-card-index-last'),
    wordType: () => document.getElementById('exercise-word-card-type'),

    // Progress elements
    //    progressText: () => document.getElementById('exercise-progress-text'),
    progressBarContainer: () =>
      document.getElementById('exercise-streak-progress-bar-container'),

    scoreText: () => document.getElementById('exercise-score-text'),
  }
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

/** UPDATED: Main render function with exercise type routing */
function renderExerciseCard(
  {
    exerciseType,
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
        options,
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
        options,
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

export function updateStreakProgression(word, streakTarget) {
  renderStreakProgression(word, streakTarget)
}
