import { LEARN_ELEMENT_IDS } from '../../constants/elements.js'
import LocalStorageManager from '../LocalStorageManager.js'
import { DEFAULT_VALUE, CURRENT_WORD_TYPE_KEY, CURRENT_LEARN_INDEX_KEY, WORD_LIST_KEY } from '../../constants/storageKeys.js'

// UI visibility functions
export function showSkeleton(wordType) {
    const skeletonState = document.getElementById('skeletonState')
    const favoritesContainer = document.getElementById('favoritesContainer')

    if (skeletonState) {
        skeletonState.style.display = 'flex'
    }
    if (favoritesContainer) {
        favoritesContainer.style.display = 'none'
    }

    hideLearnElements(wordType)
}

export function hideSkeleton(wordType) {
    const skeletonState = document.getElementById('skeletonState')
    const favoritesContainer = document.getElementById('favoritesContainer')

    if (skeletonState) {
        skeletonState.style.display = 'none'
    }
    if (favoritesContainer) {
        favoritesContainer.style.display = 'block'
    }

    showLearnElements(wordType)
}

// Learn elements visibility
function hideLearnElements(wordType) {
    const elementIds = [...LEARN_ELEMENT_IDS(wordType)]

    elementIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
            element.style.display = 'none'
        }
    })
}

function showLearnElements(wordType) {
    const elementIds = [...LEARN_ELEMENT_IDS(wordType)]

    elementIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
            const isAdjectiveOrAdverb =
                wordType === 'adjective' || wordType === 'adverb'
            const isElementRuleLearn = id === `ruleLearn-${wordType}`

            element.style.display =
                isAdjectiveOrAdverb && isElementRuleLearn ? 'none' : 'block'
        }
    })
}

function isItInFavorites(currentWord) {
    const favoriteWords = LocalStorageManager.load('favoriteWords', [])
    return favoriteWords.some((word) => word.almanca === currentWord.almanca)
}

export function updateFavoriteIcons() {
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    const wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
    const currentLearnIndex = LocalStorageManager.load(CURRENT_LEARN_INDEX_KEY, DEFAULT_VALUE.CURRENT_LEARN_INDEX)

    const inFavImage = document.getElementById(`infav-${wordType}`)
    const outFavImage = document.getElementById(`outfav-${wordType}`)

    const currentWord = wordList[currentLearnIndex]
    const isFavorite = isItInFavorites(currentWord)

    if (isFavorite) {
        inFavImage.style.display = 'block' // Görseli görünür yap
        outFavImage.style.display = 'none' // Diğerini gizle
    } else {
        inFavImage.style.display = 'none' // Görseli gizle
        outFavImage.style.display = 'block' // Diğerini görünür yap
    }
}

export function isRegularLevel(level) {
    return !(level === '' || level === "einburgerungstest")
}

export function showOrHideDecks(level) {
    if (isRegularLevel(level)) {
        document.getElementById('decksContainer').style.display = 'flex'
        return
    }
    document.getElementById('decksContainer').style.display = 'none'
    return
}