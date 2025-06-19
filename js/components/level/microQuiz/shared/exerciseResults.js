// components/microQuiz/shared/exerciseResults.js

let els = {}

function initElements() {
  els = {
    // Main results container
    resultsContainer: () =>
      document.getElementById('micro-quiz-exercise-results-card'),

    // Header elements
    resultsTitle: () => document.getElementById('exercise-results-title'),
    resultsSubtitle: () => document.getElementById('exercise-results-subtitle'),

    // Good words section
    goodSection: () => document.getElementById('exercise-results-good-section'),
    goodSectionTitle: () =>
      document.getElementById('exercise-results-good-title'),
    goodWordsList: () => document.getElementById('exercise-results-good-list'),

    // Bad words section
    badSection: () => document.getElementById('exercise-results-bad-section'),
    badSectionTitle: () =>
      document.getElementById('exercise-results-bad-title'),
    badWordsList: () => document.getElementById('exercise-results-bad-list'),

    // Empty state
    emptyState: () => document.getElementById('exercise-results-empty-state'),
  }
}

function resetElements() {
  els = {}
}

function renderGoodWords(goodWords) {
  const container = els.goodWordsList()
  if (!container) return

  container.innerHTML = ''

  goodWords.forEach((word) => {
    const wordElement = document.createElement('div')
    wordElement.className = 'exercise-result-word-item good-word'

    const badge =
      word.wrongCount === 0 ? 'Perfect!' : `${word.wrongCount}x missed`
    const badgeClass = word.wrongCount === 0 ? 'perfect-badge' : 'miss-badge'

    wordElement.innerHTML = `
      <div class="word-content">
        <div class="word-text">${word.word || word.text || 'Word'}</div>
        <div class="word-translation">${
          word.translation || word.meaning || ''
        }</div>
      </div>
      <div class="${badgeClass}">${badge}</div>
    `

    container.appendChild(wordElement)
  })
}

function renderBadWords(badWords) {
  const container = els.badWordsList()
  if (!container) return

  container.innerHTML = ''

  badWords.forEach((word) => {
    const wordElement = document.createElement('div')
    wordElement.className = 'exercise-result-word-item bad-word'

    wordElement.innerHTML = `
      <div class="word-content">
        <div class="word-text">${word.word || word.text || 'Word'}</div>
        <div class="word-translation">${
          word.translation || word.meaning || ''
        }</div>
      </div>
      <div class="miss-badge">${word.wrongCount}x missed</div>
    `

    container.appendChild(wordElement)
  })
}

function showSection(section) {
  if (section) {
    section.style.display = 'block'
  }
}

function hideSection(section) {
  if (section) {
    section.style.display = 'none'
  }
}

function renderResults({ goodWords, badWords, totalWords, score }) {
  // Initialize elements
  initElements()

  // Update header
  if (els.resultsTitle()) {
    els.resultsTitle().textContent = 'Yay! You have completed the quiz!'
  }

  if (els.resultsSubtitle()) {
    els.resultsSubtitle().textContent = 'Here are your results'
  }

  // Handle good words section
  if (goodWords && goodWords.length > 0) {
    showSection(els.goodSection())
    renderGoodWords(goodWords)

    if (els.goodSectionTitle()) {
      els.goodSectionTitle().textContent = "🔥 You've got these!"
    }
  } else {
    hideSection(els.goodSection())
  }

  // Handle bad words section
  if (badWords && badWords.length > 0) {
    showSection(els.badSection())
    renderBadWords(badWords)

    if (els.badSectionTitle()) {
      els.badSectionTitle().textContent = '👀 Keep an eye on these'
    }
  } else {
    hideSection(els.badSection())
  }

  // Handle empty state (edge case: no words at all)
  if (
    (!goodWords || goodWords.length === 0) &&
    (!badWords || badWords.length === 0)
  ) {
    hideSection(els.goodSection())
    hideSection(els.badSection())
    showSection(els.emptyState())

    if (els.emptyState()) {
      els.emptyState().innerHTML = `
        <div class="celebration">🎉</div>
        <div>Amazing! You got everything right on the first try!</div>
      `
    }
  } else {
    hideSection(els.emptyState())
  }

  // Show the results container
  if (els.resultsContainer()) {
    els.resultsContainer().style.display = 'block'
  }
}

export function initExerciseResults(resultsData) {
  console.log('Exercise Results Data:', resultsData)

  if (!resultsData) {
    console.warn('No results data provided')
    return
  }

  renderResults(resultsData)
}

// Clean up function for when component unmounts
export function resetExerciseResults() {
  resetElements()
}
