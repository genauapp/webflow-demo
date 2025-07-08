// /components/level/deckPractice/learn/adverb.js
import { NounArticleColorMap } from '../../../../constants/props.js'

let els = {}

/** Initialize elements for adverb component */
function initElements() {
  els = {
    wordText: () => document.getElementById('learn-word-card-text'),
    wordTranslation: () =>
      document.getElementById('learn-word-card-translation'),
    wordExample: () => document.getElementById('learn-word-card-example'),
    wordRule: () => document.getElementById('learn-word-card-rule'),
  }
}

/** Render adverb-specific content */
function renderAdverb(word) {
  if (!word) return

  // Update adverb-specific elements (no extra styling like preposition/noun)
  if (els.wordText()) {
    els.wordText().textContent = word.german || ''
    els.wordText().style.color = NounArticleColorMap['default']
  }

  if (els.wordTranslation()) {
    els.wordTranslation().textContent = word.english || ''
  }

  if (els.wordExample()) {
    els.wordExample().textContent = word.example || ''
    els.wordExample().style.display = word.example ? 'block' : 'none'
  }

  if (els.wordRule()) {
    els.wordRule().style.display = word.rule ? 'block' : 'none'
    els.wordRule().textContent = word.rule
  }
}

/** Mount adverb component */
export function mountAdverb(currentWord) {
  // Initialize elements
  initElements()

  // Render adverb content
  renderAdverb(currentWord)
}
