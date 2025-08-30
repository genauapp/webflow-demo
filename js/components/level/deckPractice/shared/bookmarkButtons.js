// bookmarkButton.js
import bookmarkService from '../../../../service/BookmarkService.js'

let els = {}
let isLoading = false // Track loading state globally

/** Initialize elements dynamically using provided IDs */
function initElements() {
  els = {
    container: () => document.getElementById('bookmark-button-container'),
    addButton: () => document.getElementById('bookmark-add-button'),
    removeButton: () => document.getElementById('bookmark-remove-button'),
  }
}

/** Render bookmark buttons based on the word's bookmark status */
function renderBookmarkButtons(word) {
  if (!els.container() || !word) return

  // Show/hide buttons based on bookmark status
  if (word.is_bookmarked) {
    els.addButton().style.display = 'none'
    els.removeButton().style.display = 'block'

    els.removeButton().onclick = async () => {
      if (isLoading) return // Prevent spam clicks
      isLoading = true
      els.removeButton().disabled = true // Disable button during loading

      const result = await bookmarkService.removeFromBookmark(word.id)

      isLoading = false
      els.removeButton().disabled = false // Re-enable button after loading

      if (!result.error) {
        word.is_bookmarked = false
        renderBookmarkButtons(word) // Re-render buttons
      } else {
        console.error('Failed to remove bookmark:', result.error)
      }
    }
  } else {
    els.addButton().style.display = 'block'
    els.removeButton().style.display = 'none'

    els.addButton().onclick = async () => {
      if (isLoading) return // Prevent spam clicks
      isLoading = true
      els.addButton().disabled = true // Disable button during loading

      const result = await bookmarkService.addToBookmark(word.id)

      isLoading = false
      els.addButton().disabled = false // Re-enable button after loading

      if (!result.error) {
        word.is_bookmarked = true
        renderBookmarkButtons(word) // Re-render buttons
      } else {
        console.error('Failed to add bookmark:', result.error)
      }
    }
  }
}

/** Initialize bookmark buttons */
export function initBookmarkButtons(word) {
  initElements()

  renderBookmarkButtons(word)
}
