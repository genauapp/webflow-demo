// ../../utils/ui/slide.js

/**
 * slideOpen: smoothly expand an element from height: 0 → its full rendered height.
 * Uses getBoundingClientRect().height to account for padding/border (and avoids
 * mid-transition jumps from child margins).
 *
 * @param {HTMLElement} el
 * @param {string} [displayType='block']  e.g. 'flex', 'grid', 'block', etc.
 */
export function slideOpen(el, displayType = 'block') {
  const computed = window.getComputedStyle(el);
  
  // If already visible and not zero‐height, do nothing
  if (computed.display !== 'none' && parseFloat(computed.height) > 0) {
    return;
  }

  // Store original styles to restore later
  const originalTransition = el.style.transition;
  const originalHeight = el.style.height;
  const originalOverflow = el.style.overflow;
  const originalPosition = el.style.position;
  const originalVisibility = el.style.visibility;
  const originalDisplay = el.style.display;

  // 1) Completely reset any existing height/transition styles first
  el.style.transition = 'none';
  el.style.height = 'auto';
  el.style.overflow = 'visible';
  
  // 2) Make it render off-screen to measure its "auto" height:
  el.style.position = 'absolute';
  el.style.visibility = 'hidden';
  el.style.display = displayType;
  
  // Force a layout calculation
  el.offsetHeight;
  
  // 3) Now measure its true rendered height:
  const fullHeightPx = el.getBoundingClientRect().height + 'px';
  
  // 4) Restore to normal flow and collapse to 0 for animation start:
  el.style.position = originalPosition || '';
  el.style.visibility = originalVisibility || '';
  el.style.height = '0px';
  el.style.overflow = 'hidden';
  
  // 5) Force reflow so browser registers height=0 before we start animating:
  el.offsetHeight;
  
  // 6) Now start the transition
  el.style.transition = 'height 300ms ease';
  el.style.height = fullHeightPx;
  
  // 7) Clean up after transition
  function onEnd(e) {
    if (e.target !== el || e.propertyName !== 'height') return;
    
    // Restore to auto height and clean up
    el.style.height = originalHeight || '';
    el.style.overflow = originalOverflow || '';
    el.style.transition = originalTransition || '';
    
    el.removeEventListener('transitionend', onEnd);
  }
  
  el.addEventListener('transitionend', onEnd);
}

/**
 * slideClose: smoothly collapse an element from its current rendered height → 0,
 * then set display:none. Reads getBoundingClientRect().height to account
 * for padding/border (and any child margins that aren't captured by scrollHeight).
 *
 * @param {HTMLElement} el
 */
export function slideClose(el) {
  const computed = window.getComputedStyle(el);
  
  // If already hidden (display:none) or effectively zero-height, just hide:
  if (computed.display === 'none' || parseFloat(computed.height) === 0) {
    el.style.display = 'none';
    return;
  }

  // Store original styles
  const originalTransition = el.style.transition;
  const originalHeight = el.style.height;
  const originalOverflow = el.style.overflow;

  // 1) Ensure we start from a clean state - remove any existing transition
  el.style.transition = 'none';
  
  // 2) Lock in its current on-screen height:
  const currentHeightPx = el.getBoundingClientRect().height + 'px';
  el.style.height = currentHeightPx;
  el.style.overflow = 'hidden';
  
  // 3) Force reflow (so browser knows we start from currentHeightPx):
  el.offsetHeight;
  
  // 4) Now start the transition to 0
  el.style.transition = 'height 300ms ease';
  el.style.height = '0px';
  
  // 5) Once transition ends, hide it fully and clean up:
  function onEnd(e) {
    if (e.target !== el || e.propertyName !== 'height') return;
    
    el.style.display = 'none';
    el.style.height = originalHeight || '';
    el.style.overflow = originalOverflow || '';
    el.style.transition = originalTransition || '';
    
    el.removeEventListener('transitionend', onEnd);
  }
  
  el.addEventListener('transitionend', onEnd);
}