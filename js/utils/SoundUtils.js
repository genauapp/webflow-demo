import { CDN_BASE_URL } from '../constants/urls.js'

class SoundUtils {
  static playCorrectSound() {
    this.playSound(`${CDN_BASE_URL}/sound/level/exercise/correct.mp3`)
  }

  static playStreakSound() {
    this.playSound(`${CDN_BASE_URL}/sound/level/exercise/streak.mp3`)
  }

  static playSound(audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play()
  }

  /**
   * Uses Web Speech API to speak German text with Text-to-Speech
   * @param {string} text - The German text to speak
   * @param {Object} options - TTS configuration options
   * @param {string} options.lang - Language code (default: 'de-DE')
   * @param {number} options.rate - Speech rate 0.1-10 (default: 1)
   * @param {number} options.pitch - Pitch 0-2 (default: 1)
   * @param {number} options.volume - Volume 0-1 (default: 1)
   */
  static speakText(text, options = {}) {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser')
      return false
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel()

    if (!text || text.trim() === '') {
      console.warn('No text provided for speech synthesis')
      return false
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text.trim())
    
    // Set options with defaults for German
    utterance.lang = options.lang || 'de-DE'
    utterance.rate = options.rate || 0.9  // Slightly slower for learning
    utterance.pitch = options.pitch || 1
    utterance.volume = options.volume || 1

    // Optional callbacks
    if (options.onStart) {
      utterance.onstart = options.onStart
    }
    if (options.onEnd) {
      utterance.onend = options.onEnd
    }
    if (options.onError) {
      utterance.onerror = options.onError
    }

    // Speak the text
    speechSynthesis.speak(utterance)
    return true
  }

  /**
   * Convenience method specifically for German words in the learning context
   * @param {string} germanText - The German word or phrase to pronounce
   */
  static speakGerman(germanText) {
    return this.speakText(germanText, {
      lang: 'de-DE',
      rate: 0.8, // Slower rate for learning pronunciation
      pitch: 1,
      volume: 1
    })
  }

  /**
   * Stop any currently playing speech synthesis
   */
  static stopSpeech() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  }
}

export default SoundUtils
