// components/level/microQuiz/microQuiz.js
import {
  mountDeckPractice,
  unmountDeckPractice,
} from '../deckPractice/deckPractice'

export function mountMicroQuiz(packSummary) {
  // Implementation similar to mountPackJourney but for micro-quiz
  const firstDeck = packSummary.deck_summaries[0]

  mountDeckPractice(
    packSummary.id,
    packSummary.type,
    packSummary.level,
    firstDeck.word_type,
    firstDeck.exercise_type
  )
}

export function unmountMicroQuiz() {
  unmountDeckPractice()
}
