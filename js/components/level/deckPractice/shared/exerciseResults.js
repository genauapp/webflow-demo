// components/level/deckPractice/shared/exerciseResults.js

import { CDN_BASE_URL } from '../../../../constants/urls.js'

let els = {}

function initElements() {
  els = {
    // Main results container
    resultsContainer: () =>
      document.getElementById('deck-practice-exercise-results-card'),

    // Header elements
    resultsTitle: () => document.getElementById('exercise-results-title'),
    resultsSubtitle: () => document.getElementById('exercise-results-subtitle'),

    // Good words section
    goodSection: () => document.getElementById('exercise-results-good-section'),
    goodSectionTitle: () =>
      document.getElementById('exercise-results-good-title'),
    goodWordsContent: () =>
      document.getElementById('exercise-results-good-content'),
    // goodWordsList: () => document.getElementById('exercise-results-good-list'),

    // Bad words section
    badSection: () => document.getElementById('exercise-results-bad-section'),
    badSectionTitle: () =>
      document.getElementById('exercise-results-bad-title'),
    badWordsContent: () =>
      document.getElementById('exercise-results-bad-content'),
    // badWordsList: () => document.getElementById('exercise-results-bad-list'),

    // Empty state
    emptyState: () => document.getElementById('exercise-results-empty-state'),
  }
}

function resetElements() {
  els = {}
}

function renderGoodWords(goodWords) {
  const container = els.goodWordsContent()
  if (!container) return

  container.innerHTML = ''

  goodWords.forEach((word) => {
    const wordElement = document.createElement('div')
    wordElement.className = 'exercise-result-word-item good-word'

    // const badge =
    //   word.wrongCount === 0 ? 'Perfect!' : `${word.wrongCount}x missed`
    // const badgeClass = word.wrongCount === 0 ? 'perfect-badge' : 'miss-badge'

    const iconSrc = `${CDN_BASE_URL}/svg/level/exercise/GoodWordIcon.svg`
    const iconAlt = 'good word'

    wordElement.innerHTML = `
      <img 
            src="${iconSrc}" 
            alt="${iconAlt}" 
            class="result-word-icon" 
      />
      <div class="word-content">
        <div class="word-text">${word.german || 'Word'}</div>
        <div class="word-translation">${word.english || ''}</div>
      </div>
      `
    // <div class="${badgeClass}">${badge}</div>

    container.appendChild(wordElement)
  })
}

function groupByWrongCount(words) {
  return words.reduce((groups, w) => {
    const key = w.wrongCount
    if (!groups[key]) groups[key] = []
    groups[key].push(w)
    return groups
  }, {})
}

function renderBadWords(badWords) {
  const container = els.badWordsContent()
  if (!container) return
  container.innerHTML = ''

  const groups = groupByWrongCount(badWords)

  // 1) Grab all counts as numbers, sort descending, take the first 5,
  // 2) then re‑sort that slice ascending
  const topFiveCounts = Object.keys(groups)
    .map(Number) // ["8","4","3","2"] → [8,4,3,2]
    .sort((a, b) => b - a) // → [8,4,3,2]
    .slice(0, 5) // → [8,4,3,2]  (if more, trims to 5)
    .sort((a, b) => a - b) // → [2,3,4,8]

  topFiveCounts.forEach((countKey) => {
    // Section container
    const section = document.createElement('div')
    section.className = 'bad-word-group'

    const wordList = document.createElement('div')
    wordList.className = 'bad-word-list'

    const iconSrc = `${CDN_BASE_URL}/svg/level/exercise/BadWordIcon.svg`
    const iconAlt = 'bad word'

    // Word list for this count
    groups[countKey].forEach((word) => {
      const wordEl = document.createElement('div')

      wordEl.className = 'exercise-result-word-item bad-word'
      wordEl.innerHTML = `
          <img 
            src="${iconSrc}" 
            alt="${iconAlt}" 
            class="result-word-icon" 
          />
          <div class="word-content">
            <div class="word-text">${word.german}</div>
            <div class="word-translation">${word.english}</div>
          </div>
        `
      wordList.appendChild(wordEl)
    })

    section.appendChild(wordList)

    // Wrong Count Badge shared with words with same wrongCount
    const wrongBadge = document.createElement('div')
    wrongBadge.className = 'miss-badge'
    wrongBadge.textContent = `${countKey}x missed`
    section.appendChild(wrongBadge)

    container.appendChild(section)
  })
}

function showSection(section) {
  if (section) {
    section.style.display = 'flex'
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
    els.resultsContainer().style.display = 'flex'
  }
}

export function initExerciseResults(resultsData) {
  // console.log('Exercise Results Data:', resultsData)

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
