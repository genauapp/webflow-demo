import { mountDeckPractice, unmountDeckPractice } from '../level/deckPractice/deckPractice.js'
import { mountStarterPackCompletion } from './starterPackCompletion.js'
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
  
  // Unmount deck practice first
  unmountDeckPractice()
  
  // Mount completion component (handles auth state internally)
  mountStarterPackCompletion()
  
  // Update state
  state.mounted = false
}

export function mountStarterPack() {
  if (state.mounted) return
  
  state.mounted = true
  
  // Check if starter pack is already completed
  const isCompleted = LocalStorageManager.load('STARTER_PACK_COMPLETED', false)
  
  if (isCompleted) {
    // User already completed starter pack - show completion component
    mountStarterPackCompletion()
  } else {
    // User hasn't completed starter pack yet - show deck practice
    mountDeckPractice(
      STARTER_PACK_DECK_SUMMARY, 
      handleStarterPackCompletion
    )
  }
}

export function unmountStarterPack() {
  if (!state.mounted) return
  
  unmountDeckPractice()
  state.mounted = false
}
