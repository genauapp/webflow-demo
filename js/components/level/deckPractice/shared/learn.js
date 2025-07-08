// /components/level/deckPractice/shared/learn.js
import { WordType } from '../../../../constants/props.js'
import { mountNoun } from '../learn/noun.js'
import { mountAdjective } from '../learn/adjective.js'
import { mountAdverb } from '../learn/adverb.js'
import { mountPreposition } from '../learn/preposition.js'
import { mountVerb } from '../learn/verb.js'

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

    // Verb-specific elements
    verb: {
      casesContainer: () =>
        document.getElementById('learn-verb-cases-container'),
    },
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

  // clear type-specific containers
  // // verb
  els.verb.casesContainer().style.display = 'none'

  // Route to appropriate renderer based on word type
  if (word.type === WordType.NOUN) {
    mountNoun(word)
  } else if (word.type === WordType.VERB) {
    els.verb.casesContainer().style.display = 'flex'
    mountVerb(word)
  } else if (word.type === WordType.ADJECTIVE) {
    mountAdjective(word)
  } else if (word.type === WordType.ADVERB) {
    mountAdverb(word)
  } else if (word.type === WordType.PREPOSITION) {
    mountPreposition(word)
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
