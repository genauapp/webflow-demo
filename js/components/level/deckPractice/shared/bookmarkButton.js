// bookmarkButton.js
import bookmarkService from '../../../../service/BookmarkService.js'

/**
 * Renders a bookmark button based on the word's bookmark status.
 * @param {Object} word - The word object containing `is_bookmarked` and `id`.
 */
export function renderBookmarkButton(word) {
  const container = document.getElementById('bookmark-button-container')
  if (!container || !word) return

  // Clear existing content
  container.innerHTML = ''

  // Create button element
  const button = document.createElement('button')
  button.classList.add('bookmark-button')

  // Update button rendering logic to prevent recursive event listener additions and handle loading state
  button.disabled = false // Ensure button is enabled initially

  if (word.is_bookmarked) {
    button.textContent = 'Remove Bookmark'
    button.onclick = async () => {
      button.disabled = true // Disable button during loading
      const result = await bookmarkService.removeFromBookmark(word.id)
      button.disabled = false // Re-enable button after loading

      if (!result.error) {
        word.is_bookmarked = false
        renderBookmarkButton(word) // Re-render button
      } else {
        console.error('Failed to remove bookmark:', result.error)
      }
    }
  } else {
    button.textContent = 'Add Bookmark'
    button.onclick = async () => {
      button.disabled = true // Disable button during loading
      const result = await bookmarkService.addToBookmark(word.id)
      button.disabled = false // Re-enable button after loading

      if (!result.error) {
        word.is_bookmarked = true
        renderBookmarkButton(word) // Re-render button
      } else {
        console.error('Failed to add bookmark:', result.error)
      }
    }
  }

  // Append button to container
  container.appendChild(button)
}
