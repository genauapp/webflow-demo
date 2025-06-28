// /components/level/deckPractice/learn/preposition.js
import { PrepositionCaseColorMap } from '../../../../constants/props'

let els = {}

/** Initialize elements for preposition component */
function initElements() {
  els = {
    wordText: () => document.getElementById('learn-word-card-text'),
    wordTranslation: () =>
      document.getElementById('learn-word-card-translation'),
    wordExample: () => document.getElementById('learn-word-card-example'),
    wordRule: () => document.getElementById('learn-word-card-rule'),
  }
}

/** Render preposition-specific content */
function renderPreposition(word) {
  if (!word) return

  // Update preposition-specific elements
  if (els.wordText()) {
    els.wordText().textContent = word.german || ''
    els.wordText().style.color = PrepositionCaseColorMap[word.case] || ''
  }

  if (els.wordTranslation()) {
    els.wordTranslation().textContent = word.english || ''
  }

  if (els.wordExample()) {
    els.wordExample().textContent = word.example || ''
    els.wordExample().style.display = word.example ? 'block' : 'none' // disable when exercise type is grammar??
  }

  if (els.wordRule()) {
    els.wordRule().textContent = word.rule || ''
  }
}

/** Mount preposition component */
export function mountPreposition(currentWord) {
  // Initialize elements
  initElements()

  // Render preposition content
  renderPreposition(currentWord)
}
