import { CURRENT_LEVEL_KEY, CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE, LEARNED_WITH_EXERCISE_WORDS_KEY, LEARNED_WITH_LEARN_WORDS_KEY, CURRENT_CATEGORY_KEY, WORD_LIST_EXERCISE_KEY, IN_PROGRESS_WORDS_KEY, WORD_LIST_KEY, TOTAL_WORD_EXERCISE_KEY, TOTAL_WORD_LEARN_KEY, IS_ON_LEARN_KEY } from '../constants/storageKeys.js'
import { ASSETS_BASE_URL } from '../constants/urls.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'
import ListUtils from '../utils/ListUtils.js'
import { categories, types } from '../constants/props.js'
import { removeFavorite, addToFavorites } from '../utils/home/AddOrRemoveFavs.js'
import { iKnowLearn, repeatLearn } from '../utils/home/LearnUtils.js'
import checkNonNounAnswer from '../utils/home/checkNonNounAnswer.js'
import showExerciseWord from '../utils/home/ShowExerciseWord.js'
import checkNounAnswer from '../utils/home/checkNounAnswer.js'
import showLearnWord from '../utils/home/showLearnWord.js'
import { isRegularLevel, showOrHideDecks, loadDeckProps } from '../utils/home/UIUtils.js'

// On Initial Load
document.addEventListener('DOMContentLoaded', async () => {
  LocalStorageManager.clearDeprecatedLocalStorageItems()
  LocalStorageManager.save(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
  LocalStorageManager.save(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
  LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
  LocalStorageManager.save(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
  LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, DEFAULT_VALUE.IN_PROGRESS_WORDS)
  LocalStorageManager.save(IS_ON_LEARN_KEY, "learn")
  LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
  LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  LocalStorageManager.load('BOOKMARKS', DEFAULT_VALUE.BOOKMARKS)

  await loadAndShowWords()
})

// On Level Change
document.querySelectorAll('.level-dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    event.preventDefault()

    // Avoid errors for C1 and C2 levels which are not fully implemented
    if (link.classList.contains('passive-level')) {
      return
    }

    const updatedLevel = link.getAttribute('data-option')
    const selectedText = link.innerText
    // Save selected option to localStorage
    LocalStorageManager.save(CURRENT_LEVEL_KEY, updatedLevel)

    // Load Deck Props for specific Level and manage category prop on localStorage
    if (isRegularLevel(updatedLevel)) {
      let currentCategory = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
      if (!categories[updatedLevel].some(cat => cat.nameShort === currentCategory)) {
        currentCategory = categories[updatedLevel][0].nameShort
        LocalStorageManager.save(CURRENT_CATEGORY_KEY, currentCategory)
        let deckimgs = document.querySelectorAll('.deck-img')
        let selectedDeckImg = deckimgs[0]
        deckimgs.forEach((deckimg) => {
          if (deckimg.classList.contains('selected-deck-img')) {
            deckimg.classList.remove('selected-deck-img')
            deckimg.style.border = ''
            deckimg.style.borderRadius = ''
          }
        })
        selectedDeckImg.style.border = '2px solid black'
        selectedDeckImg.style.borderRadius = '16px'
        selectedDeckImg.classList.add('selected-deck-img')
      }
      loadDeckProps()
    }

    // Dropdown başlığını güncelle
    document.getElementById('dropdownHeader').innerText = selectedText

    if (updatedLevel === 'einburgerungstest') {
      LocalStorageManager.save(CURRENT_CATEGORY_KEY, 'einburgerungstest')
      showOrHideDecks('einburgerungstest')
      checkIsOnLearnOrExercise()
      await loadAndShowWords()
      return
    }

    showOrHideDecks(updatedLevel)
    checkIsOnLearnOrExercise()
    await loadAndShowWords()
  })
})

document.querySelectorAll('.deck-container').forEach((elem) => {
  elem.addEventListener('click', async function (event) {
    event.preventDefault()
    const selectedCategory = elem.getAttribute('data-option')
    LocalStorageManager.save(CURRENT_CATEGORY_KEY, selectedCategory)

    if (!elem.children[0].classList.contains('selected-deck-img')) {
      elem.children[0].style.border = '2px solid black'
      elem.children[0].style.borderRadius = '16px'
      //remove selected class from all deck images
      document.querySelectorAll('.deck-img').forEach((deckimg) => {
        if (deckimg.classList.contains('selected-deck-img')) {
          deckimg.classList.remove('selected-deck-img')
          deckimg.style.border = ''
          deckimg.style.borderRadius = ''
        }
      })
      // add selected class into selected image
      elem.children[0].classList.add('selected-deck-img')
    }
    checkIsOnLearnOrExercise()
    await loadAndShowWords()
  })
})

