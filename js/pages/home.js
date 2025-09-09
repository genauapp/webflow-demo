// /pages/home.js
import { initLevelComponent } from '../components/home/level.js'
import { mountStarterPack } from '../components/home/starterPack.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'

// Element IDs are kept in the page file
const elementIds = {
  level: {
    // Level component elements
    levelA1Btn: 'level-a1-btn',
    levelA2Btn: 'level-a2-btn',
    levelB1Btn: 'level-b1-btn',
    levelB2Btn: 'level-b2-btn',
    packsContainer: 'packs-container',
  },
}

async function bootstrap() {
  LocalStorageManager.clearDeprecatedLocalStorageItems()

  // initLevelComponent({ ...elementIds.level })
  // Initialize both components with their respective element IDs

  // Check if starter pack is completed
  const isCompleted = LocalStorageManager.load('STARTER_PACK_COMPLETED', false)
  if (!isCompleted) {
    mountStarterPack()
  }
}

document.addEventListener('DOMContentLoaded', bootstrap)
