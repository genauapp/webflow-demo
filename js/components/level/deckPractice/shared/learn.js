// /components/level/deckPractice/shared/learn.js
import { PrepositionCaseColorMap } from '../../../../constants/props.js'

let els = {}

/** Initialize elements for learn component */
function initElements() {
  els = {
    // Learn card elements
    wordCard: () => document.getElementById('learn-word-card'),
    // Progress elements
    currentIndexLabel: () =>
      document.getElementById('learn-word-card-index-current'),
    lastIndexLabel: () => document.getElementById('learn-word-card-index-last'),
    // wordLevel: () => document.getElementById('learn-word-card-level'),
    wordType: () => document.getElementById('learn-word-card-type'),
    wordText: () => document.getElementById('learn-word-card-text'),
    wordTranslation: () =>
      document.getElementById('learn-word-card-translation'),
    wordExample: () => document.getElementById('learn-word-card-example'),
    wordRule: () => document.getElementById('learn-word-card-rule'),
  }
}

/** Render learn component with current word */
function renderLearnCard({ currentWord: word, currentIndex, lastIndex }) {
  if (!word) return

  // Update progress
  els.currentIndexLabel().textContent = `${currentIndex}`
  els.lastIndexLabel().textContent = `${lastIndex}`

  // els.wordLevel().textContent = word.level || ''
  els.wordType().textContent = word.type || ''
  els.wordText().textContent = word.german || ''
  els.wordText().style.color = PrepositionCaseColorMap[word.case]
  els.wordTranslation().textContent = word.english || ''

  // els.wordExample().textContent = word.example || '' // disable when exercise type is grammar?? 
  // els.wordExample().style.display = word.example ? 'block' : 'none'

  els.wordRule().textContent = word.rule || ''

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
export function initLearn(learnState) {
  // Initialize elements
  initElements()

  // Render the current word
  renderLearnCard(learnState)
}
