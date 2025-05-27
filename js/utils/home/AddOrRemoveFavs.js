import {
  BOOKMARKS_KEY,
  CURRENT_WORD_TYPE_KEY,
  DEFAULT_VALUE,
  TOTAL_WORD_LEARN_KEY,
  WORD_LIST_KEY,
} from '../../constants/storageKeys.js'
import LocalStorageManager from '../LocalStorageManager.js'
import { updateFavoriteIcons } from './UIUtils.js'

export const addWordToBookmarks = (currentWord, source) => {
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

// On Learn: Add to Favorites Click
export const addToFavorites = () => {
  const wordType = LocalStorageManager.load(
    CURRENT_WORD_TYPE_KEY,
    DEFAULT_VALUE.CURRENT_WORD_TYPE
  )
  const wordList = LocalStorageManager.load(
    WORD_LIST_KEY,
    DEFAULT_VALUE.WORD_LIST
  )
  const inFavImage = document.getElementById(`infav-${wordType}`)
  const outFavImage = document.getElementById(`outfav-${wordType}`)
  const feedbackElement = document.getElementById(
    `favoritesFeedback-${wordType}`
  )

  const currentWord = wordList[0]
  let bookmarkedWords = LocalStorageManager.load('BOOKMARKS')
  let favoriteWords = bookmarkedWords.favorites

  // Favorilere ekle
  favoriteWords.push({
    type: currentWord.type,
    german: currentWord.german,
    english: currentWord.english,
    level: currentWord.level || 'N/A',
  })
  bookmarkedWords.favorites = favoriteWords
  LocalStorageManager.save('BOOKMARKS', bookmarkedWords)

  feedbackElement.innerText = `"${currentWord.german}" has been added to favorites!`
  feedbackElement.style.color = 'green'

  // Görselleri güncelle
  inFavImage.style.display = 'block' // infav göster
  outFavImage.style.display = 'none' // outfav gizle

  feedbackElement.style.display = 'block'
  setTimeout(() => {
    feedbackElement.style.display = 'none'
  }, 2000)
}

// On Learn: Remove from Favorites Click
export function removeFavorite() {
  const wordType = LocalStorageManager.load(
    CURRENT_WORD_TYPE_KEY,
    DEFAULT_VALUE.CURRENT_WORD_TYPE
  )
  const wordList = LocalStorageManager.load(
    WORD_LIST_KEY,
    DEFAULT_VALUE.WORD_LIST
  )

  // Favorilerden kaldır
  const feedbackElement = document.getElementById(
    `favoritesFeedback-${wordType}`
  )
  const currentWord = wordList[0]
  let bookmarkedWords = LocalStorageManager.load('BOOKMARKS')
  let favoriteWords = bookmarkedWords.favorites

  favoriteWords = favoriteWords.filter(
    (word) => word.german !== currentWord.german
  )
  bookmarkedWords.favorites = favoriteWords
  LocalStorageManager.save('BOOKMARKS', bookmarkedWords)

  feedbackElement.innerText = `"${currentWord.german}" has been removed from favorites.`
  feedbackElement.style.color = 'orange'

  feedbackElement.style.display = 'block'
  setTimeout(() => {
    feedbackElement.style.display = 'none'
  }, 2000)
  // Görselleri güncelle
  updateFavoriteIcons()
}
