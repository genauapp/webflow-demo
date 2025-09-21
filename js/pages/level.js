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
// import {
//   mountMicroQuiz,
//   unmountMicroQuiz,
// } from '../components/level/microQuiz/microQuiz.js'
import AuthService from '../service/AuthService.js'
import {
  showSigninModal,
  hideSigninModal,
  initSigninComponent,
} from '../components/layout/signin.js'
import eventService from '../service/events/EventService.js'
import { AuthEvent } from '../constants/events.js'
import StringUtils from '../utils/StringUtils.js'

// Make pack summaries accessible and updatable
export let packSummariesOfCurrentLevel = []

// On Initial Load
// // fetch pack summaries
// // show initial journey or micro-quiz
function initializeLevelPage() {
  LocalStorageManager.clearDeprecatedLocalStorageItems()

  // Unmount any previously opened components
  unmountPackJourney()
  // If you have other unmounts, add here (e.g., unmountMicroQuiz())

  const currentLevel = LevelManager.getCurrentLevel()
  protectedApiService
    .getPackSummariesOfLevel(currentLevel)
    .then(({ data: packSummariesOfCurrentLevel }) => {
      // console.log(JSON.stringify(packSummariesOfCurrentLevel))

      // change Level Header top of the pack screen
      const levelLabel = `Level: ${currentLevel}`
      document.getElementById('pack-level-header').innerText = levelLabel

      // Load current category from localStorage, set it to null if not found
      const selectedPackSummary = LocalStorageManager.load(
        CURRENT_PACK_KEY,
        null
      )
      
      // Check if user has any packs (content ready) or needs onboarding
      if (packSummariesOfCurrentLevel.length === 0) {
        showContentSetupMessage()
        return
      }
      
      loadPackPropsOnLevelPage(packSummariesOfCurrentLevel)
      // If current pack is null or belongs on another level, show select pack message
      if (
        selectedPackSummary === null ||
        selectedPackSummary.pack_level !== currentLevel
      ) {
        // clear selection
        LocalStorageManager.save(CURRENT_PACK_KEY, null)
        hideContentSetupMessage()
        showSelectCategoryMessage()
        return
      }

      hideSelectCategoryMessage()
      hideContentSetupMessage()
      updatePackAvatarImages(selectedPackSummary.pack_id)
      // hide old learn/exercise elements
      document.getElementById('content-container').style.display = 'none'

      mountPackJourney(selectedPackSummary)
    })
}

// Exported function to update a pack summary in-place
export function updatePackSummaryInLevel(updatedPackSummary) {
  const idx = packSummariesOfCurrentLevel.findIndex(
    (ps) => ps.pack_id === updatedPackSummary.pack_id
  )
  if (idx !== -1) {
    packSummariesOfCurrentLevel[idx] = updatedPackSummary
    loadPackPropsOnLevelPage(packSummariesOfCurrentLevel)
    console.log('Updated pack summary in level:', updatedPackSummary.pack_id)
  } else {
    console.log('Pack summary not found in level:', updatedPackSummary.pack_id)
  }
}

function handleAuthStateChanged({ unauthorized, user }) {
  if (unauthorized || !user) {
    showSigninModal()
    // Hide all content
    document.getElementById('content-container').style.display = 'none'
    document.getElementById('pack-level-header').innerText = ''
    showSelectCategoryMessage()
    return
  } else {
    hideSigninModal()
    initializeLevelPage()
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Signin Component (modal and button)
  initSigninComponent({
    signinModal: 'modal-signin-container',
    googleSigninButton: 'btn-modal-google-signin',
  })
  // Subscribe to AuthEvent.AUTH_STATE_CHANGED using eventService
  eventService.subscribe(AuthEvent.AUTH_STATE_CHANGED, (event) => {
    handleAuthStateChanged(event.detail)
  })
  // Add reload button event listener
  const reloadButton = document.getElementById('btn-reload-content')
  if (reloadButton) {
    console.log('Reload button found, attaching event listener')
    reloadButton.style.cursor = 'pointer'
    reloadButton.addEventListener('click', (e) => {
      console.log('Reload button clicked!')
      e.preventDefault()
      e.stopPropagation()
      handleReloadContent()
    })
  } else {
    console.log('Reload button not found in DOM')
  }
  // Optionally, trigger initial auth check
  AuthService.initialize()
})

