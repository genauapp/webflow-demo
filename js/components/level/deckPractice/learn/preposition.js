// /components/level/deckPractice/learn/preposition.js
import { PrepositionCaseColorMap, WordType } from '../../../../constants/props.js'
import ttsService from '../../../../service/TtsService.js'

let els = {}

/** Initialize elements for preposition component */
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

/** Render preposition-specific content */
function renderPreposition(word) {
  if (!word) return

  // Update preposition-specific elements
  if (els.wordText()) {
    els.wordText().textContent = word.german || ''
    els.wordText().style.color =
      PrepositionCaseColorMap[word.cases[0]] ||
      PrepositionCaseColorMap['default']
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
  ttsService.setupTTSButton(word, WordType.PREPOSITION, els.ttsPlayButton())
}

/** Mount preposition component */
export function mountPreposition(currentWord) {
  // Initialize elements
  initElements()

  // Render preposition content
  renderPreposition(currentWord)
}
