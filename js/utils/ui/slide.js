/**
 * Smooth slide animations for elements with dynamic heights
 * Works with Webflow elements that have the 'slideable' class
 */

// Store animation states to prevent conflicts
const animationStates = new WeakMap()

/**
 * Get the natural height of an element's content
 */
function getContentHeight(element) {
  // If element is currently collapsed, we need to temporarily show it to measure
  const wasHidden = element.style.height === '0px' || element.style.display === 'none'
  
  if (wasHidden) {
    // Temporarily make it visible but off-screen to measure
    const originalStyles = {
      position: element.style.position,
      visibility: element.style.visibility,
      height: element.style.height,
      overflow: element.style.overflow
    }
    
    element.style.position = 'absolute'
    element.style.visibility = 'hidden'
    element.style.height = 'auto'
    element.style.overflow = 'visible'
    
    const height = element.scrollHeight
    
    // Restore original styles
    Object.assign(element.style, originalStyles)
    
    return height
  }
  
  return element.scrollHeight
}

/**
 * Initialize an element for sliding animations
 */
function initSlideableElement(element) {
  if (!element.classList.contains('slideable')) return
  
  // Set initial styles for smooth animations
  element.style.overflow = 'hidden'
  element.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease'
  
  // If element doesn't have explicit height, assume it should start collapsed
  if (!element.style.height && element.offsetHeight === 0) {
    element.style.height = '0px'
    element.style.opacity = '0'
  }
}

/**
 * Slide open an element smoothly
 * @param {HTMLElement} element - The element to slide open
 * @param {string} displayType - The display type to use (default: 'block')
 */
export function slideOpen(element, displayType = 'block') {
  if (!element || !element.classList.contains('slideable')) return
  
  // Prevent conflicting animations
  if (animationStates.get(element) === 'opening') return
  animationStates.set(element, 'opening')
  
  // Initialize if not already done
  initSlideableElement(element)
  
  // Make sure element is visible
  element.style.display = displayType
  
  // Get the target height
  const targetHeight = getContentHeight(element)
  
  // Set starting state if collapsed
  if (element.style.height === '0px') {
    element.style.height = '0px'
    element.style.opacity = '0'
  }
  
  // Force reflow to ensure starting state is applied
  element.offsetHeight
  
  // Animate to target height
  element.style.height = `${targetHeight}px`
  element.style.opacity = '1'
  
  // Clean up after animation
  const cleanup = () => {
    element.style.height = 'auto' // Allow natural height changes
    animationStates.delete(element)
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
  if (!element || !element.classList.contains('slideable')) return
  
  // Prevent conflicting animations
  if (animationStates.get(element) === 'closing') return
  animationStates.set(element, 'closing')
  
  // Initialize if not already done
  initSlideableElement(element)
  
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
    element.style.display = 'none'
    animationStates.delete(element)
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
  
  const isCollapsed = element.style.height === '0px' || 
                      element.style.display === 'none' || 
                      element.offsetHeight === 0
  
  if (isCollapsed) {
    slideOpen(element, displayType)
  } else {
    slideClose(element)
  }
}

// /**
//  * Initialize all slideable elements on the page
//  * Call this once when your page loads
//  */
// export function initAllSlideableElements() {
//   const slideableElements = document.querySelectorAll('.slideable')
//   slideableElements.forEach(initSlideableElement)
// }

/**
 * Check if an element is currently sliding (animating)
 * @param {HTMLElement} element 
 * @returns {boolean}
 */
export function isSliding(element) {
  return animationStates.has(element)
}