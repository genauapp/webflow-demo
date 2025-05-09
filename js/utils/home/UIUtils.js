import { LEARN_ELEMENT_IDS } from '../../constants/elements.js'
import LocalStorageManager from '../LocalStorageManager.js'
import {
  DEFAULT_VALUE,
  CURRENT_WORD_TYPE_KEY,
  WORD_LIST_KEY,
  CURRENT_LEVEL_KEY,
  LEARNED_WITH_EXERCISE_WORDS_KEY,
  CURRENT_CATEGORY_KEY,
  IS_ON_LEARN_KEY,
  WORD_LIST_EXERCISE_KEY,
} from '../../constants/storageKeys.js'
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
  return !(
    level === '' ||
    level === 'einburgerungstest' ||
    level === 'passive-level'
  )
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
  const level = LocalStorageManager.load(
    CURRENT_LEVEL_KEY,
    DEFAULT_VALUE.CURRENT_LEVEL
  )
  const deckContainers = document.querySelectorAll('.deck-container')
  categories[level].forEach((item, i) => {
    const deckTitle = item.nameEng
    const deckImgURL = item.imgUrl
    const deckShortName = item.nameShort

    deckContainers[i].children[0].src = deckImgURL
    deckContainers[i].children[1].innerText = deckTitle
    deckContainers[i].dataset.option = deckShortName
  })
}

export function showFinishScreen() {
  const learnOrExercise = LocalStorageManager.load(IS_ON_LEARN_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  let contentContainer = document.getElementById(
    `content-container-${learnOrExercise}-${wordType}`
  )
  contentContainer.style.display = 'none'
  let successScreen = document.getElementById('success-screen')
  let tabPane = document.getElementById(
    `tab-pane-${learnOrExercise}-${wordType}`
  )
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
  let learnedWordsList = LocalStorageManager.load(
    `LEARNED_WITH_${learnOrExercise.toUpperCase()}_WORDS`
  )
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const level = LocalStorageManager.load(CURRENT_LEVEL_KEY)
  let contentContainer = document.getElementById(
    `content-container-${learnOrExercise}-${wordType}`
  )
  let successScreen = document.getElementById('success-screen')

  learnedWordsList[level][category][wordType] = []
  LocalStorageManager.save(
    `LEARNED_WITH_${learnOrExercise.toUpperCase()}_WORDS`,
    learnedWordsList
  )

  successScreen.style.display = 'none'
  contentContainer.style.display = 'flex'

  await loadAndShowWords()
}

export function hideFinishScreen() {
  const learnOrExercise = LocalStorageManager.load(IS_ON_LEARN_KEY)
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  let contentContainer = document.getElementById(
    `content-container-${learnOrExercise}-${wordType}`
  )
  let successScreen = document.getElementById('success-screen')
  successScreen.style.display = 'none'
  contentContainer.style.display = 'flex'
}

export function showCorrectMessage() {
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const feedbackMessageContainer = document.getElementById(
    `feedbackMessage-${wordType}`
  )
  const correctMessageDiv = document.createElement('div')
  Object.assign(correctMessageDiv.style, {
    display: 'inline-block',
    backgroundColor: 'rgba(0, 179, 134, 0.15)', // soft yeşil (opacity düşük)
    border: '2px solid rgba(0, 179, 134, 0.5)', // biraz daha koyu
    color: '#00b386', // yazı rengi: saf yeşil tonu
    fontWeight: 'bold',
    fontSize: '18px',
    padding: '12px 24px',
    borderRadius: '999px',
    textAlign: 'center',
    marginTop: '20px',
  })

  correctMessageDiv.innerText = 'Correct! 🎉'
  feedbackMessageContainer.appendChild(correctMessageDiv)
}

export function showWrongMessage() {
  const wordType = LocalStorageManager.load(CURRENT_WORD_TYPE_KEY)
  const feedbackMessageContainer = document.getElementById(
    `feedbackMessage-${wordType}`
  )
  const wrongDiv = document.createElement('div')
  const wordListExercise = LocalStorageManager.load(WORD_LIST_EXERCISE_KEY)
  const currentWord = wordListExercise[0]
  let message = ''

  if (wordType === 'noun') {
    if (currentWord.rule || currentWord.rule !== '') {
      message = '✨ No worries! <br>' + currentWord.rule
    } else if (!currentWord.rule || currentWord.rule === '') {
      message =
        '✨ No worries! <br> Correct artikel was ' +
        '"' +
        currentWord.artikel +
        '"'
    }
  } else if (wordType || wordType !== 'noun') {
    message =
      '✨ No worries! <br> Correct translation was' +
      ' "' +
      currentWord.english +
      '"'
  }

  // İçeriğe emoji ve vurgulu kısım ekleniyor (HTML desteğiyle)
  wrongDiv.innerHTML = message

  Object.assign(wrongDiv.style, {
    display: 'inline-block',
    backgroundColor: 'rgba(255, 0, 0, 0.1)', // yumuşak kırmızı
    border: '2px solid rgba(255, 0, 0, 0.4)', // daha koyu kırmızı
    color: '#b00000', // yazı rengi: koyu kırmızı ton
    fontWeight: '500',
    fontSize: '14px',
    padding: '12px 20px',
    borderRadius: '999px',
    textAlign: 'center',
    lineHeight: '1.4',
    minWidth: '90%',
    marginTop: '20px',
  })

  feedbackMessageContainer.appendChild(wrongDiv)
}

const count = 200,
  defaults = {
    origin: { y: 0.7 },
  }

function fireConfetti(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  )
}

