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

  // Always mount starter pack - it handles completion state internally
  mountStarterPack()
}

document.addEventListener('DOMContentLoaded', bootstrap)
