// js/components/bookmarks/autocomplete.js
import { bookmarkAutocompleteService } from '../../service/BookmarkAutocompleteService.js'

/**
 * Mounts autocomplete dropdown for a given input element
 * @param {HTMLInputElement} inputEl - The input element to attach autocomplete to
 * @param {Array} words - List of bookmarked word objects
 * @param {Function} onSelect - Callback when a suggestion is selected
 */
export function mountBookmarkAutocomplete(inputEl, words, onSelect) {
  // Create dropdown
  const dropdown = document.createElement('div')
  dropdown.id = 'bookmark-search-autocomplete'
  dropdown.style = 'position: absolute; z-index: 10; background: #fff; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); margin-top: 4px; min-width: 220px; display: none;'

  // Position dropdown relative to input
  const wrapper = inputEl.parentNode
  wrapper.appendChild(dropdown)

  inputEl.addEventListener('input', () => {
    const value = inputEl.value
    const suggestions = bookmarkAutocompleteService.getSuggestions(words, value)
    dropdown.innerHTML = ''
    if (suggestions.length && value.length > 1) {
      suggestions.forEach(suggestion => {
        const item = document.createElement('div')
        item.textContent = suggestion.value
        item.style = 'padding: 8px 16px; cursor: pointer; font-size: 15px; display: flex; justify-content: space-between; align-items: center;'
        const tag = document.createElement('span')
        tag.textContent = suggestion.tag
        tag.style = 'margin-left: 8px; background: #e0e0e7; color: #555; font-size: 13px; border-radius: 6px; padding: 2px 8px;'
        item.appendChild(tag)
        item.addEventListener('mousedown', (e) => {
          e.preventDefault()
          inputEl.value = suggestion.value
          onSelect(suggestion.value)
          dropdown.style.display = 'none'
        })
        dropdown.appendChild(item)
      })
      dropdown.style.display = 'block'
    } else {
      dropdown.style.display = 'none'
    }
  })

  inputEl.addEventListener('blur', () => {
    setTimeout(() => { dropdown.style.display = 'none' }, 120)
  })
  inputEl.addEventListener('focus', () => {
    if (dropdown.innerHTML) dropdown.style.display = 'block'
  })
}
