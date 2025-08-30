import { DeckStatus } from '../../constants/props.js'
import LocalStorageManager from '../../utils/LocalStorageManager.js'

class DeckProgressService {
  constructor() {
    this.STORAGE_KEY = 'deck_progress_data'
  }

  getProgressData() {
    return LocalStorageManager.load(this.STORAGE_KEY, {})
  }

  saveProgressData(data) {
    LocalStorageManager.save(this.STORAGE_KEY, data)
    return true
  }

  // Get status for multiple decks within a level and pack
  getDeckStatuses(level, packId, deckIds) {
    const progressData = this.getProgressData()
    const levelData = progressData[level] || {}
    const packData = levelData[packId] || {}

    return deckIds.reduce((acc, deckId) => {
      acc[deckId] = packData[deckId]?.status || DeckStatus.LOCKED
      return acc
    }, {})
  }

  // Complete a deck within specific level and pack
  completeDeck(level, packId, deckId, results = null) {
    const progressData = this.getProgressData()

    // Initialize level if needed
    if (!progressData[level]) {
      progressData[level] = {}
    }

    // Initialize pack if needed
    if (!progressData[level][packId]) {
      progressData[level][packId] = {}
    }

    progressData[level][packId][deckId] = {
      status: DeckStatus.COMPLETED,
      completedAt: new Date().toISOString(),
      results,
    }

    return this.saveProgressData(progressData)
  }

  // Migration helper
  async migrateToBackend(apiService) {
    const progressData = this.getProgressData()

    for (const level in progressData) {
      for (const packId in progressData[level]) {
        const deckProgress = progressData[level][packId]
        for (const deckId in deckProgress) {
          await apiService.completeDeck(
            level,
            packId,
            deckId,
            deckProgress[deckId].results
          )
        }
      }
    }

    LocalStorageManager.remove(this.STORAGE_KEY)
  }
}

export const deckProgressService = new DeckProgressService()
