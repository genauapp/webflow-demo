// PackJourneyService.js (updated)
import { DeckStatus } from '../../constants/props.js'
import { deckProgressService } from './DeckProgressService.js'
import { protectedApiService } from '../apiService.js'
import LocalStorageManager from '../../utils/LocalStorageManager.js'
import { CURRENT_PACK_KEY } from '../../constants/storageKeys.js'
import StringUtils from '../../utils/StringUtils.js'

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
        name: {
          german: StringUtils.capitalizeWords(packSummary.pack_german),
          english: StringUtils.capitalizeWords(packSummary.pack_english),
        },
        imageUrl: packSummary.pack_image_url,
        wordsCount: packSummary.total_words_count,
        decksCount: packSummary.total_decks_count,
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

  /**
   * Complete a deck stage: POST results, update local pack summary, and deck status.
   * @param {string} packId
   * @param {string} deckId
   * @param {object} postPayload - POST-ready payload for completion
   * @returns {Promise<object>} updated journey state
   */
  async completeStage(packId, deckId, postPayload) {
    // 1. POST results to backend and get updated pack summary
    const { userPackSummary, userDeckExerciseResult, error } =
      await protectedApiService.completeUserDeckExercise(postPayload)
    if (error) {
      console.error('Failed to complete deck exercise:', error)
      return null
    }
    // 2. Update local storage for CURRENT_PACK
    if (userPackSummary) {
      LocalStorageManager.save(CURRENT_PACK_KEY, userPackSummary)
    }
    // 3. Update deck summary in journey state
    const journey = this.journeys.get(packId)
    if (!journey) return null
    const updatedDeck = userPackSummary.deck_summaries.find(
      (d) => d.deck_id === deckId
    )
    if (updatedDeck) {
      const idx = journey.state.deckSummaries.findIndex((d) => d.id === deckId)
      if (idx !== -1) {
        journey.state.deckSummaries[idx] = {
          id: updatedDeck.deck_id,
          wordType: updatedDeck.word_type,
          exerciseType: updatedDeck.exercise_type,
          createdAt: updatedDeck.created_at,
          updatedAt: updatedDeck.updated_at,
          wordsCount: updatedDeck.words_count,
          status: updatedDeck.user_deck_status,
        }
      }
    }
    // Optionally, update other pack fields from userPackSummary
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
