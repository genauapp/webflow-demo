import { DeckStatus } from '../../constants/props.js'
import LocalStorageManager from '../../utils/LocalStorageManager.js'

class DeckProgressService {
  constructor() {
    this.STORAGE_KEY = 'deck_progress_data'
  }

  // Get all progress data
  getProgressData() {
    const data = LocalStorageManager.load(this.STORAGE_KEY, {})
    return data
  }

  // Save all progress data
  saveProgressData(data) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Progress data save error:', error)
      return false
    }
  }

  // Get status for multiple decks
  getDeckStatuses(deckIds) {
    const progressData = this.getProgressData()
    return deckIds.reduce((acc, deckId) => {
      acc[deckId] = progressData[deckId]?.status || DeckStatus.LOCKED
      return acc
    }, {})
  }

  // Complete a deck
  completeDeck(deckId, results = null) {
    const progressData = this.getProgressData()

    progressData[deckId] = {
      status: DeckStatus.COMPLETED,
      completedAt: new Date().toISOString(),
      results,
    }

    return this.saveProgressData(progressData)
  }

  // Migration helper for future backend integration
  async migrateToBackend(apiService) {
    const progressData = this.getProgressData()
    const deckIds = Object.keys(progressData)

    for (const deckId of deckIds) {
      await apiService.completeDeck(deckId, progressData[deckId].results)
    }

    localStorage.removeItem(this.STORAGE_KEY)
  }
}

export const deckProgressService = new DeckProgressService()
