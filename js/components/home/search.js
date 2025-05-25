// /components/home/search.js
import { publicApiService } from '../../service/apiService.js'

let els = {}

/** Initialize elements dynamically using provided IDs */
function initElements(elementIds) {
  els = {
    form: () => document.getElementById(elementIds.searchForm),
    input: () => document.getElementById(elementIds.searchInput),
    button: () => document.getElementById(elementIds.searchButton),
    spinner: () => document.getElementById(elementIds.searchSpinner),
    errorMsg: () => document.getElementById(elementIds.searchError),
    emptyMsg: () => document.getElementById(elementIds.searchEmpty),
    results: () => document.getElementById(elementIds.searchResults),
  }
}

/**
 * Render UI based on current state.
 * @param {{ loading: boolean, error: string|null, results: Array<any> }} state
 */
function render({ loading, error, results }) {
  // spinner
  els.spinner().style.display = loading ? 'block' : 'none'

  // disable input/button while loading
  els.input().disabled = loading
  els.button().disabled = loading

  // clear messages
  els.errorMsg().style.display = 'none'
  els.emptyMsg().style.display = 'none'
  els.results().innerHTML = ''

  if (error) {
    els.errorMsg().innerText = error
    els.errorMsg().style.display = 'block'
    return
  }

  if (!loading) {
    if (results === null) {
      // initial blank state: do nothing
      return
    }
    if (Array.isArray(results) && results.length === 0) {
      els.emptyMsg().style.display = 'block'
      return
    }
    // results list
    const ul = document.createElement('ul')
    results.forEach((item) => {
      const li = document.createElement('li')
      li.innerText = item.title ?? JSON.stringify(item)
      ul.appendChild(li)
    })
    els.results().appendChild(ul)
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
    if (q) doSearch(q)
  })
}
