// /pages/home.js
import { initUserComponent } from '../components/home/user.js'
import { initSearchComponent } from '../components/home/search.js'
import { initLevelComponent } from '../components/home/level.js'

// Element IDs are kept in the page file
const elementIds = {
  // User component elements
  user: {
    login: 'login-container',
    profile: 'user-profile-container',
    avatar: 'image-user-info-avatar',
    name: 'label-user-info-name',
    email: 'label-user-info-email',
    logoutBtn: 'btn-home-logout',
  },

  // Search component elements
  search: {
    form: 'form-search',
    input: 'input-search',
    button: 'search-button',
    loading: 'search-loading-container',
    error: 'search-error',
    emptyInputContainer: 'search-empty-input-container',
    noResultsContainer: 'search-no-results-container',
    results: {
      container: 'search-results-container',
      levelBadge: 'word-card-level-badge',
      typeBadge: 'word-card-type-badge',
      title: 'word-card-title',
      translation: 'word-card-translation',
      rule: 'word-card-rule',
      sentence: 'word-card-sentence',
    },
  },

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
  // Initialize both components with their respective element IDs
  await initUserComponent({ ...elementIds.user })
  initSearchComponent({ ...elementIds.search })
  // initLevelComponent({ ...elementIds.level })
}

document.addEventListener('DOMContentLoaded', bootstrap)