// On Word Type Change

types.forEach((type) => {
  document.getElementById(`${type}Tab`).addEventListener('click', async () => {
    LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, type)
    checkIsOnLearnOrExercise()
    await loadAndShowWords()
  })
  document.getElementById(`${type}Tab-learn`).addEventListener('click', async () => {
    LocalStorageManager.save(IS_ON_LEARN_KEY, "learn")
    await loadAndShowWords()
  })
  document.getElementById(`${type}Tab-exercise`).addEventListener('click', async () => {
    LocalStorageManager.save(IS_ON_LEARN_KEY, "exercise")
    await loadAndShowWords()
  })
})

async function loadAndShowWords() {
  const isOnLearn = LocalStorageManager.load(IS_ON_LEARN_KEY)
  try {
    await loadWords()
    if (isOnLearn === "learn") {
      showLearnWord()
      return
    }
    if (isOnLearn === "exercise") {
      showExerciseWord()
      return
    }
  } catch (error) {
    console.error('Kelime yükleme hatası:', error)
  }
}

// Kelime yükleme fonksiyonu
export async function loadWords() {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  let wordList = LocalStorageManager.load(WORD_LIST_KEY)
  let wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY)

  try {

    const response = await fetch(`${ASSETS_BASE_URL}/json/${level}/${category}/${wordType}.json`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    wordList = [...data]
    wordListExercise = [...data]
    const totalWordsExercise = wordList.length
    const totalWordsLearn = wordList.length

    LocalStorageManager.save(TOTAL_WORD_EXERCISE_KEY, totalWordsExercise)
    LocalStorageManager.save(TOTAL_WORD_LEARN_KEY, totalWordsLearn)
    LocalStorageManager.save(WORD_LIST_KEY, ListUtils.shuffleArray(wordList))
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, ListUtils.shuffleArray(wordListExercise))

  } catch (error) {
    console.error('Error fetching JSON:', error)
    throw error
  }
}

function checkIsOnLearnOrExercise() {
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const exerciseTab = document.getElementById(`${wordType}Tab-exercise`)
  const learnTab = document.getElementById(`${wordType}Tab-learn`)
  if (learnTab.classList.contains('w--current')) {
    LocalStorageManager.save(IS_ON_LEARN_KEY, 'learn')
    return
  }
  if (exerciseTab.classList.contains('w--current')) {
    LocalStorageManager.save(IS_ON_LEARN_KEY, 'exercise')
    return
  }
}

// On Page Changes
document.addEventListener('DOMContentLoaded', async () => {
  try {
    //const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
    const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
    setupEventListeners()

    // Sayfa değişimlerini izle
    const observer = new MutationObserver((mutations) => {
      // Sadece gerekli değişikliklerde event listener'ları güncelle
      const shouldUpdate = mutations.some((mutation) => {
        return Array.from(mutation.addedNodes).some(
          (node) =>
            node.nodeType === 1 && // Element node
            (node.id === `repeatButtonLearn-${wordType}` ||
              node.id === `iKnowButtonLearn-${wordType}` ||
              node.id === `outfav-${wordType}` ||
              node.id === `infav-${wordType}`)
        )
      })

      if (shouldUpdate) {
        setupEventListeners()
      }
    })

    // Sadece body içindeki değişiklikleri izle
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  } catch (error) {
    console.error('Error in DOMContentLoaded:', error)
  }
})

export const nounDerAnswerClickHandler = function (event) {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('der')
}

export const nounDieAnswerClickHandler = function (event) {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('die')
}

export const nounDasAnswerClickHandler = (event) => {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNounAnswer('das')
}

document
  .getElementById('buttonDer')
  .addEventListener('click', nounDerAnswerClickHandler)

document
  .getElementById('buttonDie')
  .addEventListener('click', nounDieAnswerClickHandler)

document
  .getElementById('buttonDas')
  .addEventListener('click', nounDasAnswerClickHandler)

const nonNounWrongAnswerClickHandler = (event) => {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNonNounAnswer(false)
}

const nonNounCorrectAnswerClickHandler = (event) => {
  event.preventDefault() // Sayfanın yukarı kaymasını engeller
  checkNonNounAnswer(true)
}

const filteredTypes = types.filter(type => type !== 'noun')

filteredTypes.forEach(type => {
  document
    .getElementById(`wrongButton-${type}`)
    .addEventListener('click', nonNounWrongAnswerClickHandler)

  document
    .getElementById(`correctButton-${type}`)
    .addEventListener('click', nonNounCorrectAnswerClickHandler)
})
// ... existing code ...

