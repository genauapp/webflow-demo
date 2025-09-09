import { mountDeckPractice, unmountDeckPractice } from '../level/deckPractice/deckPractice.js'
import LocalStorageManager from '../../utils/LocalStorageManager.js'

let state = {
  mounted: false
}

// Create a deck summary for starter pack - MIXED type indicates it's a starter pack
const STARTER_PACK_DECK_SUMMARY = {
  id: "starter-pack-deck",
  exerciseType: "MIXED", // KEY: This triggers static data loading and MIXED mode
}

function handleStarterPackCompletion(resultsData, postPayload) {
  // Store completion in localStorage
  LocalStorageManager.save('STARTER_PACK_COMPLETED', true)
  
  // Optional: Show completion message or redirect
  console.log('Starter pack completed!', resultsData)
  
  // Hide the starter pack
  unmountStarterPack()
}

export function mountStarterPack() {
  if (state.mounted) return
  
  state.mounted = true
  
  // Use deckPractice exactly like packJourney does - no extra flags
  mountDeckPractice(
    STARTER_PACK_DECK_SUMMARY, 
    handleStarterPackCompletion
  )
}

export function unmountStarterPack() {
  if (!state.mounted) return
  
  unmountDeckPractice()
  state.mounted = false
}
