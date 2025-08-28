// /components/home/search.js
import { SigninModalTriggerEvent } from '../../constants/events.js'
import {
  WordType,
  NounArticleColorMap,
  ALL_VERB_CASES,
  WordSource,
} from '../../constants/props.js'
import {
  publicApiService,
  protectedApiService,
} from '../../service/apiService.js'
import CollectionsManager from '../../utils/CollectionsManager.js'
import eventService from '../../service/events/EventService.js'
import { AuthEvent } from '../../constants/events.js'
import { DURATION_FEEDBACK_MS } from '../../constants/timeout.js'
import StringUtils from '../../utils/StringUtils.js'
import bookmarkService from '../../service/BookmarkService.js'
import ListUtils from '../../utils/ListUtils.js'

let els = {}
let currentWordResults = []
let unauthorized = true

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds) {
  els = {
    form: () => document.getElementById(elementIds.form),
    input: () => document.getElementById(elementIds.input),
    inputSuggestionsContainer: () =>
      document.getElementById(elementIds.inputSuggestionsContainer),
    inputCloseButton: () =>
      document.getElementById(elementIds.inputCloseButton),
    loadingContainer: () => document.getElementById(elementIds.loading),
    emptyInputContainer: () =>
      document.getElementById(elementIds.emptyInputContainer),
    noResultsContainer: () =>
      document.getElementById(elementIds.noResultsContainer),
    resultsContainer: () =>
      document.getElementById(elementIds.results.container),
    levelBadge: () => document.getElementById(elementIds.results.levelBadge),
    typeBadge: () => document.getElementById(elementIds.results.typeBadge),
    title: () => document.getElementById(elementIds.results.title),
    translation: () => document.getElementById(elementIds.results.translation),
    ruleContainer: () =>
      document.getElementById(elementIds.results.ruleContainer),
    rule: () => document.getElementById(elementIds.results.rule),
    sentence: () => document.getElementById(elementIds.results.sentence),

    verb: {
      caseLabelsContainer: () =>
        document.getElementById(elementIds.results.verb.caseLabelsContainer),
      caseLabel: (verbCase) =>
        document.getElementById(elementIds.results.verb.caseLabel(verbCase)),
      caseDetailsContainer: (verbCase) =>
        document.getElementById(
          elementIds.results.verb.caseDetailsContainer(verbCase)
        ),
    },

    addToBookmarksButton: () =>
      document.getElementById(elementIds.results.addToBookmarksButton),
    labelRequiresSignin: () =>
      document.getElementById(elementIds.results.labelRequiresSignin),
  }
}

/**
 * Render input UI based on current input state.
 * @param {{ hasValue: boolean, isFocused: boolean }} inputState
 */
function renderInputState({ hasValue, isFocused }) {
  // Show/hide suggestions container (opposite of hasValue)
  // its opacity goes 0 magically, so make it 1 any time it is rendered
  els.inputSuggestionsContainer().style.opacity = '1'
  els.inputSuggestionsContainer().style.display = hasValue
    ? 'none'
    : 'inline-block'

  // Show/hide close button based on focus and value
  const shouldShowCloseButton = isFocused || hasValue
  els.inputCloseButton().style.display = shouldShowCloseButton ? 'flex' : 'none'

  // Enable/disable close button (only disabled when no value)
  els.inputCloseButton().disabled = !hasValue
}

/**
 * Render main search UI based on current state.
 * @param {{ loading: boolean, error: string|null, results: Array<any> }} state
 */
function render({ loading, error, results }) {
  // loading
  els.loadingContainer().style.display = loading ? 'flex' : 'none'

  // disable input/button while loading
  els.input().disabled = loading
  els.inputCloseButton().style.display = loading ? 'none' : 'flex'
  els.inputCloseButton().disabled = loading

  // clear messages
  els.emptyInputContainer().style.display = 'none'
  els.noResultsContainer().style.display = 'none'
  hideWordCard()

  // Set bookmark button state using helper
  if (Array.isArray(results) && results.length > 0) {
    setBookmarkButtonState(results[0].is_bookmarked)
  } else {
    setBookmarkButtonState(false)
  }

  if (error) {
    console.error(`Search error: ${error}`)
    return
  }

  if (!loading) {
    if (results === null) {
      // initial blank state: do nothing
      els.emptyInputContainer().style.display = 'flex'
      // Let renderInputState handle the suggestions container
      return
    }
    if (Array.isArray(results) && results.length === 0) {
      // console.log('No results found.')
      els.noResultsContainer().style.display = 'flex'
      return
    }
    // results list
    // todo: multiple word results
    showWordCard(results[0])
  }
}

