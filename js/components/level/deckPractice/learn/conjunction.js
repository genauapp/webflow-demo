// /components/level/deckPractice/learn/conjunction.js
import { WordType } from '../../../../constants/props.js'
import ttsService from '../../../../service/TtsService.js'

let els = {}

/** Initialize elements for conjunction component */
function initElements() {
  els = {
    wordText: () => document.getElementById('learn-word-card-text'),
    wordTranslation: () =>
      document.getElementById('learn-word-card-translation'),
    wordExampleContainer: () =>
      document.getElementById('learn-word-card-example-container'),
    wordExample: () => document.getElementById('learn-word-card-example'),
    wordRule: () => document.getElementById('learn-word-card-rule'),
    ttsPlayButton: () => document.getElementById('learn-word-tts-play-button'),
  }
}

/** Render conjunction-specific content */
function renderConjunction(word) {
  if (!word) return

  // Update conjunction-specific elements
  if (els.wordText()) {
    els.wordText().textContent = word.german || ''
  }

  if (els.wordTranslation()) {
    els.wordTranslation().textContent = word.english || ''
  }

  if (els.wordExampleContainer()) {
    els.wordExampleContainer().style.display = 'none'
  }

  // if (els.wordExample()) {
  //   els.wordExample().textContent = word.example || ''
  //   els.wordExample().style.display = word.example ? 'block' : 'none' // disable when exercise type is grammar??
  // }

  if (els.wordRule()) {
    els.wordRule().style.display = word.rule ? 'block' : 'none'
    els.wordRule().textContent = word.rule
  }

  // Setup TTS functionality after rendering
  ttsService.setupTTSButton(word, WordType.CONJUNCTION)
}

/** Mount conjunction component */
export function mountConjunction(currentWord) {
  // Initialize elements
  initElements()

  // Render conjunction content
  renderConjunction(currentWord)
}
