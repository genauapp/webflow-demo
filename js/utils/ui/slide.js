/**
 * Smooth slide animations for elements with dynamic heights
 * Works with Webflow elements including all padding, margins, and borders
 * No persistent storage - uses data attributes for state tracking
 */

/**
 * Get the complete natural height of an element including padding, borders, and margins
 * Works even when element is display:none
 */
function getFullHeight(element) {
  // Create a clone to measure without affecting the original
  const clone = element.cloneNode(true)
  
  // Set up clone for measurement
  clone.style.position = 'absolute'
  clone.style.visibility = 'hidden'
  clone.style.display = 'block'
  clone.style.height = 'auto'
  clone.style.minHeight = 'auto'
  clone.style.maxHeight = 'none'
  clone.style.overflow = 'visible'
  clone.style.top = '-9999px'
  clone.style.left = '-9999px'
  
  // Add to DOM temporarily
  document.body.appendChild(clone)
  
  // Get measurements
  const computedStyle = window.getComputedStyle(clone)
  const marginTop = parseFloat(computedStyle.marginTop) || 0
  const marginBottom = parseFloat(computedStyle.marginBottom) || 0
  const contentHeight = clone.offsetHeight
  const totalHeight = contentHeight + marginTop + marginBottom
  
  // Clean up
  document.body.removeChild(clone)
  
  return totalHeight
}

/**
 * Slide open an element smoothly
 * @param {HTMLElement} element - The element to slide open
 * @param {string} displayType - The display type to use (default: 'block')
 */
export function slideOpen(element, displayType = 'block') {
  if (!element) return
  
  // Prevent conflicting animations using data attribute
  if (element.dataset.sliding === 'opening') return
  element.dataset.sliding = 'opening'
  
  // Get the target height
  const targetHeight = getFullHeight(element)
  
  // Set up the element for animation
  element.style.overflow = 'hidden'
  element.style.display = displayType
  element.style.height = '0px'
  element.style.minHeight = '0px'
  element.style.opacity = '0'
  element.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, min-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  
  // Force reflow
  element.offsetHeight
  
  // Animate to target height
  element.style.height = `${targetHeight}px`
  element.style.minHeight = `${targetHeight}px`
  element.style.opacity = '1'
  
  // Clean up after animation
  const cleanup = () => {
    if (element.dataset.sliding === 'opening') {
      // Reset to auto for responsive behavior
      element.style.height = 'auto'
      element.style.removeProperty('min-height')
      element.style.removeProperty('overflow')
      element.style.removeProperty('transition')
      delete element.dataset.sliding
    }
    element.removeEventListener('transitionend', cleanup)
  }
  
  element.addEventListener('transitionend', cleanup)
  
  // Fallback cleanup
  setTimeout(cleanup, 350)
}

/**
 * Slide close an element smoothly  
 * @param {HTMLElement} element - The element to slide close
 */
export function slideClose(element) {
  if (!element) return
  
  // Prevent conflicting animations
  if (element.dataset.sliding === 'closing') return
  element.dataset.sliding = 'closing'
  
  // If already hidden, just ensure it stays hidden
  if (element.style.display === 'none' || element.offsetHeight === 0) {
    element.style.display = 'none'
    delete element.dataset.sliding
    return
  }
  
  // Get current height including margins
  const computedStyle = window.getComputedStyle(element)
  const marginTop = parseFloat(computedStyle.marginTop) || 0
  const marginBottom = parseFloat(computedStyle.marginBottom) || 0
  const currentHeight = element.offsetHeight + marginTop + marginBottom
  
  // Set up for animation
  element.style.overflow = 'hidden'
  element.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, min-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  element.style.height = `${currentHeight}px`
  element.style.minHeight = `${currentHeight}px`
  
  // Force reflow
  element.offsetHeight
  
  // Animate to collapsed state
  element.style.height = '0px'
  element.style.minHeight = '0px'
  element.style.opacity = '0'
  
  // Clean up after animation
  const cleanup = () => {
    if (element.dataset.sliding === 'closing') {
      element.style.display = 'none'
      element.style.removeProperty('height')
      element.style.removeProperty('min-height')
      element.style.removeProperty('opacity')
      element.style.removeProperty('overflow')
      element.style.removeProperty('transition')
      delete element.dataset.sliding
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
  return element && element.dataset.sliding !== undefined
}