/** Set bookmark button state */
function setBookmarkButtonState(isBookmarked) {
  const btn = els.addToBookmarksButton()
  btn.textContent = isBookmarked ? 'Added to Bookmarks' : 'Add to Bookmarks'
  // els.addToBookmarksButton().disabled = isBookmarked ? true : false  // not working since it's an anchor element
  btn.style.pointerEvents = isBookmarked ? 'none' : 'auto'
  btn.style.opacity = isBookmarked ? '0.6' : '1'
}

/** Get current input state */
function getInputState() {
  const hasValue = els.input().value.trim().length > 0
  const isFocused = document.activeElement === els.input()
  return { hasValue, isFocused }
}

/** Update input UI based on current state */
function updateInputUI() {
  renderInputState(getInputState())
}

/** Clear input and update UI */
function clearInput() {
  els.input().value = ''
  updateInputUI()
  // Also trigger main render for initial state
  render({ loading: false, error: null, results: null })
}

/** Kick off a search */
async function doSearch(query) {
  // init loading
  render({ loading: true, error: null, results: null })

  const { data, error, status } = await publicApiService.getTranslationResults(
    query
  )

  if (error) {
    render({ loading: false, error: error.toString(), results: null })
    return
  }

  // assuming API returns data array
  const results = data ?? []
  // console.log(`results:\n${JSON.stringify(results)}`)

  currentWordResults = results

  render({ loading: false, error: null, results })
}

function hideWordCard() {
  els.resultsContainer().style.display = 'none'

  els.levelBadge().innerText = ''
  els.typeBadge().innerText = ''
  els.title().innerText = ''
  els.translation().innerText = ''
  els.sentence().innerText = ''

  els.ruleContainer().style.visibility = 'hidden'
  els.rule().innerText = ''
}

function showWordCard(wordResult) {
  closeAllVerbCaseDetails()

  els.resultsContainer().style.display = 'flex'
  // title is set at below according to noun
  els.levelBadge().innerText = wordResult.level
  els.typeBadge().innerText = wordResult.type
  els.translation().innerText = wordResult.english
  els.sentence().innerText = ListUtils.shuffleArray(wordResult.examples)[0]

  // noun
  // // show/hide rule
  if (wordResult.type === WordType.NOUN && wordResult.rule.trim().length > 0) {
    els.ruleContainer().style.visibility = 'visible'
    els.rule().innerText = wordResult.rule
  } else {
    els.ruleContainer().style.visibility = 'hidden'
    els.rule().innerText = ''
  }

  // // word title: prepend article to title/skip
  let newTitleValue
  if (
    wordResult.type === WordType.NOUN &&
    !wordResult.german.startsWith('die ') &&
    !wordResult.german.startsWith('der ') &&
    !wordResult.german.startsWith('das ')
  ) {
    newTitleValue = `${
      wordResult.article || wordResult.artikel
    } ${StringUtils.capitalize(wordResult.german)}`
  } else {
    newTitleValue = wordResult.german
  }
  // // // set it to the element
  els.title().innerText = newTitleValue

  // // use article/default color for title
  els.title().style.color =
    wordResult.type === WordType.NOUN
      ? NounArticleColorMap[wordResult.article || wordResult.artikel]
      : NounArticleColorMap['default']

  // verb
  // // cases
  if (wordResult.type === WordType.VERB && wordResult.cases.length > 0) {
    els.verb.caseLabelsContainer().style.display = 'flex'
    ALL_VERB_CASES.forEach((verbCase) => {
      const caseNotExists =
        wordResult.cases.findIndex(
          (c) => c.trim().toLowerCase() === verbCase
        ) === -1

      els.verb.caseLabel(verbCase).style.display = caseNotExists
        ? 'none'
        : 'flex'
    })
  } else {
    els.verb.caseLabelsContainer().style.display = 'none'
  }
}

