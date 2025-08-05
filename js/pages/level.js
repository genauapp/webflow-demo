import {
  CURRENT_PACK_KEY,
  // BOOKMARKS_KEY,
  // PAYMENT_TRIGGER_COUNTER_KEY,
} from '../constants/storageKeys.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'
import { PackType } from '../constants/props.js'
import LevelManager from '../utils/LevelManager.js'
import { protectedApiService } from '../service/apiService.js'
import {
  mountPackJourney,
  unmountPackJourney,
} from '../components/level/packJourney/packJourney.js'
import {
  mountMicroQuiz,
  unmountMicroQuiz,
} from '../components/level/microQuiz/microQuiz.js'

// On Initial Load
// // fetch pack summaries
// // show initial journey or micro-quiz
document.addEventListener('DOMContentLoaded', async () => {
  LocalStorageManager.clearDeprecatedLocalStorageItems()

  // LocalStorageManager.load(BOOKMARKS_KEY, DEFAULT_VALUE.BOOKMARKS)

  const currentLevel = LevelManager.getCurrentLevel()
  // fetch pack summaries of current level
  const { data: packSummariesOfCurrentLevel } =
    await protectedApiService.getPackSummariesOfLevel(currentLevel)

  console.log(JSON.stringify(packSummariesOfCurrentLevel))

  // change Level Header top of the pack screen
  const levelLabel = `Level: ${currentLevel}`
  document.getElementById('pack-level-header').innerText = levelLabel

  // Load current category from localStorage, set it to null if not found
  const selectedPackSummary = LocalStorageManager.load(CURRENT_PACK_KEY, null)
  loadPackPropsOnLevelPage(packSummariesOfCurrentLevel)
  // If current pack is null or belongs on another level, show select pack message
  if (
    selectedPackSummary === null ||
    selectedPackSummary.pack_level !== currentLevel
  ) {
    // clear selection
    LocalStorageManager.save(CURRENT_PACK_KEY, null)
    showSelectCategoryMessage()
    return
  }

  hideSelectCategoryMessage()
  updatePackAvatarImages(selectedPackSummary.pack_id)
  // hide old learn/exercise elements
  document.getElementById('content-container').style.display = 'none'

  if (selectedPackSummary.pack_type === PackType.MICRO_QUIZ) {
    mountMicroQuiz(selectedPackSummary)
  } else if (selectedPackSummary.pack_type === PackType.JOURNEY) {
    mountPackJourney(selectedPackSummary)
    return
  }
})

//  initialize pack avatar images
// // attach click handlers to them
function loadPackPropsOnLevelPage(packSummariesOfCurrentLevel) {
  // Journey Pack Elements
  const journeyPackSummaryGrid = document.getElementById(
    'journey-pack-summary-container-grid'
  )

  // Micro Quiz Pack Elements
  const microQuizSummarySection = document.getElementById(
    'micro-quiz-pack-summary-section'
  )
  const microQuizSummaryGrid = document.getElementById(
    'micro-quiz-pack-summary-container-grid'
  )

  const isMicroQuizAbsent = !packSummariesOfCurrentLevel.some(
    (ps) => ps.pack_type === PackType.MICRO_QUIZ
  )

  if (isMicroQuizAbsent) {
    microQuizSummarySection.style.display = 'none'
  }

  packSummariesOfCurrentLevel.forEach((packSummary, i) => {
    // create <div> element
    const linkBlock = document.createElement('div')
    linkBlock.classList.add('pack-link-block')

    // create <img> element
    const img = document.createElement('img')
    img.src = packSummary.pack_image_url
    img.loading = 'lazy'
    img.id = `pack-${packSummary.pack_id}`
    img.dataset.option = packSummary.pack_id
    img.classList.add('pack-img') //, 'image-19')

    // add event listener
    img.addEventListener('click', (event) =>
      avatarImageClickHandler(event, packSummary)
    )

    // create <h1> element
    const h1 = document.createElement('h1')
    h1.id = `pack-title-${i}`
    h1.classList.add('heading-42')
    h1.textContent = packSummary.pack_english

    linkBlock.appendChild(img)
    linkBlock.appendChild(h1)

    // Son olarak istediğin yere ekle, örneğin bir container'a:
    if (packSummary.pack_type === PackType.JOURNEY) {
      journeyPackSummaryGrid.appendChild(linkBlock)
    } else if (packSummary.pack_type === PackType.MICRO_QUIZ) {
      microQuizSummaryGrid.appendChild(linkBlock)
    }
  })

  // remove placeholders
  document.querySelectorAll('.placeholder').forEach((element) => {
    element.style.display = 'none'
  })
}

function avatarImageClickHandler(event, selectedPack) {
  event.preventDefault()

  // clear location hash for re-focusing
  window.location.hash = ''

  // save pack to localStorage
  LocalStorageManager.save(CURRENT_PACK_KEY, selectedPack)

  // update pack image avatar UI
  updatePackAvatarImages(selectedPack.pack_id)
  // hide "no pack is selected" UI
  hideSelectCategoryMessage()

  // hide old learn/exercise
  document.getElementById('content-container').style.display = 'none'

  // unmount previously opened components
  unmountPackJourney()
  unmountMicroQuiz()

  if (selectedPack.pack_type === PackType.JOURNEY) {
    mountPackJourney(selectedPack)
  } else if (selectedPack.pack_type === PackType.MICRO_QUIZ) {
    mountMicroQuiz(selectedPack)
  }

  // focus user Learn/Exercise area
  window.location.hash = '#action-content'
  return
}

function showSelectCategoryMessage() {
  const contentContainer = document.getElementById('content-container')
  contentContainer.style.display = 'none'
  const selectCategoryMessage = document.getElementById(
    'select-category-message'
  )
  selectCategoryMessage.style.display = 'flex'
}

function hideSelectCategoryMessage() {
  const contentContainer = document.getElementById('content-container')
  contentContainer.style.display = 'block'
  const selectCategoryMessage = document.getElementById(
    'select-category-message'
  )
  selectCategoryMessage.style.display = 'none'
}

// Remove selected class from all deck images and add selected class to the selected deck image
function updatePackAvatarImages(selectedPackId) {
  // const category = LocalStorageManager.load(CURRENT_CATEGORY_KEY)
  const packAvatarImages = document.querySelectorAll('.pack-img')
  packAvatarImages.forEach((avatarImage) => {
    avatarImage.classList.remove('selected-pack-img')
  })
  const selectedAvatarImage = [...packAvatarImages].find(
    (avatarImage) => avatarImage.dataset.option === selectedPackId
  )
  selectedAvatarImage.classList.add('selected-pack-img')
}

// Webflow Dropdown Config
$('a').click(function () {
  $('nav').removeClass('w--open')
})
$('a').click(function () {
  $('div').removeClass('w--open')
})
