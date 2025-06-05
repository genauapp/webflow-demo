// /components/microQuiz/exercise.js
let els = {}

/** Initialize elements for exercise component */
function initElements() {
  els = {
    // Exercise card elements
    exerciseCard: () => document.getElementById('exercise-word-card'),
    questionText: () => document.getElementById('exercise-question-text'),
    wordText: () => document.getElementById('exercise-word-text'),
    optionsContainer: () => document.getElementById('exercise-options-container'),
    
    // Feedback elements
    feedbackContainer: () => document.getElementById('exercise-feedback-container'),
    feedbackText: () => document.getElementById('exercise-feedback-text'),
    correctAnswer: () => document.getElementById('exercise-correct-answer'),
    
    // Progress elements
    progressText: () => document.getElementById('exercise-progress-text'),
    progressBar: () => document.getElementById('exercise-progress-bar'),
    scoreText: () => document.getElementById('exercise-score-text'),
  }
}

/** Generate multiple choice options for a word */
function generateOptions(correctWord, allWords, optionsCount = 4) {
  const options = [correctWord]
  const otherWords = allWords.filter(w => w !== correctWord)
  
  // Randomly select other options
  while (options.length < optionsCount && options.length < allWords.length) {
    const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)]
    if (!options.includes(randomWord)) {
      options.push(randomWord)
    }
  }
  
  // Shuffle the options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]]
  }
  
  return options
}

/** Render exercise options */
function renderOptions(options, correctWord, onOptionClick) {
  const container = els.optionsContainer()
  if (!container) return
  
  container.innerHTML = ''
  
  options.forEach((option, index) => {
    const button = document.createElement('button')
    button.className = 'exercise-option-btn'
    button.textContent = option.definition || option.meaning || option.word || option.text || ''
    button.setAttribute('data-word', JSON.stringify(option))
    button.setAttribute('data-correct', option === correctWord ? 'true' : 'false')
    
    button.addEventListener('click', () => {
      onOptionClick(option, option === correctWord)
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
    feedbackText.className = isCorrect ? 'feedback-correct' : 'feedback-incorrect'
  }
  
  if (correctAnswerEl && !isCorrect) {
    correctAnswerEl.textContent = `Correct answer: ${correctWord.definition || correctWord.meaning || ''}`
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
function renderExerciseCard(word, currentIndex, totalWords, allWords, score = { correct: 0, total: 0 }) {
  if (!word || !allWords) return
  
  // Hide feedback from previous question
  hideFeedback()
  
  // Update question and word
  if (els.questionText()) {
    els.questionText().textContent = 'Select the correct definition:'
  }
  
  if (els.wordText()) {
    els.wordText().textContent = word.word || word.text || ''
  }
  
  // Generate and render options
  const options = generateOptions(word, allWords)
  
  const onOptionClick = (selectedWord, isCorrect) => {
    // Update score
    score.total = currentIndex + 1
    if (isCorrect) {
      score.correct++
    }
    
    // Show feedback
    showFeedback(isCorrect, word, selectedWord)
    
    // Update score display
    updateScore(score)
    
    // Disable all option buttons
    const optionButtons = els.optionsContainer().querySelectorAll('.exercise-option-btn')
    optionButtons.forEach(btn => {
      btn.disabled = true
      if (btn.getAttribute('data-correct') === 'true') {
        btn.classList.add('correct-answer')
      } else if (btn === event.target) {
        btn.classList.add('selected-answer')
      }
    })
  }
  
  renderOptions(options, word, onOptionClick)
  
  // Update progress
  if (els.progressText()) {
    els.progressText().textContent = `${currentIndex + 1} of ${totalWords}`
  }
  
  if (els.progressBar()) {
    const progressPercentage = ((currentIndex + 1) / totalWords) * 100
    els.progressBar().style.width = `${progressPercentage}%`
  }
  
  // Update score
  updateScore(score)
  
  // Show the card
  if (els.exerciseCard()) {
    els.exerciseCard().style.display = 'block'
  }
}

/** Update score display */
function updateScore(score) {
  if (els.scoreText()) {
    const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
    els.scoreText().textContent = `Score: ${score.correct}/${score.total} (${percentage}%)`
  }
}

/** Hide exercise component */
function hideExerciseCard() {
  if (els.exerciseCard()) {
    els.exerciseCard().style.display = 'none'
  }
}

// Keep track of exercise score across sessions
let exerciseScore = { correct: 0, total: 0 }

/** Initialize exercise component */
export function initExercise(words, currentIndex = 0) {
  // Initialize elements
  initElements()
  
  // Validate input
  if (!words || words.length === 0) {
    hideExerciseCard()
    return
  }
  
  // Ensure currentIndex is within bounds
  const safeIndex = Math.max(0, Math.min(currentIndex, words.length - 1))
  const currentWord = words[safeIndex]
  
  // Reset score if we're starting over
  if (safeIndex === 0) {
    exerciseScore = { correct: 0, total: 0 }
  }
  
  // Render the current exercise
  renderExerciseCard(currentWord, safeIndex, words.length, words, exerciseScore)
}
