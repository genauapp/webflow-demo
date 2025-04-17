import { CURRENT_LEVEL_KEY, CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE, LEARNED_WITH_EXERCISE_WORDS_KEY, LEARNED_WITH_LEARN_WORDS_KEY, CURRENT_CATEGORY_KEY, WORD_LIST_EXERCISE_KEY, IN_PROGRESS_WORDS_KEY, WORD_LIST_KEY, TOTAL_WORD_EXERCISE_KEY, TOTAL_WORD_LEARN_KEY, CURRENT_LEARN_INDEX_KEY } from '../constants/storageKeys.js'
import { ASSETS_BASE_URL } from '../constants/urls.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'
import ListUtils from '../utils/ListUtils.js'
import { types } from '../constants/props.js'
import { removeFavorite, addToFavorites } from '../utils/home/AddOrRemoveFavs.js'
import { iKnowLearn, repeatLearn } from '../utils/home/LearnUtils.js'
import checkNonNounAnswer from '../utils/home/checkNonNounAnswer.js'
import showExerciseWord from '../utils/home/ShowExerciseWord.js'
import checkNounAnswer from '../utils/home/checkNounAnswer.js'
import showLearnWord from '../utils/home/showLearnWord.js'
import { isRegularLevel, showSkeleton,hideSkeleton, showOrHideDecks, loadDeckProps } from '../utils/home/UIUtils.js'

// On Initial Load
document.addEventListener('DOMContentLoaded', async () => {
  LocalStorageManager.clearDeprecatedLocalStorageItems()
  LocalStorageManager.save(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
  LocalStorageManager.save(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
  LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)
  LocalStorageManager.save(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)

  showSkeleton(DEFAULT_VALUE.CURRENT_WORD_TYPE)
  await executeInitialLoadAndShow()
})

// On Level Change
document.querySelectorAll('.level-dropdown-link').forEach((link) => {
  link.addEventListener('click', async function (event) {
    event.preventDefault()
    
    // Avoid errors for C1 and C2 levels which are not fully implemented
    if (link.classList.contains('passive-level')) {
      showOrHideDecks('passive-level')
      return
    }
    
    const updatedLevel = link.getAttribute('data-option')
    const selectedText = link.innerText
    const currentCategory = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
    
    // Save selected option to localStorage
    LocalStorageManager.save(CURRENT_LEVEL_KEY, updatedLevel)

    // Load Deck Props for specific Level
    loadDeckProps()

    // Dropdown başlığını güncelle
    document.getElementById('dropdownHeader').innerText = selectedText

    if (updatedLevel === 'einburgerungstest') {
      LocalStorageManager.save(CURRENT_CATEGORY_KEY, 'einburgerungstest')
      showOrHideDecks('einburgerungstest')
      await executeInitialLoadAndShow()
      return
    }
    if (currentCategory === 'einburgerungstest' && isRegularLevel(updatedLevel)) {
      showOrHideDecks(updatedLevel)
      const lastSelectedDeck = document.querySelector('.selected-deck-img').getAttribute('data-option')
      LocalStorageManager.save(CURRENT_CATEGORY_KEY, lastSelectedDeck)
      await executeInitialLoadAndShow()
      return
    }
    await executeInitialLoadAndShow()
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

    await executeInitialLoadAndShow()
  })
})

// On Word Type Change
document.getElementById('nounTab').addEventListener('click', async () => {
  console.log('Noun seçildi.')
  const nounType = types[0]
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, nounType)
  await executeInitialLoadAndShow()
})

document.getElementById('verbTab').addEventListener('click', async () => {
  console.log('Verb seçildi.')
  const verbType = types[1]
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, verbType)

  await executeInitialLoadAndShow()
})

document.getElementById('adjectiveTab').addEventListener('click', async () => {
  console.log('Adjective seçildi.')
  const adjectiveType = types[2]
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, adjectiveType)

  await executeInitialLoadAndShow()
})

