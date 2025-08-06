// packJourney.js
import { packJourneyService } from '../../../service/level/PackJourneyService.js'
import {
  mountJourneyMapCardBody,
  updateJourneyMap,
  unmountJourneyMapCardBody,
} from './journeyMapCardBody.js'
import {
  mountDeckPractice,
  unmountDeckPractice,
} from '../deckPractice/deckPractice.js'
import { protectedApiService } from '../../../service/apiService.js'
import {
  mountReturnToJourneyButton,
  unmountReturnToJourneyButton,
} from './returnToJourneyButton.js'

let currentPackId = null

let els = {}

/** Initialize elements dynamically using provided IDs */
function initElements() {
  els = {
    container: () => document.getElementById('pack-journey-map-container'),
    // loadingContainer: () => document.getElementById("tbd"),
    // errorContainer: () => document.getElementById("tbd"),
    // emptyContainer: () => document.getElementById("tbd"),

    journeyMapCard: () => document.getElementById('pack-journey-map-card'),
  }
}

function resetElements() {
  els = {}
}

function renderJourney(journeyState) {
  if (
    !journeyState ||
    !journeyState.deckSummaries ||
    journeyState.deckSummaries.length < 1
  )
    return

  // MICRO_QUIZ
  if (journeyState.deckSummaries.length < 2) {
    els.container().style.display = 'none'
    els.journeyMapCard().style.display = 'none'
    const singleDeckSummary = journeyState.deckSummaries[0]
    mountSingleDeckPractice(journeyState.pack, singleDeckSummary)
  } else {
    // Initialize journey map
    els.journeyMapCard().style.display = 'flex'
    mountJourneyMapCardBody(journeyState, handleStageSelection)
  }
}

const handleStageCompletion = (currentPackId, currentDeckId) => {
  // return callback
  return async (resultsData, postPayload) => {
    // 1. Complete stage via service (handles POST and local update)
    await packJourneyService.completeStage(currentPackId, currentDeckId, postPayload)
    // 2. Optionally, re-render or show completion UI
    // els.journeyMapCard().style.display = 'flex'
    // els.container().style.display = 'flex'
  }
}

function updateJourney(journeyState) {
  updateJourneyMap(journeyState, handleStageSelection)
}

function handleStageSelection(stageId) {
  // els.journeyMapCard().style.display = 'none'
  els.container().style.display = 'none'

  const journeyState = packJourneyService.getJourneyState(currentPackId)

  const currentDeckSummary = journeyState.deckSummaries.find(
    (stage) => stage.id === stageId
  )
  mountMultiDeckPractice(journeyState.pack, currentDeckSummary)
}

function mountSingleDeckPractice(currentPackSummary, currentDeckSummary) {
  mountDeckPractice(
    currentDeckSummary,
    handleStageCompletion(currentPackSummary.id, currentDeckSummary.id) // that returns completion callback
  )
}

function mountMultiDeckPractice(currentPackSummary, currentDeckSummary) {
  // Mount back button with navigation handler
  mountReturnToJourneyButton(currentPackSummary.name.english, () => {
    unmountDeckPractice()
    unmountReturnToJourneyButton()

    els.container().style.display = 'flex'
  })

  mountDeckPractice(
    currentDeckSummary,
    handleStageCompletion(currentPackSummary.id, currentDeckSummary.id) // that returns completion callback
  )
}

export function mountPackJourney(packSummary) {
  currentPackId = packSummary.pack_id

  initElements()

  // Show root
  els.container().style.display = 'flex'

  // Initialize journey service with callbacks
  const initialJourneyState = packJourneyService.createSession(packSummary, {
    onUpdate: (updatedState) => {
      updateJourney(updatedState)
    },
  })

  renderJourney(initialJourneyState)
}

export function unmountPackJourney() {
  // Hide root
  if (els.container) els.container().style.display = 'none'

  unmountJourneyMapCardBody()
  unmountReturnToJourneyButton()
  unmountDeckPractice()
  resetElements()

  currentPackId = null
}
