// js/components/bookmarks/searchList.js
import { bookmarkSearchService } from '../../service/BookmarkSearchService.js'
import { mountBookmarkAutocomplete } from './autocomplete.js'
import { protectedApiService } from '../../service/apiService.js'
import { WordLevelList, WordTypeList } from '../../constants/props.js'
import StringUtils from '../../utils/StringUtils.js'

let els = {}
let filters = { level: '', type: '', text: '' }
let bookmarkedWords = []

/** Initialize elements for search and list UI */
function initElements() {
  els = {
    searchContainer: () => document.getElementById('bookmark-search-container'),
    levelSelect: () => document.getElementById('bookmark-search-level'),
    typeSelect: () => document.getElementById('bookmark-search-type'),
    textInput: () => document.getElementById('bookmark-search-text'),
    listContainer: () => document.getElementById('bookmarks-container'),
  }
}

/** Render search UI */
function renderSearchUI() {
  const container = els.searchContainer()
  if (!container) return
  container.innerHTML = ''

  // Modern styles for search elements
  const selectStyle =
    'padding: 8px 16px; margin-right: 12px; margin-bottom: 16px; border-radius: 8px; border: 1px solid #ccc; background: #f8f8fa; font-size: 16px; color: #333; outline: none; transition: border-color 0.2s;'
  const inputStyle =
    'padding: 8px 16px; margin-bottom: 16px; border-radius: 8px; border: 1px solid #ccc; background: #f8f8fa; font-size: 16px; color: #333; outline: none; transition: border-color 0.2s; width: 220px;'

  // Level filter
  const levelSelect = document.createElement('select')
  levelSelect.id = 'bookmark-search-level'
  levelSelect.style = selectStyle
  ;['', [...WordLevelList]].forEach((lvl) => {
    const opt = document.createElement('option')
    opt.value = lvl
    opt.textContent = lvl ? lvl : 'All Levels'
    levelSelect.appendChild(opt)
  })
  levelSelect.value = filters.level
  levelSelect.addEventListener('change', () => {
    filters.level = levelSelect.value
    handleFilterChange()
  })

  // Type filter
  const typeSelect = document.createElement('select')
  typeSelect.id = 'bookmark-search-type'
  typeSelect.style = selectStyle
  ;['', [...WordTypeList]].forEach((type) => {
    const opt = document.createElement('option')
    opt.value = type
    opt.textContent = type ? StringUtils.capitalize(type) : 'All Types'
    typeSelect.appendChild(opt)
  })
  typeSelect.value = filters.type
  typeSelect.addEventListener('change', () => {
    filters.type = typeSelect.value
    handleFilterChange()
  })

  // Text input
  const textInput = document.createElement('input')
  textInput.id = 'bookmark-search-text'
  textInput.type = 'text'
  textInput.placeholder = 'Search words...'
  textInput.value = filters.text
  textInput.style = inputStyle

  // Autocomplete component
  const searchWrapper = document.createElement('div')
  searchWrapper.style = 'display: inline-block; position: relative;'
  searchWrapper.appendChild(textInput)
  // Mount autocomplete
  mountBookmarkAutocomplete(textInput, bookmarkedWords, (selectedValue) => {
    filters.text = selectedValue
    handleFilterChange()
  })

  // Reset button
  const resetBtn = document.createElement('button')
  resetBtn.textContent = 'Reset Filters'
  resetBtn.style =
    'padding: 8px 20px; margin-left: 12px; border-radius: 8px; border: none; background: #e0e0e7; color: #333; font-size: 16px; cursor: pointer; transition: background 0.2s;'
  resetBtn.addEventListener('mouseenter', () => {
    resetBtn.style.background = '#d1d1d8'
  })
  resetBtn.addEventListener('mouseleave', () => {
    resetBtn.style.background = '#e0e0e7'
  })
  resetBtn.addEventListener('click', () => {
    filters = { level: '', type: '', text: '' }
    // Reset UI values
    levelSelect.value = ''
    typeSelect.value = ''
    textInput.value = ''
    handleFilterChange()
  })

  container.appendChild(levelSelect)
  container.appendChild(typeSelect)
  container.appendChild(searchWrapper)
  container.appendChild(resetBtn)
}

/** Render bookmarked words list */
function renderBookmarkedWords(words) {
  const container = els.listContainer()
  if (!container) return
  container.innerHTML = ''

  if (!words.length) {
    const msg = document.createElement('div')
    msg.textContent = 'No bookmarked words found.'
    msg.className = 'bookmark-empty-message'
    container.appendChild(msg)
    return
  }

  words.forEach((word) => {
    const card = document.createElement('div')
    card.className = 'bookmark-word-container'

    // Left: word info
    const left = document.createElement('div')
    left.className = 'bookmark-word-left-container'
    const german = document.createElement('p')
    german.className = 'bookmark-word-german'
    german.textContent = word.german
    const english = document.createElement('p')
    english.className = 'bookmark-word-english'
    english.textContent = word.english
    left.appendChild(german)
    left.appendChild(english)

    // Right: type, level, remove
    const right = document.createElement('div')
    right.className = 'bookmark-word-right-container'
    const type = document.createElement('p')
    type.className = 'bookmark-word-type'
    type.textContent = word.type
    const level = document.createElement('p')
    level.className = 'bookmark-word-level'
    level.textContent = word.level
    const removeBtn = document.createElement('button')
    removeBtn.className = 'bookmark-word-remove-button'
    removeBtn.innerHTML = '🗑️'
    removeBtn.onclick = async () => {
      if (typeof word.id !== 'undefined') {
        // Call API to remove from backend
        const { data: unbookmarkedWord } =
          await protectedApiService.removeFromBookmark(word.id)
        // Remove from local list
        bookmarkedWords = bookmarkedWords.filter(
          (w) => w.id !== unbookmarkedWord.id
        )
        handleFilterChange()
      }
    }
    right.appendChild(type)
    right.appendChild(level)
    right.appendChild(removeBtn)

    card.appendChild(left)
    card.appendChild(right)
    container.appendChild(card)
  })
}

/** Handle filter change and update list */
function handleFilterChange() {
  const filtered = bookmarkSearchService.filter(bookmarkedWords, filters)
  renderBookmarkedWords(filtered)
}

/** Mount/init function */
export function mountBookmarkSearchList(words) {
  bookmarkedWords = words
  initElements()
  renderSearchUI()
  renderBookmarkedWords(words)

  // Listen for remove events
  // ...existing code...
}
