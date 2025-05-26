// /components/home/search.js
import { publicApiService } from '../../service/apiService.js'

let els = {}

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
    rule: () => document.getElementById(elementIds.results.rule),
    sentence: () => document.getElementById(elementIds.results.sentence),
  }
}

/**
 * Render input UI based on current input state.
 * @param {{ hasValue: boolean, isFocused: boolean }} inputState
 */
function renderInputState({ hasValue, isFocused }) {
  // Show/hide suggestions container (opposite of hasValue)
  els.inputSuggestionsContainer().style.display = hasValue ? 'none' : 'block'

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
  els.inputCloseButton().disabled = loading

  // clear messages
  els.emptyInputContainer().style.display = 'none'
  els.noResultsContainer().style.display = 'none'
  hideWordCard()

  if (error) {
    console.error(`Search error: ${error}`)
    return
  }

  if (!loading) {
    if (results === null) {
      // initial blank state: do nothing
      els.emptyInputContainer().style.display = 'flex'
      els.inputSuggestionsContainer().style.display = 'block'
      return
    }
    if (Array.isArray(results) && results.length === 0) {
      console.log('No results found.')
      els.noResultsContainer().style.display = 'flex'
      return
    }
    // results list
    // todo: multiple word results
    showWordCard(results[0])
  }
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

  const { data, error, status } = await publicApiService.getSearchResults(query)

  if (error) {
    render({ loading: false, error: error.toString(), results: null })
    return
  }

  // assuming API returns data.results array
  const results = data?.results ?? []
  console.log(`results:\n${JSON.stringify(results)}`)

  render({ loading: false, error: null, results })
}

function hideWordCard() {
  els.resultsContainer().style.display = 'none'

  els.levelBadge().innerText = ''
  els.typeBadge().innerText = ''
  els.title().innerText = ''
  els.translation().innerText = ''
  els.rule().innerText = ''
  els.sentence().innerText = ''
}

function showWordCard(wordResult) {
  els.resultsContainer().style.display = 'flex'

  els.levelBadge().innerText = wordResult.level
  els.typeBadge().innerText = wordResult.type
  els.title().innerText = wordResult.word
  els.translation().innerText = wordResult.english
  els.rule().innerText = wordResult.rule
  els.sentence().innerText = wordResult.example
}

/** Initialize the search component */
export function initSearchComponent(elementIds) {
  // Initialize elements with provided IDs
  initElements(elementIds)

  // initial render (blank)
  render({ loading: false, error: null, results: null })

  // initial input state render
  updateInputUI()

  // form submit (Enter key or button)
  els.form().addEventListener('submit', (e) => {
    e.preventDefault()
    e.stopPropagation()

    const q = els.input().value.trim()
    if (q.length === 0) {
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
}
