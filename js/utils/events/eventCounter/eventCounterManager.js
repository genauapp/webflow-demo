// /utils/events/eventCounterManager.js
import LocalStorageManager from '../../LocalStorageManager.js'
import {
  SIGNIN_TRIGGER_COUNTER_KEY,
  DEFAULT_VALUE,
} from '../../../constants/storageKeys.js'

// Get the entire counter object
export function getCounterObject() {
  const stored = LocalStorageManager.load(
    SIGNIN_TRIGGER_COUNTER_KEY,
    DEFAULT_VALUE.SIGNIN_TRIGGER_COUNTER
  )

  return stored
}

// Save the entire counter object
function saveCounterObject(counters) {
  localStorage.setItem(SIGNIN_TRIGGER_COUNTER_KEY, counters)
}

// Increment a specific counter
export function incrementEventCount(eventName) {
  const counters = getCounterObject()

  if (!counters[eventName]) {
    counters[eventName] = { ...DEFAULT_VALUE.SIGNIN_TRIGGER_COUNTER[eventName] }
  }

  counters[eventName].current += 1
  saveCounterObject(counters)
  return counters[eventName]
}

// Reset specific or all counters
export function resetEventCount(eventName = null) {
  if (eventName) {
    const counters = getCounterObject()
    counters[eventName] = { ...DEFAULT_VALUE.SIGNIN_TRIGGER_COUNTER[eventName] }
    saveCounterObject(counters)
  } else {
    saveCounterObject({ ...DEFAULT_VALUE.SIGNIN_TRIGGER_COUNTER })
  }
}

// Check if modal should be triggered
export function shouldTriggerModal(eventName) {
  const counters = getCounterObject()
  const counter = counters[eventName]

  if (!counter) return false

  // For unlimited triggers (max = null)
  if (counter.max === null) return true

  return counter.current <= counter.max
}
