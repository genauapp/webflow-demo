// js/service/BookmarkSearchService.js
// Pattern: Export default object with methods, stateless, similar to BookmarkService
// BookmarkSearchService.js
// Pattern: Class-based, export instance, matches BookmarkService, PackJourneyService, etc.

class BookmarkSearchService {
  /**
   * Filter bookmarked words by level, type, and text
   * @param {Array} words - List of bookmarked word objects
   * @param {Object} filters - { level, type, text }
   * @returns {Array} Filtered words
   */
  filter(words, { level, type, text }) {
    return words.filter(word => {
      const matchesLevel = !level || word.level === level;
      const matchesType = !type || word.type === type;
      const matchesText = !text || [word.german, word.english, word.turkish, ...(word.categories || [])]
        .some(val => val && val.toLowerCase().includes(text.toLowerCase()));
      return matchesLevel && matchesType && matchesText;
    });
  }
}

export const bookmarkSearchService = new BookmarkSearchService();
