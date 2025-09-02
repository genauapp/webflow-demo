// /components/level/deckPractice/learn/verb.js
import {
  NounArticleColorMap,
  ALL_VERB_CASES,
  WordType,
} from '../../../../constants/props.js'
import ttsService from '../../../../service/TtsService.js'

let els = {}

/** Initialize elements for verb component */
function initElements() {
  els = {
    wordText: () => document.getElementById('learn-word-card-text'),
    wordTranslation: () =>
      document.getElementById('learn-word-card-translation'),
    wordExampleContainer: () =>
      document.getElementById('learn-word-card-example-container'),
    wordExample: () => document.getElementById('learn-word-card-example'),
    wordRule: () => document.getElementById('learn-word-card-rule'),
    ttsPlayButton: () => document.getElementById('learn-word-tts-play-button'),

    // Verb-specific elements
    verb: {
      // caseLabelsContainer: () =>
      //   document.getElementById('learn-verb-case-labels-container'),
      caseLabel: (verbCase) =>
        document.getElementById(`learn-verb-case-label-${verbCase}`),
      caseDetails: (verbCase) =>
        document.getElementById(`learn-verb-case-details-${verbCase}`),
    },
  }
}

/** Close all verb case details containers */
function closeAllVerbCaseDetails() {
  ALL_VERB_CASES.forEach((verbCase) => {
    const container = els.verb.caseDetails(verbCase)
    if (container) container.style.display = 'none'
  })
}

/** Attach event handlers for verb case interactions */
function attachVerbCaseHandlers() {
  ALL_VERB_CASES.forEach((verbCase) => {
    // Case label click handler
    const label = els.verb.caseLabel(verbCase)
    if (label) {
      label.addEventListener('click', () => {
        // Close all details containers
        closeAllVerbCaseDetails()
        // Open the clicked case's container
        const detailsContainer = els.verb.caseDetails(verbCase)
        if (detailsContainer) detailsContainer.style.display = 'flex'
      })
    }

    // Cancel button click handler
    const detailsContainer = els.verb.caseDetails(verbCase)
    if (detailsContainer) {
      const cancelBtn = detailsContainer.querySelector(
        '.btn-verb-case-close-details'
      )
      if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
          e.preventDefault()
          detailsContainer.style.display = 'none'
        })
      }
    }
  })
}

/** Render verb-specific content */
function renderVerb(word) {
  if (!word) return

  // Close all case details first
  closeAllVerbCaseDetails()

  // Update verb-specific elements
  if (els.wordText()) {
    els.wordText().textContent = word.german || ''
    els.wordText().style.color = NounArticleColorMap['default']
  }

  if (els.wordTranslation()) {
    els.wordTranslation().textContent = word.english || ''
  }

  if (els.wordExampleContainer()) {
    els.wordExampleContainer().style.display = 'flex'
  }

  if (els.wordExample()) {
    els.wordExample().textContent = word.example || ''
  }

  if (els.wordRule()) {
    els.wordRule().style.display = word.rule ? 'block' : 'none'
    els.wordRule().textContent = word.rule
  }

  // Handle verb cases (similar to search component logic)
  if (word.cases && word.cases.length > 0) {
    // if (els.verb.caseLabelsContainer()) {
    //   els.verb.caseLabelsContainer().style.display = 'flex'
    // }

    ALL_VERB_CASES.forEach((verbCase) => {
      const caseNotExists =
        word.cases.findIndex((c) => c.trim().toLowerCase() === verbCase) === -1

      const caseLabel = els.verb.caseLabel(verbCase)
      if (caseLabel) {
        caseLabel.style.display = caseNotExists ? 'none' : 'flex'
      }
    })
  } else {
    // if (els.verb.caseLabelsContainer()) {
    //   els.verb.caseLabelsContainer().style.display = 'none'
    // }
  }
}

/** Mount verb component */
export function mountVerb(currentWord) {
  // Initialize elements
  initElements()

  // Attach event handlers
  attachVerbCaseHandlers()

  // Render verb content
  renderVerb(currentWord)

  // Setup TTS functionality
  ttsService.setupTTSButton(currentWord, WordType.VERB)
}