//  initialize pack avatar images
// // attach click handlers to them
function loadPackPropsOnLevelPage(packSummariesOfCurrentLevel) {
  // Journey Pack Elements
  const journeyPackSummaryGrid = document.getElementById(
    'journey-pack-summary-container-grid'
  )
  // Clear previous journey packs
  journeyPackSummaryGrid.innerHTML = ''

  // Micro Quiz Pack Elements
  const microQuizSummarySection = document.getElementById(
    'micro-quiz-pack-summary-section'
  )
  const microQuizSummaryGrid = document.getElementById(
    'micro-quiz-pack-summary-container-grid'
  )
  // Clear previous micro quiz packs
  microQuizSummaryGrid.innerHTML = ''

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
    h1.textContent = StringUtils.capitalizeWords(packSummary.pack_english)

    linkBlock.appendChild(img)
    linkBlock.appendChild(h1)

    // Add pack-summary-words-count-container element
    const wordsCount = packSummary.total_words_count || 0
    const wordsCountHTML = `
    <div id="Word_Count_Badge" class="w-layout-hflex pack-summary-words-count-container">
      <img src="https://cdn.prod.website-files.com/677da6ae8464f53ea15d73ac/683c7cefa0f6a98cfe516c78_WordsIcon.svg" loading="lazy" alt="" class="image-21">
      <div class="w-layout-hflex pack-summary-words-count">
        <div id="Word_Count_Text" class="words-count-label">${wordsCount}</div>
      </div>
    </div>
  `
    linkBlock.insertAdjacentHTML('beforeend', wordsCountHTML)

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
  // hide "no pack is selected" UI and setup message
  hideSelectCategoryMessage()
  hideContentSetupMessage()

  // hide old learn/exercise
  document.getElementById('content-container').style.display = 'none'

  // unmount previously opened components
  unmountPackJourney()
  // unmountMicroQuiz()

  // if (selectedPack.pack_type === PackType.JOURNEY) {
  //   mountPackJourney(selectedPack)
  // } else if (selectedPack.pack_type === PackType.MICRO_QUIZ) {
  //   mountMicroQuiz(selectedPack)
  // }

  mountPackJourney(selectedPack)

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

function showContentSetupMessage() {
  const contentContainer = document.getElementById('content-container')
  const selectCategoryMessage = document.getElementById('select-category-message')
  const journeyPackSummarySection = document.getElementById('journey-pack-summary-section')
  const microQuizSummarySection = document.getElementById('micro-quiz-pack-summary-section')
  contentContainer.style.display = 'none'
  selectCategoryMessage.style.display = 'none'
  journeyPackSummarySection.style.display = 'none'
  microQuizSummarySection.style.display = 'none'

  const contentSetupMessage = document.getElementById('content-setup-message-container')
  contentSetupMessage.style.display = 'flex'
}

function hideContentSetupMessage() {
  const contentSetupMessage = document.getElementById('content-setup-message-container')
  contentSetupMessage.style.display = 'none'

  const journeyPackSummarySection = document.getElementById('journey-pack-summary-section')
  const microQuizSummarySection = document.getElementById('micro-quiz-pack-summary-section')
  journeyPackSummarySection.style.display = 'flex' // or whatever the original display value is
  microQuizSummarySection.style.display = 'flex' // or whatever the original display value is
}

async function handleReloadContent() {
  console.log('handleReloadContent called')
  try {
    console.log('Checking onboarding status...')
    const { data, error } = await protectedApiService.getOnboardingStatus()
    if (error) {
      console.error('Failed to check onboarding status:', error)
      return
    }
    
    console.log('Onboarding status response:', data)
    // Check if data is directly a boolean or has a status property
    const isReady = data === true || data?.status === true
    
    if (isReady) {
      // Content is ready - reload the level page
      console.log('Content is ready! Reloading level page...')
      hideContentSetupMessage()
      initializeLevelPage()
    } else {
      console.log('Content not ready yet, status:', data)
    }
    // If status is false, do nothing - user can try again
  } catch (err) {
    console.error('Error checking onboarding status:', err)
  }
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
