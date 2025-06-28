// /components/level/deckPractice/shared/learn.js
import { WordType } from '../../../../constants/props.js'
import { mountNoun } from '../learn/noun.js'
import { mountPreposition } from '../learn/preposition.js'

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

  // Route to appropriate renderer based on word type
  if (word.type === WordType.PREPOSITION) {
    // Default to preposition for now
    mountPreposition(word)
  } else if (word.type === WordType.NOUN) {
    mountNoun(word)
  } else if (word.type === WordType.VERB) {
    // todo: mount verb
  } else if (word.type === WordType.ADJECTIVE) {
    // todo: mount adjective
  } else if (word.type === WordType.ADVERB) {
    // todo: mount adverb
  } else {
    console.warn(`Word Type Not Supported: ${word.type}`)
  }

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