function closeAllVerbCaseDetails() {
  ALL_VERB_CASES.forEach((verbCase) => {
    const container = els.verb.caseDetailsContainer(verbCase)
    if (container) container.style.display = 'none'
  })
}

const attachVerbCaseHandlers = () => {
  // Add click handlers for case labels and cancel buttons
  ALL_VERB_CASES.forEach((verbCase) => {
    // Case label click handler
    const label = els.verb.caseLabel(verbCase)
    if (label) {
      label.addEventListener('click', () => {
        // Close all details containers
        closeAllVerbCaseDetails()
        // Open the clicked case's container
        const detailsContainer = els.verb.caseDetailsContainer(verbCase)
        if (detailsContainer) detailsContainer.style.display = 'flex'
      })
    }

    // Cancel button click handler
    const detailsContainer = els.verb.caseDetailsContainer(verbCase)
    if (detailsContainer) {
      const cancelBtn = detailsContainer.querySelector(
        '.btn-verb-case-close-details'
      ) // Use your cancel button's class/ID
      if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
          e.preventDefault()
          detailsContainer.style.display = 'none'
        })
      }
    }
  })
}

async function handleAddToBookmarks(e) {
  e.preventDefault()
  // eventService.publish(SigninModalTriggerEvent.HOME_SEARCH_ADD_TO_BOOKMARKS)

  if (currentWordResults.length === 0) return

  const btn = els.addToBookmarksButton()
  const requiresSigninLabel = els.labelRequiresSignin()

  if (unauthorized) {
    btn.style.pointerEvents = 'none' // Disable further clicks
    btn.style.opacity = '0.6' // Visual disabled state

    requiresSigninLabel.style.display = 'flex'
    setTimeout(() => {
      // default state to re-enable clicking
      btn.style.pointerEvents = 'auto'
      btn.style.opacity = '1'
      requiresSigninLabel.style.display = 'none'
    }, DURATION_REQUIRES_SIGNIN_MS)
    return
  }

  requiresSigninLabel.style.display = 'none'

  // CollectionsManager.addWordToBookmarks(
  //   currentWordResults[0],
  //   WordSource.NORMAL_PROMPT
  // )

  const currentWord = currentWordResults[0]
  if (!currentWord.is_bookmarked) {
    await bookmarkService.addToBookmark(currentWord.id)
  }

  setBookmarkButtonState(true)
}

/** Initialize the translation component */
export function initTranslationComponent(elementIds) {
  // Initialize elements with provided IDs
  initElements(elementIds)

  // Subscribe to auth events
  eventService.subscribe(AuthEvent.AUTH_STATE_CHANGED, (event) => {
    unauthorized = event.detail.unauthorized
  })

  // initial render (blank)
  render({ loading: false, error: null, results: null })

  // initial input state render
  updateInputUI()

  // form submit (Enter key or button)
  els.form().addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()

    const q = els.input().value
    // if in put is invalid or more than max length
    if (q.trim().length === 0 || q.length > 20) {
      render({ loading: false, error: null, results: null })
      return
    }

    doSearch(q)
  })

  // input focus in
  els.input().addEventListener('focusin', (e) => {
    updateInputUI()
  })

  // input focus out
  els.input().addEventListener('focusout', (e) => {
    updateInputUI()
  })

  // input change/input events (handles typing)
  els.input().addEventListener('input', (e) => {
    updateInputUI()
  })

  // close button click
  els.inputCloseButton().addEventListener('click', (e) => {
    e.preventDefault()
    clearInput()
    els.input().focus() // Keep focus on input after clearing
  })

  attachVerbCaseHandlers()

  // add to bookmark click
  els
    .addToBookmarksButton()
    .addEventListener('click', async (e) => await handleAddToBookmarks(e))
}
