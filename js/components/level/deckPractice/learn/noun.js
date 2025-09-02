// /components/level/deckPractice/learn/noun.js
import { NounArticleColorMap, WordType } from '../../../../constants/props.js'
import StringUtils from '../../../../utils/StringUtils.js'
import ttsService from '../../../../service/TtsService.js'

let els = {}

/** Initialize elements for noun component */
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

/** Render noun-specific content */
function renderNoun(word) {
  if (!word) return

  // Update noun-specific elements
  if (els.wordText()) {
    // Concat article and text for nouns
    const displayText = word.article
      ? `${word.article} ${StringUtils.capitalize(word.german) || ''}`
      : word.german || word.text || ''
    els.wordText().textContent = displayText
    // Use artikel color map for the entire concatenated text
    els.wordText().style.color =
      NounArticleColorMap[word.article] || NounArticleColorMap['default']
  }

  if (els.wordTranslation()) {
    els.wordTranslation().textContent = word.english || ''
  }

  if (els.wordExampleContainer()) {
    els.wordExampleContainer().style.display = 'flex'
  }

  if (els.wordExample()) {
    els.wordExample().textContent = word.example || ''
  }

  if (els.wordRule()) {
    els.wordRule().style.display = word.rule ? 'block' : 'none'
    els.wordRule().textContent = word.rule
  }
}

/** Mount noun component */
export function mountNoun(currentWord) {
  // Initialize elements
  initElements()

  // Render noun content
  renderNoun(currentWord)

  // Setup TTS functionality using the centralized service
  ttsService.setupTTSButton(currentWord, WordType.NOUN)
}