document.getElementById('adverbTab').addEventListener('click', async () => {
  console.log('Adverb seçildi.')
  const adverbType = types[3]
  LocalStorageManager.save(CURRENT_WORD_TYPE_KEY, adverbType)

  await executeInitialLoadAndShow()
})

async function executeInitialLoadAndShow() {
  try {
    await loadWords()
    showLearnWord()
    showExerciseWord()
  } catch (error) {
    console.error('Kelime yükleme hatası:', error)
  }
}

// Kelime yükleme fonksiyonu
async function loadWords() {
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY, DEFAULT_VALUE.CURRENT_LEVEL)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY, DEFAULT_VALUE.CURRENT_CATEGORY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY, DEFAULT_VALUE.CURRENT_WORD_TYPE)
  const learnedWithExerciseWords = LocalStorageManager.load(LEARNED_WITH_EXERCISE_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_EXERCISE_WORDS)
  const learnedWithLearnWords = LocalStorageManager.load(LEARNED_WITH_LEARN_WORDS_KEY, DEFAULT_VALUE.LEARNED_WITH_LEARN_WORDS)
  let totalWordsLearn = 0
  let totalWordsExercise = 0
  let wordList = LocalStorageManager.load(WORD_LIST_KEY, DEFAULT_VALUE.WORD_LIST)
  let wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY, DEFAULT_VALUE.WORD_LIST_EXERCISE)

  try {
    showSkeleton(wordType)

    // Feedback mesajını temizle
    const feedbackMessage = document.getElementById(
      `feedbackMessage-${wordType}`
    )
    if (feedbackMessage) {
      feedbackMessage.innerText = ''
    }

    const response = await fetch(`${ASSETS_BASE_URL}/json/${level}/${category}/${wordType}.json`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    wordList = [...data]
    wordListExercise = [...data]
    totalWordsExercise = wordList.length
    totalWordsLearn = wordList.length

    LocalStorageManager.save(TOTAL_WORD_EXERCISE_KEY, totalWordsExercise)
    LocalStorageManager.save(TOTAL_WORD_LEARN_KEY, totalWordsLearn)
    LocalStorageManager.save(WORD_LIST_KEY, ListUtils.shuffleArray(wordList))
    LocalStorageManager.save(WORD_LIST_EXERCISE_KEY, ListUtils.shuffleArray(wordListExercise))
    LocalStorageManager.save(IN_PROGRESS_WORDS_KEY, DEFAULT_VALUE.IN_PROGRESS_WORDS)

    document.getElementById(`remainingWordsCountLearn-${wordType}`).innerText = learnedWithLearnWords[level][category][wordType].length
    document.getElementById(`remainingWordsCountExercise-${wordType}`).innerText = learnedWithExerciseWords[level][category][wordType].length
    document.getElementById(`totalWordsCountLearn-${wordType}`).innerText = totalWordsLearn
    document.getElementById(`totalWordsCountExercise-${wordType}`).innerText = totalWordsExercise

    hideSkeleton(wordType)
  } catch (error) {
    console.error('Error fetching JSON:', error)
    hideSkeleton(wordType)
    throw error
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

document
  .getElementById('wrongButton-verb')
  .addEventListener('click', nonNounWrongAnswerClickHandler)

document
  .getElementById('correctButton-verb')
  .addEventListener('click', nonNounCorrectAnswerClickHandler)

document
  .getElementById('wrongButton-adjective')
  .addEventListener('click', nonNounWrongAnswerClickHandler)

document
  .getElementById('correctButton-adjective')
  .addEventListener('click', nonNounCorrectAnswerClickHandler)

document
  .getElementById('wrongButton-adverb')
  .addEventListener('click', nonNounWrongAnswerClickHandler)

document
  .getElementById('correctButton-adverb')
  .addEventListener('click', nonNounCorrectAnswerClickHandler)

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
