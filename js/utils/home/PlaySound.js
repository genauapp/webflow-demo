export default function playSound(audioUrl) {
    const audio = new Audio(audioUrl)
    audio.play()
  }