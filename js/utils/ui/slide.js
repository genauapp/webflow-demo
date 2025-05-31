// ../../utils/ui/slide.js

// ──────────────────────────────────────────────────────────────────────────────
// Internals: track whether an element is mid-slide (opening or closing)
// ──────────────────────────────────────────────────────────────────────────────
const animationStates = new WeakMap()

// ──────────────────────────────────────────────────────────────────────────────
// Default animation options (duration in ms, easing curve)
// ──────────────────────────────────────────────────────────────────────────────
const DEFAULT_OPTS = {
  duration: 600,                    // longer, smoother feel
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // gentle “fast out, slow in”
  props: ['height', 'margin', 'padding', 'opacity'],
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: build a CSS transition-string from opts.props, opts.duration & opts.easing
// e.g. props=['height','opacity'], duration=250, easing='ease-in'
// → 'height 250ms ease-in, opacity 250ms ease-in'
// ──────────────────────────────────────────────────────────────────────────────
function buildTransitionString(opts) {
  const { props, duration, easing } = opts
  return props
    .map((prop) => `${prop} ${duration}ms ${easing}`)
    .join(', ')
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: measure an element’s “full” dimensions (contentHeight, margins, padding, borders).
// We momentarily render it off-screen (visibility:hidden; position:absolute; height:auto)
// so inner margins/padding don’t affect the visible flow.
// Returns an object with:
//   contentHeight:   actual content-box height (excluding padding/border),
//   marginTop, marginBottom,
//   paddingTop, paddingBottom,
//   borderTop, borderBottom
// ──────────────────────────────────────────────────────────────────────────────
function measureFullDimensions(el) {
  // 1) Preserve inline styles we’re about to overwrite
  const original = {
    display:    el.style.display,
    position:   el.style.position,
    visibility: el.style.visibility,
    height:     el.style.height,
    overflow:   el.style.overflow,
    opacity:    el.style.opacity,
  }

  // 2) Lay out off-screen so margins/padding/borders can be read without reflowing page
  el.style.display    = 'block'
  el.style.position   = 'absolute'
  el.style.visibility = 'hidden'
  el.style.height     = 'auto'
  el.style.overflow   = 'visible'
  el.style.opacity    = '0'

  // 3) Read computed style
  const cs = window.getComputedStyle(el)
  const marginTop     = parseFloat(cs.marginTop)     || 0
  const marginBottom  = parseFloat(cs.marginBottom)  || 0
  const paddingTop    = parseFloat(cs.paddingTop)    || 0
  const paddingBottom = parseFloat(cs.paddingBottom) || 0
  const borderTop     = parseFloat(cs.borderTopWidth)    || 0
  const borderBottom  = parseFloat(cs.borderBottomWidth) || 0

  // 4) scrollHeight = content + padding + border
  const scrollH = el.scrollHeight
  const contentHeight = scrollH - paddingTop - paddingBottom - borderTop - borderBottom

  // 5) Restore original inline styles
  Object.entries(original).forEach(([prop, val]) => {
    if (val) el.style[prop] = val
    else el.style.removeProperty(prop.replace(/([A-Z])/g, '-$1').toLowerCase())
  })

  return {
    contentHeight,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    borderTop,
    borderBottom,
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: measure current “open” dimensions of an element in the DOM
// Returns an object with the same shape as measureFullDimensions, but based on
// getBoundingClientRect() and computed style.
// ──────────────────────────────────────────────────────────────────────────────
function measureCurrentDimensions(el) {
  const cs = window.getComputedStyle(el)
  const currentHeight   = el.getBoundingClientRect().height
  const marginTop       = parseFloat(cs.marginTop)     || 0
  const marginBottom    = parseFloat(cs.marginBottom)  || 0
  const paddingTop      = parseFloat(cs.paddingTop)    || 0
  const paddingBottom   = parseFloat(cs.paddingBottom) || 0
  const borderTop       = parseFloat(cs.borderTopWidth)    || 0
  const borderBottom    = parseFloat(cs.borderBottomWidth) || 0

  // contentHeight = currentHeight – (paddingTop + paddingBottom + borderTop + borderBottom)
  const contentHeight = currentHeight - paddingTop - paddingBottom - borderTop - borderBottom

  return {
    contentHeight,
    marginTop,
    marginBottom,
    paddingTop,
    paddingBottom,
    borderTop,
    borderBottom,
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: apply inline “collapsed” styles instantly (no transition) so element is
// height=0, margin=0, padding=0, opacity=0.
// ──────────────────────────────────────────────────────────────────────────────
function setCollapsedStyles(el, displayType) {
  el.style.display      = displayType
  el.style.overflow     = 'hidden'
  el.style.height       = '0px'
  el.style.marginTop    = '0px'
  el.style.marginBottom = '0px'
  el.style.paddingTop   = '0px'
  el.style.paddingBottom= '0px'
  el.style.opacity      = '0'
  el.style.transition   = 'none'
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: apply inline “expanded” styles using the measured values
// ──────────────────────────────────────────────────────────────────────────────
function setExpandedStyles(el, dims, opts) {
  const { contentHeight, marginTop, marginBottom, paddingTop, paddingBottom } = dims
  // Build transition string if not already present
  if (!el.style.transition || el.style.transition === 'none') {
    el.style.transition = buildTransitionString(opts)
  }
  el.style.height       = `${contentHeight}px`
  el.style.marginTop    = `${marginTop}px`
  el.style.marginBottom = `${marginBottom}px`
  el.style.paddingTop   = `${paddingTop}px`
  el.style.paddingBottom= `${paddingBottom}px`
  el.style.opacity      = '1'
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: cleanup inline styles after an “open” completes
// ──────────────────────────────────────────────────────────────────────────────
function cleanupAfterOpen(el) {
  el.style.removeProperty('height')
  el.style.removeProperty('overflow')
  el.style.removeProperty('transition')
  el.style.removeProperty('margin-top')
  el.style.removeProperty('margin-bottom')
  el.style.removeProperty('padding-top')
  el.style.removeProperty('padding-bottom')
  el.style.removeProperty('opacity')
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: apply inline “closing” styles to lock current size, then animate to zero
// ──────────────────────────────────────────────────────────────────────────────
function applyClosingStyles(el, dims, opts) {
  const { contentHeight, marginTop, marginBottom, paddingTop, paddingBottom } = dims
  el.style.overflow     = 'hidden'
  el.style.height       = `${contentHeight}px`
  el.style.marginTop    = `${marginTop}px`
  el.style.marginBottom = `${marginBottom}px`
  el.style.paddingTop   = `${paddingTop}px`
  el.style.paddingBottom= `${paddingBottom}px`
  el.style.opacity      = '1'
  el.style.transition   = buildTransitionString(opts)
}

// ──────────────────────────────────────────────────────────────────────────────
// Helper: collapse inline styles when “close” finishes
// ──────────────────────────────────────────────────────────────────────────────
function cleanupAfterClose(el) {
  el.style.display = 'none'
  el.style.removeProperty('height')
  el.style.removeProperty('overflow')
  el.style.removeProperty('transition')
  el.style.removeProperty('margin-top')
  el.style.removeProperty('margin-bottom')
  el.style.removeProperty('padding-top')
  el.style.removeProperty('padding-bottom')
  el.style.removeProperty('opacity')
}

// ──────────────────────────────────────────────────────────────────────────────
// Public: slideOpen
// ──────────────────────────────────────────────────────────────────────────────
export function slideOpen(element, displayType = 'block', userOpts = {}) {
  if (!element) return

  // 1) Prevent double‐opening
  if (animationStates.get(element) === 'opening') return
  animationStates.set(element, 'opening')

  // 2) Merge options (so you can override duration/easing/props)
  const opts = { ...DEFAULT_OPTS, ...userOpts }

  // 3) Measure full dims off-screen
  const dims = measureFullDimensions(element)

  // 4) Collapse everything instantly (no transition), force reflow
  setCollapsedStyles(element, displayType)
  // Force reflow so the “height:0; margin:0; padding:0” is applied immediately:
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.offsetHeight

  // 5) Two‐frame approach: 
  //    a) next RAF → restore transition property
  //    b) following RAF → set expanded styles
  requestAnimationFrame(() => {
    element.style.transition = buildTransitionString(opts)
    requestAnimationFrame(() => {
      setExpandedStyles(element, dims, opts)
    })
  })

  // 6) Cleanup on transitionend (only when height finishes)
  const onEnd = (e) => {
    if (e.propertyName !== 'height') return
    if (animationStates.get(element) === 'opening') {
      cleanupAfterOpen(element)
      animationStates.delete(element)
    }
    element.removeEventListener('transitionend', onEnd)
  }
  element.addEventListener('transitionend', onEnd)

  // 7) Fallback in case transitionend doesn’t fire
  setTimeout(() => {
    if (animationStates.get(element) === 'opening') {
      cleanupAfterOpen(element)
      animationStates.delete(element)
      element.removeEventListener('transitionend', onEnd)
    }
  }, opts.duration + 50)
}

// ──────────────────────────────────────────────────────────────────────────────
// Public: slideClose
// ──────────────────────────────────────────────────────────────────────────────
export function slideClose(element, userOpts = {}) {
  if (!element) return

  // 1) Prevent double‐closing
  if (animationStates.get(element) === 'closing') return
  animationStates.set(element, 'closing')

  // 2) If already hidden or zero-height, just hide and bail
  const cs = window.getComputedStyle(element)
  if (cs.display === 'none' || element.offsetHeight === 0) {
    element.style.display = 'none'
    animationStates.delete(element)
    return
  }

  // 3) Merge options 
  const opts = { ...DEFAULT_OPTS, ...userOpts }

  // 4) Measure current on-screen dims
  const dims = measureCurrentDimensions(element)

  // 5) Lock in those dims inline, force reflow
  applyClosingStyles(element, dims, opts)
  // Force reflow so browser sees current size before shrinking
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  element.offsetHeight

  // 6) Next RAF → set everything to zero (height, margin, padding, opacity)
  requestAnimationFrame(() => {
    element.style.height       = '0px'
    element.style.marginTop    = '0px'
    element.style.marginBottom = '0px'
    element.style.paddingTop   = '0px'
    element.style.paddingBottom= '0px'
    element.style.opacity      = '0'
  })

  // 7) Cleanup on transitionend
  const onEnd = (e) => {
    if (e.propertyName !== 'height') return
    if (animationStates.get(element) === 'closing') {
      cleanupAfterClose(element)
      animationStates.delete(element)
    }
    element.removeEventListener('transitionend', onEnd)
  }
  element.addEventListener('transitionend', onEnd)

  // 8) Fallback if transitionend never fires
  setTimeout(() => {
    if (animationStates.get(element) === 'closing') {
      cleanupAfterClose(element)
      animationStates.delete(element)
      element.removeEventListener('transitionend', onEnd)
    }
  }, opts.duration + 50)
}

// ──────────────────────────────────────────────────────────────────────────────
// Public: slideToggle (just checks current visibility/height to decide open/close)
// ──────────────────────────────────────────────────────────────────────────────
export function slideToggle(element, displayType = 'block', userOpts = {}) {
  if (!element) return
  const cs = window.getComputedStyle(element)
  const isHidden = cs.display === 'none' || element.offsetHeight === 0
  if (isHidden) slideOpen(element, displayType, userOpts)
  else slideClose(element, userOpts)
}

// ──────────────────────────────────────────────────────────────────────────────
// Public: isSliding → true if the element is currently mid-animation
// ──────────────────────────────────────────────────────────────────────────────
export function isSliding(element) {
  return animationStates.has(element)
}
