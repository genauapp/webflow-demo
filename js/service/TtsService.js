import SoundUtils from '../utils/SoundUtils.js'
import { WordType } from '../constants/props.js'

/**
 * TTS Service for handling Text-to-Speech functionality across word type components
 * Supports different word types: nouns, verbs, adjectives, adverbs, prepositions, conjunctions
 */
class TtsService {
  constructor() {
    // Remove all shared state that was causing conflicts
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

    // Simple approach: just ensure the button has the right data and onclick
    ttsButton.onclick = (e) => {
      // Check if already speaking by looking at button state
      if (ttsButton.disabled) {
        e.preventDefault()
        return
      }

      if (!word || !word.german) return

      const textToSpeak = this.getTextToSpeak(word, wordType)
      if (!textToSpeak) return

      // Disable button immediately
      ttsButton.disabled = true
      ttsButton.style.opacity = '0.5'
      ttsButton.style.pointerEvents = 'none'

      // Play the German text
      SoundUtils.speakText(textToSpeak, {
        lang: 'de-DE',
        rate: 0.8,
        pitch: 1,
        volume: 1,
        onEnd: () => {
          // Re-enable button
          ttsButton.disabled = false
          ttsButton.style.opacity = '1'
          ttsButton.style.pointerEvents = 'auto'
        },
        onError: (error) => {
          console.error('TTS Error:', error)
          // Re-enable button on error
          ttsButton.disabled = false
          ttsButton.style.opacity = '1'
          ttsButton.style.pointerEvents = 'auto'
        }
      })
    }
  }

  /**
   * Stop any currently playing TTS
   */
  stopTTS() {
    SoundUtils.stopSpeech()
  }
}

// Export singleton instance
export const ttsService = new TtsService()
export default ttsService
