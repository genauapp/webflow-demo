// packPracticeJourneyComponent.js
import { packPracticeJourneyService } from '../../../service/level/PackPracticeJourneyService.js'
import {
  initJourneyMapCardBody,
  updateJourneyMap,
  unmountJourneyMapCardBody,
} from './journeyMapCardBody.js'
import {
  mountPackPractice,
  unmountPackPractice,
} from '../packPractice/packPractice.js'
import { protectedApiService } from '../../../service/apiService.js'

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
  updateJourneyMap(journeyState)
}

function handleStageSelection(stageId) {
  els.journeyMapCard().style.display = 'none'

  const journeyState = packPracticeJourneyService.getJourneyState(currentPackId)

  mountPackPracticeForStage(journeyState, stageId, (results) => {
    // Stage completed callback
    const updatedJourney = packPracticeJourneyService.completeStage(
      currentPackId,
      stageId
    )

    // // Send analytics
    // protectedApiService.logStageCompletion(currentPackId, stageId, results)

    // // Return to journey view
    els.journeyMapCard().style.display = 'flex'
  })
}

function mountPackPracticeForStage(journeyState, stageId, onStageCompleted) {
  mountPackPractice(
    journeyState.pack.id,
    journeyState.pack.type,
    journeyState.pack.level,
    journeyState.deckSummaries[stageId].wordType,
    journeyState.deckSummaries[stageId].exerciseType,
    onStageCompleted // Completion callback
  )
}

export function mountPackPracticeJourney(packSummary) {
  currentPackId = packSummary.id

  initElements()

  // Show root
  els.container().style.display = 'flex'

  // Initialize journey service with callbacks
  const initialJourneyState = packPracticeJourneyService.createSession(
    packSummary,
    {
      onUpdate: (updatedState) => {
        updateJourney(updatedState)
      },
    }
  )

  renderJourney(initialJourneyState)
}

export function unmountPackPracticeJourney() {
  // Hide root
  els.container().style.display = 'none'

  unmountJourneyMapCardBody()
  resetElements()

  currentPackId = null
}
