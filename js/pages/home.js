// /pages/home.js
import { initSearchComponent } from '../components/home/search.js'
import { initLevelComponent } from '../components/home/level.js'

// Element IDs are kept in the page file
const elementIds = {
  // Search component elements
  search: {
    form: 'form-search',
    input: 'input-search',
    inputSuggestionsContainer: 'search-input-suggestions-container',
    inputCloseButton: 'btn-search-input-close',
    // button: 'search-button',
    loading: 'search-loading-container',
    // error: 'search-error',
    emptyInputContainer: 'search-empty-input-container',
    noResultsContainer: 'search-no-results-container',
    results: {
      container: 'search-results-container',
      levelBadge: 'word-card-level-badge',
      typeBadge: 'word-card-type-badge',
      title: 'word-card-title',
      translation: 'word-card-translation',
      ruleContainer: 'word-card-rule-container',
      rule: 'word-card-rule',
      sentence: 'word-card-sentence',
      verb: {
        caseLabelsContainer: 'word-card-verb-case-labels-container',
        caseLabel: (verbCase) => `${verbCase}-label`,
        caseDetailsContainer: (verbCase) => `${verbCase}-details-container`,
      },
      addToBookmarksButton: 'btn-search-add-to-bookmarks',
      labelRequiresSignin: 'label-requires-signin'
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
  initSearchComponent({ ...elementIds.search })
  // initLevelComponent({ ...elementIds.level })
}

document.addEventListener('DOMContentLoaded', bootstrap)
