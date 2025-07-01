// PackJourneyService.js (updated)
import { DeckStatus } from '../../constants/props.js'
import { deckProgressService } from './DeckProgressService.js'

class PackJourneyService {
  constructor() {
    this.journeys = new Map()
  }

  createSession(packSummary, callbacks) {
    // Initialize deck summaries
    const deckSummaries = packSummary.deck_summaries.map((deck) => ({
      id: deck.deck_id,
      wordType: deck.word_type,
      exerciseType: deck.exercise_type,
      status: deck.status,
    }))

    // Apply saved progress
    const savedStatuses = deckProgressService.getDeckStatuses(
      deckSummaries.map((d) => d.id)
    )

    deckSummaries.forEach((deck) => {
      if (savedStatuses[deck.id]) {
        deck.status = savedStatuses[deck.id]
      }
    })

    // Unlock next decks based on progress
    this.applyProgression(deckSummaries)

    const state = {
      pack: {
        id: packSummary.id,
        type: packSummary.type,
        level: packSummary.level,
        name: { german: packSummary.name, english: packSummary.name_eng },
        imageUrl: packSummary.img_url,
      },
      deckSummaries,
    }

    this.journeys.set(packSummary.id, { state, callbacks })
    return state
  }

  applyProgression(decks) {
    // Ensure first deck is unlocked
    if (decks.length > 0 && decks[0].status === DeckStatus.LOCKED) {
      decks[0].status = DeckStatus.UNLOCKED
    }

    // Unlock next after completed
    for (let i = 0; i < decks.length - 1; i++) {
      if (decks[i].status === DeckStatus.COMPLETED) {
        decks[i + 1].status = DeckStatus.UNLOCKED
      }
    }
  }

  completeStage(packId, deckId, results) {
    const journey = this.journeys.get(packId)
    if (!journey) return

    // Update status
    const deck = journey.state.deckSummaries.find((d) => d.id === deckId)
    if (!deck) return

    deck.status = DeckStatus.COMPLETED
    deckProgressService.completeDeck(deckId, results)

    // Unlock next deck
    this.applyProgression(journey.state.deckSummaries)

    // Notify UI
    if (journey.callbacks.onUpdate) {
      journey.callbacks.onUpdate(journey.state)
    }

    return journey.state
  }
}

export const packJourneyService = new PackJourneyService()
