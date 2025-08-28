import { CDN_BASE_URL } from '../constants/urls'

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
}

export default SoundUtils
