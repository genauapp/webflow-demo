// PackJourneyService.js (updated)
import { DeckStatus } from '../../constants/props.js'
import { deckProgressService } from './DeckProgressService.js'

class PackJourneyService {
  constructor() {
    this.journeys = new Map() // packId → { state, callbacks }
  }

  createSession(packSummary, callbacks) {
    // Initialize deck summaries
    const deckSummaries = packSummary.deck_summaries.map((deck) => ({
      id: deck.deck_id,
      wordType: deck.word_type,
      exerciseType: deck.exercise_type,
      createdAt: deck.created_at,
      updatedAt: deck.updated_at,
      wordsCount: deck.words_count,
      status: deck.user_deck_status,
    }))

    // // Apply saved progress with level and pack scope
    // const savedStatuses = deckProgressService.getDeckStatuses(
    //   packSummary.pack_level, // Level
    //   packSummary.pack_id, // Pack ID
    //   deckSummaries.map((d) => d.deck_id)
    // )

    // deckSummaries.forEach((deck) => {
    //   if (savedStatuses[deck.deck_id]) {
    //     deck.status = savedStatuses[deck.deck_id]
    //   }
    // })

    // // Unlock next decks based on progress
    // this.applyProgression(deckSummaries)

    const state = {
      pack: {
        id: packSummary.pack_id,
        type: packSummary.pack_type,
        level: packSummary.pack_level,
        category: packSummary.pack_category,
        description: packSummary.pack_description,
        name: { german: packSummary.pack_german, english: packSummary.pack_english },
        imageUrl: packSummary.pack_image_url,
        wordsCount: packSummary.total_words_count,
        decksCount: packSummary.total_decks_count
      },
      deckSummaries,
    }

    this.journeys.set(state.pack.id, {
      state,
      callbacks,
    })
    this._notifyUpdate(state.pack.id)
    return state
  }

  getJourneyState(packId) {
    const journey = this.journeys.get(packId)
    return journey?.state
  }

  applyProgression(decks) {
    // // Ensure first deck is unlocked
    // if (decks.length > 0 && decks[0].status === DeckStatus.LOCKED) {
    //   decks[0].status = DeckStatus.UNLOCKED
    // }

    // // Unlock next after completed
    // for (let i = 0; i < decks.length - 1; i++) {
    //   if (decks[i].status === DeckStatus.COMPLETED) {
    //     decks[i + 1].status = DeckStatus.UNLOCKED
    //   }
    // }
  }

  completeStage(packId, deckId, results) {
    const journey = this.journeys.get(packId)
    if (!journey) return

    // Update status
    const deck = journey.state.deckSummaries.find((d) => d.id === deckId)
    if (!deck) return

    deck.status = DeckStatus.COMPLETED

    // Save with level and pack scope
    deckProgressService.completeDeck(
      journey.state.pack.level, // Level
      packId, // Pack ID
      deckId, // Deck ID
      results
    )

    // // Unlock next deck
    // this.applyProgression(journey.state.deckSummaries)

    // Notify UI
    this._notifyUpdate(packId)
    return journey.state
  }

  _notifyUpdate(packId) {
    const journey = this.journeys.get(packId)
    if (journey.callbacks.onUpdate) {
      journey.callbacks.onUpdate(journey.state)
    }
  }
}

export const packJourneyService = new PackJourneyService()
