/**
 * Smooth slide animations with proper margin/padding/border handling
 * Works with Webflow elements that have the 'slideable' class
 */

// Store animation states to prevent conflicts
const animationStates = new WeakMap()

/**
 * Get the full height and spacing values including margins, padding, and borders
 */
function getFullHeight(element) {
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
  
  // Get computed styles for all spacing properties
  const computedStyle = window.getComputedStyle(element)
  const marginTop = parseFloat(computedStyle.marginTop) || 0
  const marginBottom = parseFloat(computedStyle.marginBottom) || 0
  const paddingTop = parseFloat(computedStyle.paddingTop) || 0
  const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0
  const borderTopWidth = parseFloat(computedStyle.borderTopWidth) || 0
  const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth) || 0
  
  // scrollHeight includes padding and border, so we get content + padding + border
  const scrollHeight = element.scrollHeight
  // Total height is scrollHeight + margins
  const totalHeight = scrollHeight + marginTop + marginBottom
  
  // Restore all original styles
  Object.entries(originalStyles).forEach(([key, value]) => {
    if (value) {
      element.style[key] = value
    } else {
      element.style.removeProperty(key.replace(/([A-Z])/g, '-$1').toLowerCase())
    }
  })
  
  return { 
    totalHeight, 
    marginTop, 
    marginBottom, 
    paddingTop, 
    paddingBottom,
    borderTopWidth,
    borderBottomWidth,
    contentHeight: scrollHeight - paddingTop - paddingBottom - borderTopWidth - borderBottomWidth
  }
}

/**
 * Slide open an element smoothly with proper margin and padding handling
 */
export function slideOpen(element, displayType = 'block') {
  if (!element) return
  
  // Prevent conflicting animations
  if (animationStates.get(element) === 'opening') return
  animationStates.set(element, 'opening')
  
  // Get the target dimensions
  const { totalHeight, marginTop, marginBottom, paddingTop, paddingBottom, contentHeight } = getFullHeight(element)
  
  // Set up the element for animation - collapse all spacing
  element.style.overflow = 'hidden'
  element.style.display = displayType
  element.style.height = '0px'
  element.style.marginTop = '0px'
  element.style.marginBottom = '0px'
  element.style.paddingTop = '0px'
  element.style.paddingBottom = '0px'
  element.style.opacity = '0'
  element.style.transition = 'height 1s cubic-bezier(0.4, 0, 0.2, 1), margin 1s cubic-bezier(0.4, 0, 0.2, 1), padding 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease'
  
  // Force reflow to ensure starting state is applied
  element.offsetHeight
  
  // Animate to target state
  element.style.height = `${contentHeight}px`
  element.style.marginTop = `${marginTop}px`
  element.style.marginBottom = `${marginBottom}px`
  element.style.paddingTop = `${paddingTop}px`
  element.style.paddingBottom = `${paddingBottom}px`
  element.style.opacity = '1'
  
  // Clean up after animation
  const cleanup = () => {
    if (animationStates.get(element) === 'opening') {
      element.style.height = 'auto'
      element.style.marginTop = ''
      element.style.marginBottom = ''
      element.style.paddingTop = ''
      element.style.paddingBottom = ''
      element.style.overflow = ''
      element.style.transition = ''
      animationStates.delete(element)
    }
    element.removeEventListener('transitionend', cleanup)
  }
  
  element.addEventListener('transitionend', cleanup)
  setTimeout(cleanup, 350) // Fallback
}

