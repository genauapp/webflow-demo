// /components/microQuiz/learn.js
let els = {}

/** Initialize elements for learn component */
function initElements() {
  els = {
    // Learn card elements
    wordCard: () => document.getElementById('learn-word-card'),
    // Progress elements
    currentIndexLabel: () =>
      document.getElementById('learn-word-card-index-current'),
    totalIndexLabel: () =>
      document.getElementById('learn-word-card-index-total'),
    wordLevel: () => document.getElementById('learn-word-card-level'),
    wordType: () => document.getElementById('learn-word-card-type'),
    wordText: () => document.getElementById('learn-word-card-text'),
    wordTranslation: () =>
      document.getElementById('learn-word-card-translation'),
    wordExample: () => document.getElementById('learn-word-card-example'),
  }
}

/** Render learn component with current word */
function renderLearnCard(word, currentIndex, totalIndex) {
  if (!word) return

  // Update progress
  els.currentIndexLabel().textContent = `${currentIndex}`
  els.totalIndexLabel().textContent = `${totalIndex}`

  els.wordLevel().textContent = word.level || ''
  els.wordType().textContent = word.type || ''
  els.wordText().textContent = word.word || ''
  els.wordTranslation().textContent = word.english || ''

  els.wordExample().textContent = word.example || ''
  els.wordExample().style.display = word.example ? 'block' : 'none'

  // // Show the card
  // if (els.wordCard()) {
  //   els.wordCard().style.display = 'block'
  // }
}

/** Hide learn component */
// function hideLearnCard() {
//   if (els.wordCard()) {
//     els.wordCard().style.display = 'none'
//   }
// }

/** Initialize learn component */
export function initLearn(currentWord, currentIndex, totalIndex) {
  // Initialize elements
  initElements()

  // // Validate input
  // if (!words || words.length === 0) {
  //   hideLearnCard()
  //   return
  // }

  // // Ensure currentIndex is within bounds
  // const safeIndex = Math.max(0, Math.min(currentIndex, words.length - 1))
  // const currentWord = words[safeIndex]

  // Render the current word
  renderLearnCard(currentWord, currentIndex, totalIndex)
}
