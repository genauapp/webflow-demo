// ../../utils/ui/slide.js

// ─── Internal: track whether an element is mid-animation ──────────────────────
const animationStates = new WeakMap()

/**
 * getFullHeight: measure an element’s full “rendered” height (including padding/border),
 * plus capture its top/bottom margins and padding so we can animate them.
 */
function getFullHeight(element) {
  // 1) Remember any inline styles we’ll overwrite
  const original = {
    display: element.style.display,
    position: element.style.position,
    visibility: element.style.visibility,
    height: element.style.height,
    overflow: element.style.overflow,
    opacity: element.style.opacity,
  }

  // 2) Temporarily lay it out off-screen so content/margins don’t affect the visible page
  element.style.display = 'block'
  element.style.position = 'absolute'
  element.style.visibility = 'hidden'
  element.style.height = 'auto'
  element.style.overflow = 'visible'
  element.style.opacity = '0'

  // 3) Read computed style to capture margins/padding/borders
  const cs = window.getComputedStyle(element)
  const marginTop    = parseFloat(cs.marginTop)    || 0
  const marginBottom = parseFloat(cs.marginBottom) || 0
  const paddingTop   = parseFloat(cs.paddingTop)   || 0
  const paddingBottom= parseFloat(cs.paddingBottom)|| 0
  const borderTop    = parseFloat(cs.borderTopWidth)|| 0
  const borderBottom = parseFloat(cs.borderBottomWidth)|| 0

  // 4) scrollHeight includes content + padding + borders, but not margins.
  const scrollH = element.scrollHeight

  // 5) Restore all inline styles
  Object.entries(original).forEach(([prop, value]) => {
    if (value) {
      element.style[prop] = value
    } else {
      element.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase())
    }
  })

  return {
    totalHeight: scrollH + marginTop + marginBottom,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    borderTop,
    borderBottom,
    contentHeight: scrollH - paddingTop - paddingBottom - borderTop - borderBottom
  }
}

/**
 * slideOpen: expand an element from height:0 → its “full” height, + margins/padding/border.
 * @param {HTMLElement} element
 * @param {string} displayType  e.g. 'block', 'flex', 'grid' (default: 'block')
 */
export function slideOpen(element, displayType = 'block') {
  if (!element) return

  // 1) Don’t re-open if already opening
  if (animationStates.get(element) === 'opening') return
  animationStates.set(element, 'opening')

  // 2) Measure everything off-screen:
  const {
    totalHeight,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    contentHeight
  } = getFullHeight(element)

  // 3) Initialize for animation: collapse height, margins, padding, opacity
  element.style.display      = displayType
  element.style.overflow     = 'hidden'
  element.style.height       = '0px'
  element.style.marginTop    = '0px'
  element.style.marginBottom = '0px'
  element.style.paddingTop   = '0px'
  element.style.paddingBottom= '0px'
  element.style.opacity      = '0'
  element.style.transition   = [
    'height 300ms ease',
    'margin 300ms ease',
    'padding 300ms ease',
    'opacity 300ms ease'
  ].join(', ')

  // 4) Force a reflow so starting state (all collapsed) takes effect
  //    (reading offsetHeight triggers the browser to paint that “zeroed” state)
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.offsetHeight

  // 5) Animate to the measured values
  element.style.height       = `${contentHeight}px`
  element.style.marginTop    = `${marginTop}px`
  element.style.marginBottom = `${marginBottom}px`
  element.style.paddingTop   = `${paddingTop}px`
  element.style.paddingBottom= `${paddingBottom}px`
  element.style.opacity      = '1'

  // 6) Cleanup after the transition ends
  const cleanup = (e) => {
    if (e && e.propertyName !== 'height') return
    // Only clear styles if we’re still in “opening” state
    if (animationStates.get(element) === 'opening') {
      element.style.removeProperty('height')
      element.style.removeProperty('overflow')
      element.style.removeProperty('transition')
      element.style.removeProperty('margin-top')
      element.style.removeProperty('margin-bottom')
      element.style.removeProperty('padding-top')
      element.style.removeProperty('padding-bottom')
      element.style.removeProperty('opacity')
      animationStates.delete(element)
    }
    element.removeEventListener('transitionend', cleanup)
  }

  element.addEventListener('transitionend', cleanup)
  // Fallback in case `transitionend` never fires (e.g. displayType ‘none’ forced mid-animation)
  setTimeout(cleanup, 350)
}

