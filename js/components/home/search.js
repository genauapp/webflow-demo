// /components/home/search.js
import { publicApiService } from '../../service/apiService.js'

let els = {}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds) {
  els = {
    form: () => document.getElementById(elementIds.form),
    input: () => document.getElementById(elementIds.input),
    // button: () => document.getElementById(elementIds.button),
    // spinner: () => document.getElementById(elementIds.spinner),
    // errorMsg: () => document.getElementById(elementIds.error),
    emptyInputContainer: () =>
      document.getElementById(elementIds.emptyInputContainer),
    noResultsContainer: () =>
      document.getElementById(elementIds.noResultsContainer),
    resultsContainer: () =>
      document.getElementById(elementIds.resultsContainer),
  }
}

/**
 * Render UI based on current state.
 * @param {{ loading: boolean, error: string|null, results: Array<any> }} state
 */
function render({ loading, error, results }) {
  // spinner
  // els.spinner().style.display = loading ? 'block' : 'none'

  // disable input/button while loading
  els.input().disabled = loading
  // els.button().disabled = loading

  // clear messages
  // els.errorMsg().style.display = 'none'
  els.emptyInputContainer().style.display = 'none'
  els.noResultsContainer().style.display = 'none'
  els.resultsContainer().style.display = 'none'

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
    const ul = document.createElement('ul')
    results.forEach((item) => {
      const li = document.createElement('li')
      li.innerText = item.title ?? JSON.stringify(item)
      ul.appendChild(li)
    })
    // todo: populate results as word card
    els.resultsContainer().appendChild(ul)
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

/** Initialize the search component */
export function initSearchComponent(elementIds) {
  // Initialize elements with provided IDs
  initElements(elementIds)

  // initial render (blank)
  render({ loading: false, error: null, results: null })

  // form submit (Enter key or button)
  els.form().addEventListener('submit', (e) => {
    e.preventDefault()
    const q = els.input().value.trim()
    if (q.length === 0) {
      render({ loading: false, error: null, results: null })
      return
    }

    doSearch(q)
  })
}
