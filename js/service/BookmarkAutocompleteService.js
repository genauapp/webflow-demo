// js/service/BookmarkAutocompleteService.js
// Provides auto-complete suggestions for search input, tagging source field

class BookmarkAutocompleteService {
  /**
   * Get autocomplete suggestions from bookmarked words
   * @param {Array} words - List of bookmarked word objects
   * @param {string} input - Current search input
   * @returns {Array} Array of { value, tag } objects
   */
  getSuggestions(words, input) {
    if (!input || input.length < 2) return []
    input = input.toLowerCase()
    const suggestions = []
    const seen = new Set()
    words.forEach(word => {
      // German
      if (word.german && word.german.toLowerCase().includes(input) && !seen.has(word.german)) {
        suggestions.push({ value: word.german, tag: 'german' })
        seen.add(word.german)
      }
      // English
      if (word.english && word.english.toLowerCase().includes(input) && !seen.has(word.english)) {
        suggestions.push({ value: word.english, tag: 'english' })
        seen.add(word.english)
      }
      // Turkish
      if (word.turkish && word.turkish.toLowerCase().includes(input) && !seen.has(word.turkish)) {
        suggestions.push({ value: word.turkish, tag: 'turkish' })
        seen.add(word.turkish)
      }
      // Categories
      if (word.categories && Array.isArray(word.categories)) {
        word.categories.forEach(cat => {
          if (cat && cat.toLowerCase().includes(input) && !seen.has(cat)) {
            suggestions.push({ value: cat, tag: 'category' })
            seen.add(cat)
          }
        })
      }
    })
    return suggestions.slice(0, 8) // Limit to 8 suggestions
  }
}

export const bookmarkAutocompleteService = new BookmarkAutocompleteService()
