// components/level/microQuiz/microQuiz.js
import {
  mountDeckPractice,
  unmountDeckPractice,
} from '../deckPractice/deckPractice.js'

export function mountMicroQuiz(packSummary) {
  // Implementation similar to mountPackJourney but for micro-quiz
  const firstDeckSummary = packSummary.deck_summaries[0]

  mountDeckPractice(firstDeckSummary)
}

export function unmountMicroQuiz() {
  unmountDeckPractice()
}
