import { LEARN_ELEMENT_IDS } from '../../constants/elements.js'
import LocalStorageManager from '../LocalStorageManager.js'
import {
  DEFAULT_VALUE,
  CURRENT_WORD_TYPE_KEY,
  WORD_LIST_KEY,
  CURRENT_CATEGORY_KEY,
  IS_ON_LEARN_KEY,
  WORD_LIST_EXERCISE_KEY,
} from '../../constants/storageKeys.js'
import { categories } from '../../constants/props.js'
import { loadAndShowWords } from '../../pages/level.js'
import LevelManager from '../LevelManager.js'
import {
  mountMicroQuiz,
  unmountMicroQuiz,
} from '../../components/level/microQuiz/microQuizContainer.js'

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

export function loadDeckPropsOnLevelPage() {
  const level = LevelManager.getCurrentLevel()
  for (let i = 0; i <= categories[level].length - 1; i++) {
    // <div> elementini oluştur
    const linkBlock = document.createElement('div')
    linkBlock.classList.add('pack-link-block')
    linkBlock.style.display = 'flex'
    linkBlock.style.flexDirection = 'column'
    linkBlock.style.position = 'relative'

    // <img> elementini oluştur
    const img = document.createElement('img')
    img.src = categories[level][i].imgUrl
    img.loading = 'lazy'
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.maxWidth = '100%'
    img.id = `deck-${i}`
    img.dataset.option = categories[level][i].nameShort
    img.classList.add('deck-img', 'image-19')

    // <h1> elementini oluştur
    const h1 = document.createElement('h1')
    h1.id = `deck-title-${i}`
    h1.classList.add('heading-42')
    h1.textContent = categories[level][i].nameEng
    h1.style.fontFamily = 'Lato, sans-serif'
    h1.style.fontWeight = '400'
    h1.style.fontSize = '16px'
    h1.style.lineHeight = '16px'
    h1.style.color = '#333'

    linkBlock.appendChild(img)
    linkBlock.appendChild(h1)

    // Son olarak istediğin yere ekle, örneğin bir container'a:
    document.getElementById('pack-container-grid').appendChild(linkBlock)

    /* Word Count Badge için burayı düzenleyeceğiz

    // <div id="Word_Count_Badge" ...> elementini oluştur
    const wordCountBadge = document.createElement('div');
    wordCountBadge.id = 'Word_Count_Badge';
    wordCountBadge.classList.add('w-layout-hflex', 'wordcountbadge');

    // <img> icon için
    const wordIcon = document.createElement('img');
    wordIcon.src = 'https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/683c7cefa0f6a98cfe516c78_WordsIcon.svg';
    wordIcon.loading = 'lazy';
    wordIcon.alt = '';
    wordIcon.classList.add('image-21');

    // <div class="w-layout-hflex flex-block-94">
    const flexBlock = document.createElement('div');
    flexBlock.classList.add('w-layout-hflex', 'flex-block-94');

    // <div id="Word_Count_Text" ...>
    const wordCountText = document.createElement('div');
    wordCountText.id = 'Word_Count_Text';
    wordCountText.classList.add('wordcounttext');
    wordCountText.textContent = `${}` + ' Words'; // kelime sayısını burada dinamik verebilirsiniz

    // Elementleri birbirine bağla
    flexBlock.appendChild(wordCountText);
    flexBlock.appendChild(textBlock);
    wordCountBadge.appendChild(wordIcon);
    wordCountBadge.appendChild(flexBlock);
    */

    //linkBlock.appendChild(wordCountBadge);

    // Category click handler
    document.querySelectorAll('.deck-img').forEach((elem) => {
      elem.addEventListener('click', async function (event) {
        event.preventDefault()
        //get category name from data-option attribute
        const selectedCategory = elem.getAttribute('data-option')
        //save category name to localStorage
        LocalStorageManager.save(CURRENT_CATEGORY_KEY, selectedCategory)
        organizeSelectedDeckImage()
        hideSelectCategoryMessage()
        if (selectedCategory === 'preposition') {
          // hide regular learn/exercise
          document.getElementById('content-container').style.display = 'none'

          // show preposition learn/exercise
          await mountMicroQuiz()
          // focus user Learn/Exercise area
          window.location.hash = '#action-content'
          return
        } else {
          // hide preposition learn/exercise
          unmountMicroQuiz()

          // show regular learn/exercise
          await loadAndShowWords()
          // focus user Learn/Exercise area
          window.location.hash = '#action-content'
        }
      })
    })

    // remove placeholders
    document.querySelectorAll('.placeholder').forEach((element) => {
      element.style.display = 'none'
    })
  }
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
  const level = LevelManager.getCurrentLevel()
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

export function showSelectCategoryMessage() {
  const contentContainer = document.getElementById('content-container')
  contentContainer.style.display = 'none'
  const selectCategoryMessage = document.getElementById(
    'select-category-message'
  )
  selectCategoryMessage.style.display = 'flex'
}

export function hideSelectCategoryMessage() {
  const contentContainer = document.getElementById('content-container')
  contentContainer.style.display = 'block'
  const selectCategoryMessage = document.getElementById(
    'select-category-message'
  )
  selectCategoryMessage.style.display = 'none'
}

// Remove border from all deck images and add border to the selected deck image
// Remove selected class from all deck images and add selected class to the selected deck image
export function organizeSelectedDeckImage() {
  const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const deckimgs = document.querySelectorAll('.deck-img')
  deckimgs.forEach((deckimg) => {
    deckimg.classList.remove('selected-deck-img')
    deckimg.style.border = ''
    deckimg.style.borderRadius = ''
  })
  const selectedDeckImg = [...deckimgs].find(
    (deckimg) => deckimg.dataset.option === category
  )
  selectedDeckImg.classList.add('selected-deck-img')
  selectedDeckImg.style.border = '2px solid black'
  selectedDeckImg.style.borderRadius = '16px'
}
