// BookmarkService.js
import { protectedApiService } from './apiService.js'

/**
 * BookmarkService - Manages user bookmarks for words
 * 
 * This service handles bookmark operations including adding, removing,
 * and retrieving bookmarked words from the API.
 */
class BookmarkService {
  constructor() {
    // No session state needed for bookmark operations
  }

  /**
   * Add a word to bookmarks
   * @param {string} wordId - The ID of the word to bookmark
   * @returns {Promise<{data: any, status: number|null, error: string|null}>}
   */
  async addToBookmark(wordId) {
    if (!wordId) {
      return { data: null, status: null, error: 'Word ID is required' }
    }

    try {
      const response = await protectedApiService.addToBookmark(wordId)
      return response
    } catch (error) {
      console.error('[BookmarkService] Failed to add bookmark:', error)
      return { 
        data: null, 
        status: null, 
        error: error.message || 'Failed to add bookmark' 
      }
    }
  }

  /**
   * Remove a word from bookmarks
   * @param {string} wordId - The ID of the word to remove from bookmarks
   * @returns {Promise<{data: any, status: number|null, error: string|null}>}
   */
  async removeFromBookmark(wordId) {
    if (!wordId) {
      return { data: null, status: null, error: 'Word ID is required' }
    }

    try {
      const response = await protectedApiService.removeFromBookmark(wordId)
      return response
    } catch (error) {
      console.error('[BookmarkService] Failed to remove bookmark:', error)
      return { 
        data: null, 
        status: null, 
        error: error.message || 'Failed to remove bookmark' 
      }
    }
  }

  /**
   * Get all bookmarked words for the current user
   * @returns {Promise<{data: any, status: number|null, error: string|null}>}
   */
  async getAllBookmarkedWords() {
    try {
      const response = await protectedApiService.getAllBookmarkedWords()
      return response
    } catch (error) {
      console.error('[BookmarkService] Failed to fetch bookmarked words:', error)
      return { 
        data: null, 
        status: null, 
        error: error.message || 'Failed to fetch bookmarked words' 
      }
    }
  }
}

// Singleton instance
const bookmarkService = new BookmarkService()
export default bookmarkService
