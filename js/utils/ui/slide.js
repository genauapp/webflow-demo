/**
 * Smooth slide animations for elements with dynamic heights
 * Works with Webflow elements that have the 'slideable' class
 */

// Store animation states to prevent conflicts
const animationStates = new WeakMap()

/**
 * Get the natural height of an element's content
 * Works even when element is display:none
 */
function getContentHeight(element) {
  // Store original styles
  const originalStyles = {
    display: element.style.display,
    position: element.style.position,
    visibility: element.style.visibility,
    height: element.style.height,
    overflow: element.style.overflow,
    opacity: element.style.opacity
  }
  
  // Temporarily make it measurable
  element.style.display = 'block'
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  element.style.height = 'auto'
  element.style.overflow = 'visible'
  element.style.opacity = '0'
  
  // Get the height
  const height = element.scrollHeight
  
  // Restore all original styles
  Object.entries(originalStyles).forEach(([key, value]) => {
    if (value) {
      element.style[key] = value
    } else {
      element.style.removeProperty(key.replace(/([A-Z])/g, '-$1').toLowerCase())
    }
  })
  
  return height
}

/**
 * Slide open an element smoothly
 * @param {HTMLElement} element - The element to slide open
 * @param {string} displayType - The display type to use (default: 'block')
 */
export function slideOpen(element, displayType = 'block') {
  if (!element) return
  
  // Prevent conflicting animations
  if (animationStates.get(element) === 'opening') return
  animationStates.set(element, 'opening')
  
  // Get the target height before making any changes
  const targetHeight = getContentHeight(element)
  
  // Set up the element for animation
  element.style.overflow = 'hidden'
  element.style.display = displayType
  element.style.height = '0px'
  element.style.opacity = '0'
  element.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
  
  // Force reflow to ensure starting state is applied
  element.offsetHeight
  
  // Animate to target height
  element.style.height = `${targetHeight}px`
  element.style.opacity = '1'
  
  // Clean up after animation
  const cleanup = () => {
    if (animationStates.get(element) === 'opening') {
      element.style.height = 'auto' // Allow natural height changes
      element.style.overflow = '' // Reset overflow
      animationStates.delete(element)
    }
    element.removeEventListener('transitionend', cleanup)
  }
  
  element.addEventListener('transitionend', cleanup)
  
  // Fallback cleanup in case transitionend doesn't fire
  setTimeout(cleanup, 350)
}

/**
 * Slide close an element smoothly
 * @param {HTMLElement} element - The element to slide close
 */
export function slideClose(element) {
  if (!element) return
  
  // Prevent conflicting animations
  if (animationStates.get(element) === 'closing') return
  animationStates.set(element, 'closing')
  
  // If already hidden, just ensure it stays hidden
  if (element.style.display === 'none' || element.offsetHeight === 0) {
    element.style.display = 'none'
    animationStates.delete(element)
    return
  }
  
  // Set up for animation
  element.style.overflow = 'hidden'
  element.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
  
  // Get current height and set it explicitly for smooth animation
  const currentHeight = element.offsetHeight
  element.style.height = `${currentHeight}px`
  
  // Force reflow
  element.offsetHeight
  
  // Animate to collapsed state
  element.style.height = '0px'
  element.style.opacity = '0'
  
  // Clean up after animation
  const cleanup = () => {
    if (animationStates.get(element) === 'closing') {
      element.style.display = 'none'
      element.style.height = ''
      element.style.opacity = ''
      element.style.overflow = ''
      element.style.transition = ''
      animationStates.delete(element)
    }
    element.removeEventListener('transitionend', cleanup)
  }
  
  element.addEventListener('transitionend', cleanup)
  
  // Fallback cleanup
  setTimeout(cleanup, 350)
}

/**
 * Toggle slide state of an element
 * @param {HTMLElement} element - The element to toggle
 * @param {string} displayType - The display type to use when opening
 */
export function slideToggle(element, displayType = 'block') {
  if (!element) return
  
  const isCollapsed = element.style.display === 'none' || 
                      element.style.height === '0px' || 
                      element.offsetHeight === 0
  
  if (isCollapsed) {
    slideOpen(element, displayType)
  } else {
    slideClose(element)
  }
}

/**
 * Check if an element is currently sliding (animating)
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
export function isSliding(element) {
  return animationStates.has(element)
}

/**
 * Initialize all slideable elements on the page
 * Call this once when your page loads if needed
 */
export function initAllSlideableElements() {
  const slideableElements = document.querySelectorAll('.slideable')
  slideableElements.forEach(element => {
    // Just add the CSS class for overflow
    if (!element.style.overflow) {
      element.style.overflow = 'hidden'
    }
  })
}