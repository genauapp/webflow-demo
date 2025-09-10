// /pages/home.js
import { initTranslationComponent } from '../components/home/translation.js'
import LocalStorageManager from '../utils/LocalStorageManager.js'

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
      labelRequiresSignin: 'label-requires-signin',
      ttsPlayButton: 'btn-search-tts-play',
    },
  },
}

async function bootstrap() {
  LocalStorageManager.clearDeprecatedLocalStorageItems()

  // Initialize both components with their respective element IDs
  initTranslationComponent({ ...elementIds.search })
}

document.addEventListener('DOMContentLoaded', bootstrap)
