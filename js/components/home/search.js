// /components/home/search.js
import { publicApiService } from '../../service/apiService.js'

let els = {}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds) {
  els = {
    form: () => document.getElementById(elementIds.form),
    input: () => document.getElementById(elementIds.input),
    // button: () => document.getElementById(elementIds.button),
    loadingContainer: () => document.getElementById(elementIds.loading),
    // errorMsg: () => document.getElementById(elementIds.error),
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
 * Render UI based on current state.
 * @param {{ loading: boolean, error: string|null, results: Array<any> }} state
 */
function render({ loading, error, results }) {
  // spinner
  els.loadingContainer().style.display = loading ? 'flex' : 'none'

  // disable input/button while loading
  els.input().disabled = loading
  // els.button().disabled = loading

  // clear messages
  // els.errorMsg().style.display = 'none'
  els.emptyInputContainer().style.display = 'none'
  els.noResultsContainer().style.display = 'none'
  hideWordCard()

  if (error) {
    console.error(`Search error: ${error}`)
    // els.errorMsg().innerText = error
    // els.errorMsg().style.display = 'block'
    return
  }

  if (!loading) {
    if (results === null) {
      // initial blank state: do nothing
      els.emptyInputContainer().style.display = 'flex'
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

function handleWebflowFormElementsAfterSubmit() {
  // Webflow displays none after each submission
  els.form().style.display = 'flex'
  // unused elements
  // document.getElementById("")
}

/** Initialize the search component */
export function initSearchComponent(elementIds) {
  // Initialize elements with provided IDs
  initElements(elementIds)

  // initial render (blank)
  render({ loading: false, error: null, results: null })

  // form submit (Enter key or button)
  els.form().addEventListener('submit', (e) => {
    e.preventDefault()
    // Webflow displays it as none after each submission, block it immediately!
    e.currentTarget.style.display = 'block'

    const q = els.input().value.trim()
    if (q.length === 0) {
      render({ loading: false, error: null, results: null })
      return
    }

    doSearch(q)
  })
}