export function confettiAnimation() {
  fireConfetti(0.25, {
    spread: 26,
    startVelocity: 55,
  })

  fireConfetti(0.2, {
    spread: 60,
  })

  fireConfetti(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  })

  fireConfetti(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  })

  fireConfetti(0.1, {
    spread: 120,
    startVelocity: 45,
  })
}

/** Payment */
/** // Payment Container | Show/Hide  */
export function showPaymentContainerModal() {
  console.log('showing: Payment Container Modal')

  //   const isReadyToPayment = LocalStorageManager.load(
  //     IS_READY_TO_PAYMENT,
  //     DEFAULT_VALUE.IS_READY_TO_PAYMENT
  //   )
  const modalContainer = document.getElementById('modal-payment-container')
  modalContainer.style.display = 'flex'

  modalContainer.addEventListener('click', showInitialPaymentModal)

  document
    .querySelectorAll('.button-modal-payment-close')
    .forEach((buttonClose) => {
      buttonClose.addEventListener('click', hideModals)
    })
  const hideModals = () => {
    // LocalStorageManager.save(IS_READY_TO_PAYMENT, false)
    hideInitialPaymentModal()
    hideFinalPaymentModal()
    hidePaymentContainerModal()
    modalContainer.removeEventListener('click', showInitialPaymentModal)

    document
      .querySelectorAll('.button-modal-payment-close')
      .forEach((buttonClose) => {
        buttonClose.removeEventListener('click', hideModals)
      })
  }
}

export function hidePaymentContainerModal() {
  console.log('hiding: Payment Container Modal')

  const modalContainer = document.getElementById('modal-payment-container')
  modalContainer.style.display = 'none'
  modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0)'
}

/** // Initial Payment | Show/Hide  */
export function showInitialPaymentModal() {
  console.log('showing: Initial Payment Modal')
  const modalContainer = document.getElementById('modal-payment-container')
  modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.16)'
  modalContainer.removeEventListener('click', showInitialPaymentModal)

  const modalInitialPayment = document.getElementById('modal-payment-initial')
  modalInitialPayment.style.display = 'flex'

  const buttonContinueToPayment = document.getElementById(
    'button-modal-payment-initial-continue'
  )
  buttonContinueToPayment.addEventListener('click', showFinalPaymentModal)

  const paymentOptions = document.querySelectorAll('.paymentoption')
  paymentOptions.forEach((option) => {
    option.addEventListener('click', paymentOptionClickHandler)
  })
}

const paymentOptionClickHandler = () => {
  // Remove selection from all options
  document.querySelectorAll('.paymentoption').forEach((opt) => {
    opt.classList.remove('paymentselected')
    console.log(`${option.getAttribute('payment-option')} is unselected.`)
  })

  // Add selection to clicked option
  option.classList.add('paymentselected')
  console.log(`${option.getAttribute('payment-option')} is selected.`)
}

export function hideInitialPaymentModal() {
  console.log('hiding: Initial Payment Modal')
  const modalInitialPayment = document.getElementById('modal-payment-initial')
  modalInitialPayment.style.display = 'none'

  const buttonContinueToPayment = document.getElementById(
    'button-modal-payment-initial-continue'
  )
  buttonContinueToPayment.removeEventListener('click', showFinalPaymentModal)

  const paymentOptions = document.querySelectorAll('.paymentoption')
  paymentOptions.forEach((option) => {
    option.addEventListener('click', paymentOptionClickHandler)
  })
}

/** // Final Payment | Show/Hide  */
export function showFinalPaymentModal() {
  console.log('showing: Final Payment Modal')

  hideInitialPaymentModal()
  const modalFinalPayment = document.getElementById('modal-payment-final')
  modalFinalPayment.style.display = 'flex'

  const buttonCopyToClipboard = document.getElementById(
    'button-modal-payment-final-copy-clipboard'
  )
  buttonCopyToClipboard.addEventListener('click', copyToClipBoard)
  const copyToClipBoard = () => {
    navigator.clipboard.writeText('https://www.genauapp.io')
    buttonCopyToClipboard.removeEventListener('click', copyToClipBoard)
  }
}

export function hideFinalPaymentModal() {
  console.log('hiding: Final Payment Modal')
  const modalFinalPayment = document.getElementById('modal-payment-final')
  modalFinalPayment.style.display = 'none'
}
