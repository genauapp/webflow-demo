// ../../utils/ui/slide.js

// ─── Internals: track animation state ─────────────────────────────────────────
const animationStates = new WeakMap()

/**
 * getFullHeight: measure an element’s content‐box height, padding, borders, margins.
 * We temporarily lay it out off‐screen (position:absolute; visibility:hidden) so that
 * inner margins/padding/borders can fully “render” without affecting the visible page.
 */
function getFullHeight(element) {
  // 1) Save all inline styles we’re about to overwrite
  const original = {
    display:    element.style.display,
    position:   element.style.position,
    visibility: element.style.visibility,
    height:     element.style.height,
    overflow:   element.style.overflow,
    opacity:    element.style.opacity,
  }

  // 2) Temporarily make it measurable off-screen
  element.style.display    = 'block'
  element.style.position   = 'absolute'
  element.style.visibility = 'hidden'
  element.style.height     = 'auto'
  element.style.overflow   = 'visible'
  element.style.opacity    = '0'

  // 3) Read computed‐style values
  const cs = window.getComputedStyle(element)
  const marginTop     = parseFloat(cs.marginTop)     || 0
  const marginBottom  = parseFloat(cs.marginBottom)  || 0
  const paddingTop    = parseFloat(cs.paddingTop)    || 0
  const paddingBottom = parseFloat(cs.paddingBottom) || 0
  const borderTop     = parseFloat(cs.borderTopWidth)    || 0
  const borderBottom  = parseFloat(cs.borderBottomWidth) || 0

  // 4) scrollHeight === content + padding + border
  const scrollH = element.scrollHeight

  // 5) Restore original inline styles
  Object.entries(original).forEach(([prop, val]) => {
    if (val) element.style[prop] = val
    else element.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase())
  })

  return {
    totalHeight:    scrollH + marginTop + marginBottom,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    borderTop,
    borderBottom,
    // contentHeight = scrollHeight – (paddingTop + paddingBottom + borderTop + borderBottom)
    contentHeight: scrollH - paddingTop - paddingBottom - borderTop - borderBottom
  }
}

/**
 * slideOpen(element, displayType)
 * ────────────────────────────────────────────────────────────────────────────
 * Smoothly expand from fully “collapsed” (height=0, margins=0, padding=0, opacity=0)
 * → fully “open” (contentHeight + padding + border; original margins; opacity=1).
 *
 * @param {HTMLElement} element
 * @param {string} displayType  e.g. 'block', 'flex', 'grid'; defaults to 'block'
 */
export function slideOpen(element, displayType = 'block') {
  if (!element) return

  // 1) If already “opening”, bail
  if (animationStates.get(element) === 'opening') return
  animationStates.set(element, 'opening')

  // 2) Measure everything off-screen
  const {
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    contentHeight
  } = getFullHeight(element)

  // 3) Immediately set the element into a fully “collapsed” inline state:
  element.style.display      = displayType
  element.style.overflow     = 'hidden'
  element.style.height       = '0px'
  element.style.marginTop    = '0px'
  element.style.marginBottom = '0px'
  element.style.paddingTop   = '0px'
  element.style.paddingBottom= '0px'
  element.style.opacity      = '0'
  // Remove any existing transition so we start collapsed instantly:
  element.style.transition   = 'none'

  // 4) Force a reflow so the “collapsed” state is actually applied
  //    (reading offsetHeight does this)
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.offsetHeight

  // 5) Two consecutive requestAnimationFrame calls:
  //    a) Next frame: restore the transition property
  //    b) Following frame: set the target (expanded) values
  requestAnimationFrame(() => {
    element.style.transition = [
      'height 300ms ease',
      'margin 300ms ease',
      'padding 300ms ease',
      'opacity 300ms ease'
    ].join(', ')

    requestAnimationFrame(() => {
      element.style.height       = `${contentHeight}px`
      element.style.marginTop    = `${marginTop}px`
      element.style.marginBottom = `${marginBottom}px`
      element.style.paddingTop   = `${paddingTop}px`
      element.style.paddingBottom= `${paddingBottom}px`
      element.style.opacity      = '1'
    })
  })

  // 6) Once the transition ends, clean up inline styles so the element goes back to “auto”:
  const cleanup = (e) => {
    if (e && e.propertyName !== 'height') return
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
  // Fallback: in case transitionend never fires (e.g. display forcibly overridden)
  setTimeout(cleanup, 350)
}

/**
 * slideClose(element)
 * ────────────────────────────────────────────────────────────────────────────
 * Smoothly collapse from fully “open” → fully “collapsed” (height=0, margins=0, padding=0, opacity=0)
 * then set display:none and remove all inline overrides.
 *
 * @param {HTMLElement} element
 */
export function slideClose(element) {
  if (!element) return

  // 1) If already “closing”, bail
  if (animationStates.get(element) === 'closing') return
  animationStates.set(element, 'closing')

  // 2) If already hidden (display:none or zero-height), just ensure display:none and exit
  const cs = window.getComputedStyle(element)
  if (cs.display === 'none' || element.offsetHeight === 0) {
    element.style.display = 'none'
    animationStates.delete(element)
    return
  }

  // 3) Read current “open” values so we can animate down:
  //    - currentHeight = content + padding + border
  //    - marginTop, marginBottom, paddingTop, paddingBottom
  const currentHeight   = element.getBoundingClientRect().height
  const marginTop       = parseFloat(cs.marginTop)     || 0
  const marginBottom    = parseFloat(cs.marginBottom)  || 0
  const paddingTop      = parseFloat(cs.paddingTop)    || 0
  const paddingBottom   = parseFloat(cs.paddingBottom) || 0
  const borderTop       = parseFloat(cs.borderTopWidth)    || 0
  const borderBottom    = parseFloat(cs.borderBottomWidth) || 0

  // 4) Compute “contentHeight” (so that height animates just the content area):
  const contentHeight = currentHeight - paddingTop - paddingBottom - borderTop - borderBottom

  // 5) Fix inline values to exactly what’s on-screen right now,
  //    then force a reflow to lock them in before the collapse:
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

  // Force reflow so browser “sees” the current open values
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.offsetHeight

  // 6) Now animate everything down to zero:
  requestAnimationFrame(() => {
    element.style.height       = '0px'
    element.style.marginTop    = '0px'
    element.style.marginBottom = '0px'
    element.style.paddingTop   = '0px'
    element.style.paddingBottom= '0px'
    element.style.opacity      = '0'
  })

  // 7) After the transition, hide & clean up inline styles
  const cleanup = (e) => {
    if (e && e.propertyName !== 'height') return
    if (animationStates.get(element) === 'closing') {
      element.style.display = 'none'
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
  // Fallback if transitionend never fires
  setTimeout(cleanup, 350)
}

/**
 * slideToggle: helper to open ↔ close depending on current state
 */
export function slideToggle(element, displayType = 'block') {
  const cs = window.getComputedStyle(element)
  const isHidden = cs.display === 'none' || element.offsetHeight === 0
  if (isHidden) slideOpen(element, displayType)
  else slideClose(element)
}

/**
 * isSliding: returns true if an element is currently mid-animation
 */
export function isSliding(element) {
  return animationStates.has(element)
}