/**
 * Slide close an element smoothly with proper margin and padding handling
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
  
  // Get current dimensions
  const computedStyle = window.getComputedStyle(element)
  const currentHeight = element.offsetHeight
  const currentMarginTop = parseFloat(computedStyle.marginTop) || 0
  const currentMarginBottom = parseFloat(computedStyle.marginBottom) || 0
  const currentPaddingTop = parseFloat(computedStyle.paddingTop) || 0
  const currentPaddingBottom = parseFloat(computedStyle.paddingBottom) || 0
  const borderTopWidth = parseFloat(computedStyle.borderTopWidth) || 0
  const borderBottomWidth = parseFloat(computedStyle.borderBottomWidth) || 0
  
  // Calculate content height (excluding padding and border)
  const contentHeight = currentHeight - currentPaddingTop - currentPaddingBottom - borderTopWidth - borderBottomWidth
  
  // Set up for animation with explicit values
  element.style.overflow = 'hidden'
  element.style.height = `${contentHeight}px`
  element.style.marginTop = `${currentMarginTop}px`
  element.style.marginBottom = `${currentMarginBottom}px`
  element.style.paddingTop = `${currentPaddingTop}px`
  element.style.paddingBottom = `${currentPaddingBottom}px`
  element.style.transition = 'height 1s cubic-bezier(0.4, 0, 0.2, 1), margin 1s cubic-bezier(0.4, 0, 0.2, 1), padding 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease'
  
  // Force reflow
  element.offsetHeight
  
  // Animate to collapsed state
  element.style.height = '0px'
  element.style.marginTop = '0px'
  element.style.marginBottom = '0px'
  element.style.paddingTop = '0px'
  element.style.paddingBottom = '0px'
  element.style.opacity = '0'
  
  // Clean up after animation
  const cleanup = () => {
    if (animationStates.get(element) === 'closing') {
      element.style.display = 'none'
      element.style.height = ''
      element.style.marginTop = ''
      element.style.marginBottom = ''
      element.style.paddingTop = ''
      element.style.paddingBottom = ''
      element.style.opacity = ''
      element.style.overflow = ''
      element.style.transition = ''
      animationStates.delete(element)
    }
    element.removeEventListener('transitionend', cleanup)
  }
  
  element.addEventListener('transitionend', cleanup)
  setTimeout(cleanup, 350) // Fallback
}

/**
 * Alternative: Wrapper-based approach for complex elements
 * This creates a wrapper div that handles the animation
 */
export function slideOpenWithWrapper(element, displayType = 'block') {
  if (!element) return
  
  // Check if wrapper already exists
  let wrapper = element.parentElement
  if (!wrapper || !wrapper.hasAttribute('data-slide-wrapper')) {
    // Create wrapper
    wrapper = document.createElement('div')
    wrapper.setAttribute('data-slide-wrapper', 'true')
    wrapper.style.overflow = 'hidden'
    
    // Insert wrapper and move element inside
    element.parentNode.insertBefore(wrapper, element)
    wrapper.appendChild(element)
  }
  
  // Prevent conflicting animations
  if (animationStates.get(wrapper) === 'opening') return
  animationStates.set(wrapper, 'opening')
  
  // Get target height (element's natural height)
  const targetHeight = element.scrollHeight
  
  // Set up wrapper for animation
  wrapper.style.display = displayType
  wrapper.style.height = '0px'
  wrapper.style.opacity = '0'
  wrapper.style.transition = 'height 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 1s ease'
  
  // Show the inner element
  element.style.display = displayType
  
  // Force reflow
  wrapper.offsetHeight
  
  // Animate wrapper
  wrapper.style.height = `${targetHeight}px`
  wrapper.style.opacity = '1'
  
  // Cleanup
  const cleanup = () => {
    if (animationStates.get(wrapper) === 'opening') {
      wrapper.style.height = 'auto'
      animationStates.delete(wrapper)
    }
    wrapper.removeEventListener('transitionend', cleanup)
  }
  
  wrapper.addEventListener('transitionend', cleanup)
  setTimeout(cleanup, 350)
}

/**
 * CSS-only solution helper
 * Add this CSS to your stylesheet for the simplest approach:
 */
export function addSmoothSlideCSS() {
  const css = `
    .slide-element {
      transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
    }
    
    .slide-closed {
      height: 0 !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
      border-top-width: 0 !important;
      border-bottom-width: 0 !important;
      opacity: 0;
    }
  `
  
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
}

/**
 * Simple CSS-based toggle (requires addSmoothSlideCSS to be called first)
 */
export function simpleSlideToggle(element) {
  if (!element) return
  
  element.classList.add('slide-element')
  element.classList.toggle('slide-closed')
}

// Keep original functions for backward compatibility
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

export function isSliding(element) {
  return animationStates.has(element)
}

export function initAllSlideableElements() {
  const slideableElements = document.querySelectorAll('.slideable')
  slideableElements.forEach(element => {
    if (!element.style.overflow) {
      element.style.overflow = 'hidden'
    }
  })
}