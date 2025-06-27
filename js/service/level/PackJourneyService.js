import { DeckStatus } from '../../constants/props.js'

const JOURNEY_STAGES = ['noun', 'verb', 'adjective', 'adverb']

class PackJourneyService {
  constructor() {
    this.journeys = new Map() // packId → { state, callbacks }
  }

  createSession(packSummary, callbacks) {
    const deckSummaries = packSummary.deck_summaries.map((deckSummary) => {
      return {
        id: deckSummary.deck_id,
        wordType: deckSummary.word_type,
        exerciseType: deckSummary.exercise_type,
        status: deckSummary.status,
      }
    })

    const journeySessionState = {
      pack: {
        id: packSummary.id,
        type: packSummary.type,
        level: packSummary.level,
        category: packSummary.category,
        name: {
          german: packSummary.name,
          english: packSummary.name_eng,
        },
        imageUrl: packSummary.img_url,
      },
      deckSummaries: deckSummaries,
    }

    this.journeys.set(journeySessionState.pack.id, {
      state: journeySessionState,
      callbacks,
    })
    this._notifyUpdate(journeySessionState.pack.id)
    return journeySessionState
  }

  getJourneyState(packId) {
    const journey = this.journeys.get(packId)
    return journey?.state
  }

  completeStage(packId, stageId) {
    const journey = this.journeys.get(packId)
    if (!journey) return null

    const stageIndex = journey.state.deckSummaries.findIndex(
      (stage) => stage.id === stageId
    )
    if (stageIndex === -1) return journey.state

    journey.state.deckSummaries[stageIndex].status = DeckStatus.COMPLETED

    if (stageIndex + 1 < journey.state.deckSummaries.length) {
      journey.state.deckSummaries[stageIndex + 1].status = DeckStatus.UNLOCKED
    }

    this._notifyUpdate(packId)
    return journey.state
  }

  _notifyUpdate(packId) {
    const journey = this.journeys.get(packId)
    if (journey?.callbacks?.onUpdate) {
      journey.callbacks.onUpdate(journey.state)
    }
  }
}

export const packJourneyService = new PackJourneyService()
