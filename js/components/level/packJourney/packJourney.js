// packJourney.js
import { packJourneyService } from '../../../service/level/PackJourneyService.js'
import {
  initJourneyMapCardBody,
  updateJourneyMap,
  unmountJourneyMapCardBody,
} from './journeyMapCardBody.js'
import {
  mountDeckPractice,
  unmountDeckPractice,
} from '../deckPractice/deckPractice.js'
import { protectedApiService } from '../../../service/apiService.js'
import {
  mountBackToJourneyButton,
  unmountBackToJourneyButton,
} from './backToJourneyButton.js'

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
    journeyState.deckSummaries.length === 0
  )
    return

  els.journeyMapCard().style.display = 'flex'

  // Initialize journey map
  initJourneyMapCardBody(journeyState, handleStageSelection)
}

function updateJourney(journeyState) {
  updateJourneyMap(journeyState, handleStageSelection)
}

function handleStageSelection(stageId) {
  // els.journeyMapCard().style.display = 'none'
  els.container().style.display = 'none'

  const journeyState = packJourneyService.getJourneyState(currentPackId)

  mountDeckPracticeForStage(journeyState, stageId, (results) => {
    // Pass results to completion handler
    packJourneyService.completeStage(currentPackId, stageId, results)

    // // Return to journey view
    // els.journeyMapCard().style.display = 'flex'
    els.container().style.display = 'flex'
  })
}

function mountDeckPracticeForStage(journeyState, stageId, onStageCompleted) {
  // Mount back button with navigation handler
  mountBackToJourneyButton(journeyState.name.german, () => {
    unmountDeckPractice()
    els.container().style.display = 'flex'
  })

  const currentDeckSummary = journeyState.deckSummaries.find(
    (stage) => stage.id === stageId
  )

  mountDeckPractice(
    journeyState.pack.id,
    journeyState.pack.type,
    journeyState.pack.level,
    currentDeckSummary.wordType,
    currentDeckSummary.exerciseType,
    onStageCompleted // Completion callback
  )
}

export function mountPackJourney(packSummary) {
  currentPackId = packSummary.id

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
  unmountBackToJourneyButton()
  resetElements()

  currentPackId = null
}