function setupEventListeners() {
  try {
    // Butonları ID ile seçelim
    const iKnowButtonNoun = document.getElementById(`iKnowButtonLearn-noun`)
    const repeatButtonNoun = document.getElementById(`repeatButtonLearn-noun`)
    const iKnowButtonVerb = document.getElementById(`iKnowButtonLearn-verb`)
    const repeatButtonVerb = document.getElementById(`repeatButtonLearn-verb`)
    const iKnowButtonAdjective = document.getElementById(
      `iKnowButtonLearn-adjective`
    )
    const repeatButtonAdjective = document.getElementById(
      `repeatButtonLearn-adjective`
    )
    const iKnowButtonAdverb = document.getElementById(`iKnowButtonLearn-adverb`)
    const repeatButtonAdverb = document.getElementById(
      `repeatButtonLearn-adverb`
    )

    setupListenerForIknowAndLearn(iKnowButtonNoun, repeatButtonNoun)
    setupListenerForIknowAndLearn(iKnowButtonVerb, repeatButtonVerb)
    setupListenerForIknowAndLearn(iKnowButtonAdjective, repeatButtonAdjective)
    setupListenerForIknowAndLearn(iKnowButtonAdverb, repeatButtonAdverb)

    const outfavNoun = document.getElementById(`outfav-noun`)
    const infavNoun = document.getElementById(`infav-noun`)
    const outfavVerb = document.getElementById(`outfav-verb`)
    const infavVerb = document.getElementById(`infav-verb`)
    const outfavAdjective = document.getElementById(`outfav-adjective`)
    const infavAdjective = document.getElementById(`infav-adjective`)
    const outfavAdverb = document.getElementById(`outfav-adverb`)
    const infavAdverb = document.getElementById(`infav-adverb`)

    // Noun - Favorite buttons
    if (outfavNoun && !outfavNoun.hasAttribute('listener-attached')) {
      outfavNoun.addEventListener('click', addToFavorites)
      outfavNoun.setAttribute('listener-attached', 'true')
    }

    if (infavNoun && !infavNoun.hasAttribute('listener-attached')) {
      infavNoun.addEventListener('click', removeFavorite)
      infavNoun.setAttribute('listener-attached', 'true')
    }
    // Verb - Favorite buttons
    if (outfavVerb && !outfavVerb.hasAttribute('listener-attached')) {
      outfavVerb.addEventListener('click', addToFavorites)
      outfavVerb.setAttribute('listener-attached', 'true')
    }

    if (infavVerb && !infavVerb.hasAttribute('listener-attached')) {
      infavVerb.addEventListener('click', removeFavorite)
      infavVerb.setAttribute('listener-attached', 'true')
    }
    // Adjective - Favorite buttons
    if (outfavAdjective && !outfavAdjective.hasAttribute('listener-attached')) {
      outfavAdjective.addEventListener('click', addToFavorites)
      outfavAdjective.setAttribute('listener-attached', 'true')
    }

    if (infavAdjective && !infavAdjective.hasAttribute('listener-attached')) {
      infavAdjective.addEventListener('click', removeFavorite)
      infavAdjective.setAttribute('listener-attached', 'true')
    }
    // Adverb - Favorite buttons
    if (outfavAdverb && !outfavAdverb.hasAttribute('listener-attached')) {
      outfavAdverb.addEventListener('click', addToFavorites)
      outfavAdverb.setAttribute('listener-attached', 'true')
    }

    if (infavAdverb && !infavAdverb.hasAttribute('listener-attached')) {
      infavAdverb.addEventListener('click', removeFavorite)
      infavAdverb.setAttribute('listener-attached', 'true')
    }
  } catch (error) {
    console.error('Error in setupEventListeners:', error)
  }
}

const iKnowButtonClickHandler = (event) => {
  event.preventDefault()
  iKnowLearn()
}

const repeatButtonClickHandler = (event) => {
  event.preventDefault()
  repeatLearn()
}

function setupListenerForIknowAndLearn(iKnowButton, repeatButton) {
  // I Know button
  if (iKnowButton && !iKnowButton.hasAttribute('listener-attached')) {
    iKnowButton.addEventListener('click', iKnowButtonClickHandler)
    iKnowButton.setAttribute('listener-attached', 'true')
  }
  // Repeat button
  if (repeatButton && !repeatButton.hasAttribute('listener-attached')) {
    repeatButton.addEventListener('click', repeatButtonClickHandler)
    repeatButton.setAttribute('listener-attached', 'true')
  }
}

$('a').click(function () {
  $('nav').removeClass('w--open')
})
$('a').click(function () {
  $('div').removeClass('w--open')
})
