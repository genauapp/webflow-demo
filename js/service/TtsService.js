import SoundUtils from '../utils/SoundUtils.js'
import { WordType } from '../constants/props.js'

/**
 * TTS Service for handling Text-to-Speech functionality across word type components
 * Supports different word types: nouns, verbs, adjectives, adverbs, prepositions, conjunctions
 */
class TtsService {
  constructor() {
    this.isSpeaking = false
    this.currentButton = null
    this.boundClickHandler = null
  }

  /**
   * Get the text to speak based on word type
   * @param {Object} word - The word object containing german text and other properties
   * @param {string} wordType - Type of word: WordType.NOUN, WordType.VERB, etc.
   * @returns {string} - The text to be spoken by TTS
   */
  getTextToSpeak(word, wordType) {
    if (!word || !word.german) return ''

    switch (wordType) {
      case WordType.NOUN:
        // For nouns, include the article if available
        return word.article 
          ? `${word.article} ${word.german}` 
          : word.german
      
      case WordType.VERB:
      case WordType.ADJECTIVE:
      case WordType.ADVERB:
      case WordType.PREPOSITION:
      case WordType.CONJUNCTION:
        // For other word types, just use the German text
        return word.german
      
      default:
        return word.german
    }
  }

  /**
   * Setup TTS functionality for a play button
   * @param {Object} word - The word object containing german text and other properties
   * @param {string} wordType - Type of word: WordType.NOUN, WordType.VERB, etc.
   * @param {string} buttonId - The ID of the TTS play button element
   */
  setupTTSButton(word, wordType, buttonId = 'learn-word-tts-play-button') {
    const ttsButton = document.getElementById(buttonId)
    if (!ttsButton) {
      console.warn(`TTS button with ID '${buttonId}' not found`)
      return
    }

    // Store reference to current button
    this.currentButton = ttsButton

    // Remove any existing TTS event listeners to prevent duplicates
    ttsButton.removeEventListener('click', this.boundClickHandler)
    
    // Create bound handler for this instance
    this.boundClickHandler = (e) => this.handleTTSClick(e, word, wordType)
    
    // Add the event listener
    ttsButton.addEventListener('click', this.boundClickHandler)
  }

  /**
   * Handle TTS button click event
   * @param {Event} e - The click event
   * @param {Object} word - The word object
   * @param {string} wordType - Type of word
   */
  handleTTSClick(e, word, wordType) {
    // Prevent action if already speaking
    if (this.isSpeaking) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    if (!word || !word.german) return

    const textToSpeak = this.getTextToSpeak(word, wordType)
    if (!textToSpeak) return

    this.playTTS(textToSpeak)
  }

  /**
   * Play TTS for the given text
   * @param {string} textToSpeak - The text to be spoken
   */
  playTTS(textToSpeak) {
    // Set speaking state and disable button
    this.isSpeaking = true
    this.disableButton()

    // Play the German text
    SoundUtils.speakText(textToSpeak, {
      lang: 'de-DE',
      rate: 0.8,
      pitch: 1,
      volume: 1,
      onEnd: () => {
        this.enableButton()
      },
      onError: (error) => {
        console.error('TTS Error:', error)
        this.enableButton()
      }
    })
  }

  /**
   * Disable the TTS button during speech
   */
  disableButton() {
    if (!this.currentButton) return

    this.currentButton.disabled = true
    this.currentButton.style.opacity = '0.5'
    this.currentButton.style.pointerEvents = 'none'
  }

  /**
   * Enable the TTS button after speech
   */
  enableButton() {
    if (!this.currentButton) return

    this.isSpeaking = false
    this.currentButton.disabled = false
    this.currentButton.style.opacity = '1'
    this.currentButton.style.pointerEvents = 'auto'
  }

  /**
   * Stop any currently playing TTS
   */
  stopTTS() {
    SoundUtils.stopSpeech()
    this.enableButton()
  }

  /**
   * Check if TTS is currently speaking
   * @returns {boolean}
   */
  getIsSpeaking() {
    return this.isSpeaking
  }
}

// Export singleton instance
export const ttsService = new TtsService()
export default ttsService
