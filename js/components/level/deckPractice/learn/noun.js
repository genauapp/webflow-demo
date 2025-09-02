// /components/level/deckPractice/learn/noun.js
import { NounArticleColorMap } from '../../../../constants/props.js'
import StringUtils from '../../../../utils/StringUtils.js'
import SoundUtils from '../../../../utils/SoundUtils.js'

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

/** Handle TTS play button functionality */
function setupTTSButton(word) {
  const ttsButton = els.ttsPlayButton()
  if (!ttsButton) return

  // Remove any existing event listeners
  const newButton = ttsButton.cloneNode(true)
  ttsButton.parentNode.replaceChild(newButton, ttsButton)

  let isSpeaking = false

  newButton.addEventListener('click', (e) => {
    // Prevent action if already speaking
    if (isSpeaking) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    if (!word || !word.german) return

    // For nouns, include the article in TTS
    const textToSpeak = word.article
      ? `${word.article} ${word.german}`
      : word.german

    // Set speaking state and disable button
    isSpeaking = true
    newButton.disabled = true
    newButton.style.opacity = '0.5'
    newButton.style.pointerEvents = 'none'

    // Play the German text with article
    SoundUtils.speakText(textToSpeak, {
      lang: 'de-DE',
      rate: 0.8,
      pitch: 1,
      volume: 1,
      onEnd: () => {
        // Re-enable button when speech ends
        isSpeaking = false
        newButton.disabled = false
        newButton.style.opacity = '1'
        newButton.style.pointerEvents = 'auto'
      },
      onError: () => {
        // Re-enable button on error
        isSpeaking = false
        newButton.disabled = false
        newButton.style.opacity = '1'
        newButton.style.pointerEvents = 'auto'
      }
    })
  })
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

  // Setup TTS functionality
  setupTTSButton(currentWord)
}
