import { LEARN_ELEMENT_IDS } from '../../constants/elements.js'
import LocalStorageManager from '../LocalStorageManager.js'
import { DEFAULT_VALUE, CURRENT_WORD_TYPE_KEY, WORD_LIST_KEY, CURRENT_LEVEL_KEY, LEARNED_WITH_EXERCISE_WORDS_KEY, CURRENT_CATEGORY_KEY, IS_ON_LEARN_KEY } from '../../constants/storageKeys.js'
import { categories } from '../../constants/props.js'
import { loadAndShowWords } from '../../pages/home.js'

// UI visibility functions
export function showSkeleton() {
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
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

export function hideSkeleton() {
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
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
function hideLearnElements() {
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    const elementIds = [...LEARN_ELEMENT_IDS(wordType)]

    elementIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
            element.style.display = 'none'
        }
    })
}

function showLearnElements() {
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
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
    const bookmarkedWords = LocalStorageManager.load('BOOKMARKS')
    let favoriteWords = bookmarkedWords.favorites
    return favoriteWords.some((word) => word.german === currentWord.german)
}

export function updateFavoriteIcons() {
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
    const wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)

    const inFavImage = document.getElementById(`infav-${wordType}`)
    const outFavImage = document.getElementById(`outfav-${wordType}`)

    const currentWord = wordList[0]
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
    return !(level === '' || level === "einburgerungstest" || level === 'passive-level')
}

export function showOrHideDecks(level) {
    if (isRegularLevel(level)) {
        document.getElementById('decksContainer').style.display = 'flex'
        return
    }
    document.getElementById('decksContainer').style.display = 'none'
    return
}

export function loadDeckProps() {
    const level = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
    const deckContainers = document.querySelectorAll('.deck-container')
    categories[level].forEach((item, i) => {
        const deckTitle = item.nameEng;
        const deckImgURL = item.imgUrl;
        const deckShortName = item.nameShort;

        deckContainers[i].children[0].src = deckImgURL;
        deckContainers[i].children[1].innerText = deckTitle;
        deckContainers[i].dataset.option = deckShortName;
    });
}

export function showFinishScreen() {
    const learnOrExercise = LocalStorageManager.load(IS_ON_LEARN_KEY)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    let contentContainer = document.getElementById(`content-container-${learnOrExercise}-${wordType}`)
    contentContainer.style.display = 'none'
    let successScreen = document.getElementById('success-screen')
    let tabPane = document.getElementById(`tab-pane-${learnOrExercise}-${wordType}`)
    tabPane.appendChild(successScreen)
    successScreen.style.display = 'flex'

    let refreshButton = document.getElementById('refresh-button')
    refreshButton.addEventListener('click', async function (event) {
        event.preventDefault()
        refreshProgress()
    })
}

export async function refreshProgress() {
    const learnOrExercise = LocalStorageManager.load(IS_ON_LEARN_KEY)
    let learnedWordsList = LocalStorageManager.load(`LEARNED_WITH_${(learnOrExercise.toUpperCase())}_WORDS`)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
    const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
    let contentContainer = document.getElementById(`content-container-${learnOrExercise}-${wordType}`)
    let successScreen = document.getElementById('success-screen')

    learnedWordsList[level][category][wordType] = []
    LocalStorageManager.save(`LEARNED_WITH_${(learnOrExercise.toUpperCase())}_WORDS`, learnedWordsList)

    successScreen.style.display = 'none'
    contentContainer.style.display = 'flex'

    await loadAndShowWords()

}

export function hideFinishScreen() {
    const learnOrExercise = LocalStorageManager.load(IS_ON_LEARN_KEY)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    let contentContainer = document.getElementById(`content-container-${learnOrExercise}-${wordType}`)
    let successScreen = document.getElementById('success-screen')
    successScreen.style.display = 'none'
    contentContainer.style.display = 'flex'
}

export function showCorrectMessage() {
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    const feedbackMessageContainer = document.getElementById(`feedbackMessage-${wordType}`)
    const correctMessageDiv = document.createElement('div');
    Object.assign(correctMessageDiv.style, {
        display: 'inline-block',
        backgroundColor: '#00b386',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '18px',
        padding: '12px 24px',
        borderRadius: '999px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      });

    correctMessageDiv.innerText = 'Correct! 🎉';
    feedbackMessageContainer.appendChild(correctMessageDiv)
}