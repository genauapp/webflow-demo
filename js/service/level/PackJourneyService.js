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
    const packId = packSummary.pack_id
    
    // Check if we already have a journey for this pack with updated state
    const existingJourney = this.journeys.get(packId)
    if (existingJourney) {
      // Update callbacks and return existing state (which may have fresher data)
      existingJourney.callbacks = callbacks
      this._notifyUpdate(packId)
      return existingJourney.state
    }

    // Initialize deck summaries for new journey
    const deckSummaries = packSummary.deck_summaries.map((deck) => ({
      id: deck.deck_id,
      wordType: deck.word_type,
      exerciseType: deck.exercise_type,
      createdAt: deck.created_at,
      updatedAt: deck.updated_at,
      wordsCount: deck.words_count,
      status: deck.user_deck_status,
    }))

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
   * @param {object} updatedPackSummary - Updated pack summary from API response
   * @returns {Promise<object>} updated journey state
   */
  async completeStage(packId, deckId, postPayload, updatedPackSummary) {
    // If updatedPackSummary is provided, use it; otherwise make API call
    let userPackSummary = updatedPackSummary
    if (!userPackSummary) {
      const { userPackSummary: apiResponse, userDeckExerciseResult, error } =
        await protectedApiService.completeUserDeckExercise(postPayload)
      if (error) {
        console.error('Failed to complete deck exercise:', error)
        return null
      }
      userPackSummary = apiResponse
    }

    // 1. Update local storage for CURRENT_PACK
    if (userPackSummary) {
      LocalStorageManager.save(CURRENT_PACK_KEY, userPackSummary)
    }

    // 2. Update the pack summaries in level.js with the API response
    if (userPackSummary) {
      const { updatePackSummaryInLevel } = await import('../../pages/level.js')
      updatePackSummaryInLevel(userPackSummary)
    }

    // 3. Update the entire journey state with fresh pack summary data
    const journey = this.journeys.get(packId)
    if (!journey) return null

    // Rebuild the journey state with updated pack summary
    const updatedDeckSummaries = userPackSummary.deck_summaries.map((deck) => ({
      id: deck.deck_id,
      wordType: deck.word_type,
      exerciseType: deck.exercise_type,
      createdAt: deck.created_at,
      updatedAt: deck.updated_at,
      wordsCount: deck.words_count,
      status: deck.user_deck_status,
    }))

    // Update pack info as well
    journey.state.pack = {
      id: userPackSummary.pack_id,
      type: userPackSummary.pack_type,
      level: userPackSummary.pack_level,
      category: userPackSummary.pack_category,
      description: userPackSummary.pack_description,
      name: {
        german: StringUtils.capitalizeWords(userPackSummary.pack_german),
        english: StringUtils.capitalizeWords(userPackSummary.pack_english),
      },
      imageUrl: userPackSummary.pack_image_url,
      wordsCount: userPackSummary.total_words_count,
      decksCount: userPackSummary.total_decks_count,
    }

    // Update deck summaries
    journey.state.deckSummaries = updatedDeckSummaries

    // Notify UI
    this._notifyUpdate(packId)
    return journey.state
  }

  _notifyUpdate(packId) {
    const journey = this.journeys.get(packId)
    if (journey && journey.callbacks && journey.callbacks.onUpdate) {
      journey.callbacks.onUpdate(journey.state)
    }
  }

  /**
   * Clear a specific journey from the map (optional cleanup)
   * @param {string} packId 
   */
  clearJourney(packId) {
    this.journeys.delete(packId)
  }

  /**
   * Clear all journeys (optional cleanup)
   */
  clearAllJourneys() {
    this.journeys.clear()
  }
}

export const packJourneyService = new PackJourneyService()