/**
 * slideClose: collapse an element from its current size → 0, including margins/padding/border,
 * then hide it (display:none).
 * @param {HTMLElement} element
 */
export function slideClose(element) {
  if (!element) return

  // 1) Don’t re-collapse if already closing
  if (animationStates.get(element) === 'closing') return
  animationStates.set(element, 'closing')

  // 2) If already hidden or zero-height, bail
  const cs = window.getComputedStyle(element)
  if (cs.display === 'none' || element.offsetHeight === 0) {
    element.style.display = 'none'
    animationStates.delete(element)
    return
  }

  // 3) Read current margins, padding, border
  const currentHeight      = element.getBoundingClientRect().height
  const marginTop          = parseFloat(cs.marginTop)    || 0
  const marginBottom       = parseFloat(cs.marginBottom) || 0
  const paddingTop         = parseFloat(cs.paddingTop)   || 0
  const paddingBottom      = parseFloat(cs.paddingBottom)|| 0
  const borderTop          = parseFloat(cs.borderTopWidth)|| 0
  const borderBottom       = parseFloat(cs.borderBottomWidth)|| 0

  // 4) Calculate “contentHeight” (excluding padding/border) so we collapse exactly
  const contentHeight = currentHeight - paddingTop - paddingBottom - borderTop - borderBottom

  // 5) Fix current values inline, then animate to zero
  element.style.overflow     = 'hidden'
  element.style.height       = `${contentHeight}px`
  element.style.marginTop    = `${marginTop}px`
  element.style.marginBottom = `${marginBottom}px`
  element.style.paddingTop   = `${paddingTop}px`
  element.style.paddingBottom= `${paddingBottom}px`
  element.style.opacity      = '1'
  element.style.transition   = [
    'height 300ms ease',
    'margin 300ms ease',
    'padding 300ms ease',
    'opacity 300ms ease'
  ].join(', ')

  // Force reflow (so browser knows the “from” state)
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.offsetHeight

  // Animate everything → 0
  element.style.height       = '0px'
  element.style.marginTop    = '0px'
  element.style.marginBottom = '0px'
  element.style.paddingTop   = '0px'
  element.style.paddingBottom= '0px'
  element.style.opacity      = '0'

  // 6) Cleanup once collapsed
  const cleanup = (e) => {
    if (e && e.propertyName !== 'height') return
    if (animationStates.get(element) === 'closing') {
      element.style.display       = 'none'
      element.style.removeProperty('height')
      element.style.removeProperty('overflow')
      element.style.removeProperty('transition')
      element.style.removeProperty('margin-top')
      element.style.removeProperty('margin-bottom')
      element.style.removeProperty('padding-top')
      element.style.removeProperty('padding-bottom')
      element.style.removeProperty('opacity')
      animationStates.delete(element)
    }
    element.removeEventListener('transitionend', cleanup)
  }

  element.addEventListener('transitionend', cleanup)
  setTimeout(cleanup, 350)
}

/**
 * slideToggle: convenience method (open ↔ close)
 */
export function slideToggle(element, displayType = 'block') {
  const cs = window.getComputedStyle(element)
  const isHidden = cs.display === 'none' || element.offsetHeight === 0
  if (isHidden) slideOpen(element, displayType)
  else slideClose(element)
}

/**
 * isSliding: returns true if an element is mid-transition
 */
export function isSliding(element) {
  return animationStates.has(element)
}
