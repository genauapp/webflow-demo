// /components/microQuiz/learn.js
let els = {}

/** Initialize elements for learn component */
function initElements() {
  els = {
    // Learn card elements
    wordCard: () => document.getElementById('learn-word-card'),
    wordText: () => document.getElementById('learn-word-text'),
    wordDefinition: () => document.getElementById('learn-word-definition'),
    wordExample: () => document.getElementById('learn-word-example'),
    wordPronunciation: () => document.getElementById('learn-word-pronunciation'),
    
    // Progress elements
    progressText: () => document.getElementById('learn-progress-text'),
    progressBar: () => document.getElementById('learn-progress-bar'),
  }
}

/** Render learn component with current word */
function renderLearnCard(word, currentIndex, totalWords) {
  if (!word) return
  
  // Update word content
  if (els.wordText()) {
    els.wordText().textContent = word.word || word.text || ''
  }
  
  if (els.wordDefinition()) {
    els.wordDefinition().textContent = word.definition || word.meaning || ''
  }
  
  if (els.wordExample()) {
    els.wordExample().textContent = word.example || ''
    els.wordExample().style.display = word.example ? 'block' : 'none'
  }
  
  if (els.wordPronunciation()) {
    els.wordPronunciation().textContent = word.pronunciation || ''
    els.wordPronunciation().style.display = word.pronunciation ? 'block' : 'none'
  }
  
  // Update progress
  if (els.progressText()) {
    els.progressText().textContent = `${currentIndex + 1} of ${totalWords}`
  }
  
  if (els.progressBar()) {
    const progressPercentage = ((currentIndex + 1) / totalWords) * 100
    els.progressBar().style.width = `${progressPercentage}%`
  }
  
  // Show the card
  if (els.wordCard()) {
    els.wordCard().style.display = 'block'
  }
}

/** Hide learn component */
function hideLearnCard() {
  if (els.wordCard()) {
    els.wordCard().style.display = 'none'
  }
}

/** Initialize learn component */
export function initLearn(words, currentIndex = 0) {
  // Initialize elements
  initElements()
  
  // Validate input
  if (!words || words.length === 0) {
    hideLearnCard()
    return
  }
  
  // Ensure currentIndex is within bounds
  const safeIndex = Math.max(0, Math.min(currentIndex, words.length - 1))
  const currentWord = words[safeIndex]
  
  // Render the current word
  renderLearnCard(currentWord, safeIndex, words.length)
}
