import { BOOKMARKS_KEY, DEFAULT_VALUE } from '../constants/storageKeys'

class BookmarkManager {
  static addWordToBookmarks = (currentWord, source) => {
    // 1. Load existing bookmarks
    const bookmarks = LocalStorageManager.load(
      BOOKMARKS_KEY,
      DEFAULT_VALUE.BOOKMARKS
    )

    // 2. Create copy of favorites array to avoid direct mutation
    const favoriteWords = [...bookmarks.favorites]

    // 3. Check for duplicates
    //   const exists = favoriteWords.some(
    //     (word) =>
    //       word.german === currentWord.german && word.english === currentWord.english
    //   )

    //   if (exists) {
    //     console.warn('Word already exists in bookmarks')
    //     return
    //   }

    // 4. Add new entry
    favoriteWords.push({
      german: currentWord.german,
      english: currentWord.english,
      level: currentWord.level || 'N/A',
      type: currentWord.type,
      category: currentWord.category,
      source: source,
    })

    // 5. Create new immutable state
    const updatedBookmarks = {
      ...bookmarks,
      favorites: favoriteWords,
    }

    // 6. Save updated bookmarks
    LocalStorageManager.save(BOOKMARKS_KEY, updatedBookmarks)
  }
}

export default BookmarkManager
