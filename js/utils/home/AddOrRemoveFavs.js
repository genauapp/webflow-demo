import { CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE, TOTAL_WORD_LEARN_KEY, WORD_LIST_KEY, CURRENT_LEARN_INDEX_KEY } from "../../constants/storageKeys.js"
import LocalStorageManager from "../LocalStorageManager.js"
import { updateFavoriteIcons } from "./UIUtils.js"

// On Learn: Add to Favorites Click
export const addToFavorites = () => {
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    const totalWordsLearn = LocalStorageManager.load(TOTAL_WORD_LEARN_KEY, DEFAULT_VALUE.TOTAL_WORD_LEARN)
    const wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
    const currentLearnIndex = LocalStorageManager.load(CURRENT_LEARN_INDEX_KEY, DEFAULT_VALUE.CURRENT_LEARN_INDEX)

    const inFavImage = document.getElementById(`infav-${wordType}`)
    const outFavImage = document.getElementById(`outfav-${wordType}`)
    const feedbackElement = document.getElementById(
        `favoritesFeedback-${wordType}`
    )

    if (wordList.length === 0 || currentLearnIndex >= totalWordsLearn) {
        feedbackElement.innerText = 'No word to add to favorites!'
        feedbackElement.style.color = 'red'
        feedbackElement.style.display = 'block'
        setTimeout(() => {
            feedbackElement.style.display = 'none'
        }, 3000)
        return
    }

    const currentWord = wordList[currentLearnIndex]
    let favoriteWords = LocalStorageManager.load('favoriteWords', [])

    // Favorilere ekle
    favoriteWords.push({
        type: currentWord.type,
        almanca: currentWord.almanca,
        ingilizce: currentWord.ingilizce,
        seviye: currentWord.seviye || 'N/A',
    })
    LocalStorageManager.save('favoriteWords', favoriteWords)

    feedbackElement.innerText = `"${currentWord.almanca}" has been added to favorites!`
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
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    const wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
    const currentLearnIndex = LocalStorageManager.load(CURRENT_LEARN_INDEX_KEY, DEFAULT_VALUE.CURRENT_LEARN_INDEX)

    // Favorilerden kaldır
    const feedbackElement = document.getElementById(
        `favoritesFeedback-${wordType}`
    )
    const currentWord = wordList[currentLearnIndex]
    let favoriteWords = LocalStorageManager.load('favoriteWords', [])
    favoriteWords = favoriteWords.filter(
        (word) => word.almanca !== currentWord.almanca
    )
    LocalStorageManager.save('favoriteWords', favoriteWords)

    feedbackElement.innerText = `"${currentWord.almanca}" has been removed from favorites.`
    feedbackElement.style.color = 'orange'

    feedbackElement.style.display = 'block'
    setTimeout(() => {
        feedbackElement.style.display = 'none'
    }, 2000)
    // Görselleri güncelle
    updateFavoriteIcons()
}