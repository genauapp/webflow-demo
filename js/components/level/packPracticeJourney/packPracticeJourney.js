// packPracticeJourneyComponent.js
import { packPracticeJourneyService } from '../../../service/level/PackPracticeJourneyService.js'
import {
  initPackPracticeJourneyMap,
  updateJourneyMap,
  unmountPackPracticeJourneyMap,
} from './packPracticeJourneyMap.js'
import {
  mountPackPractice,
  unmountPackPractice,
} from '../packPractice/packPractice.js'
import { protectedApiService } from '../../../service/apiService.js'

let currentPackId = null

function updateJourneyUI(journeyState) {
  updateJourneyMap(journeyState)
}

function handleStageSelection(stageId) {
  unmountPackPracticeJourney()

  mountPackPracticeForStage(currentPackId, stageId, (results) => {
    // Stage completed callback
    const updatedJourney = packPracticeJourneyService.completeStage(
      currentPackId,
      stageId
    )

    // Send analytics
    protectedApiService.logStageCompletion(currentPackId, stageId, results)

    // Return to journey view
    mountPackPracticeJourney(currentPackId)
  })
}

function mountPackPracticeForStage(packId, stageId, onStageCompleted) {
  mountPackPractice(
    packId,
    'regular', // packLevel
    'vocabulary', // exerciseType
    stageId, // Stage context
    onStageCompleted // Completion callback
  )
}

export function mountPackPracticeJourney(packId) {
  currentPackId = packId

  // Initialize journey service with callbacks
  const journeyState = packPracticeJourneyService.initJourney(packId, {
    onUpdate: (updatedState) => {
      updateJourneyUI(updatedState)
    },
  })

  // Initialize journey map
  initPackPracticeJourneyMap(journeyState, handleStageSelection)
}

export function unmountPackPracticeJourney() {
  unmountPackPracticeJourneyMap()
  currentPackId = null
}
