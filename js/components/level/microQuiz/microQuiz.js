// components/level/microQuiz/microQuiz.js
import {
  mountDeckPractice,
  unmountDeckPractice,
} from '../deckPractice/deckPractice.js'

export function mountMicroQuiz(packSummary) {
  // Implementation similar to mountPackJourney but for micro-quiz
  const firstDeckSummary = packSummary.deck_summaries[0]

  mountDeckPractice({
    id: firstDeckSummary.deck_id,
    wordType: firstDeckSummary.word_type,
    exerciseType: firstDeckSummary.exercise_type,
    createdAt: firstDeckSummary.created_at,
    updatedAt: firstDeckSummary.updated_at,
    wordsCount: firstDeckSummary.words_count,
    status: firstDeckSummary.user_deck_status,
  })
}

export function unmountMicroQuiz() {
  unmountDeckPractice()
}
