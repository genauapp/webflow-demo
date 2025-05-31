export function slideOpen(el, displayMode = 'block') {
  if (!el) return;
  
  // If already expanded, just ensure it's visible
  if (el.classList.contains('expanded')) {
    el.style.display = displayMode;
    return;
  }
  
  // Clear any existing transition end listeners
  el.removeEventListener('transitionend', el._slideTransitionHandler);
  
  // Set up CSS transition if not already present
  if (!el.style.transition) {
    el.style.transition = 'height 0.3s ease-out, opacity 0.3s ease-out';
  }
  
  // Set initial collapsed state
  el.style.display = displayMode;
  el.style.overflow = 'hidden';
  el.style.height = '0px';
  el.style.opacity = '0';
  
  // Force reflow to ensure initial state is applied
  el.offsetHeight;
  
  // Get the natural height by temporarily removing height constraint
  el.style.height = 'auto';
  const targetHeight = el.scrollHeight;
  el.style.height = '0px';
  
  // Force another reflow
  el.offsetHeight;
  
  // Start the animation
  requestAnimationFrame(() => {
    el.style.height = targetHeight + 'px';
    el.style.opacity = '1';
    el.classList.add('expanded');
  });
  
  // Clean up after animation completes
  const onTransitionEnd = (evt) => {
    if (evt.target !== el) return;
    if (evt.propertyName === 'height') {
      // Set height to auto for responsive behavior
      el.style.height = 'auto';
      el.style.overflow = '';
    }
  };
  
  el._slideTransitionHandler = onTransitionEnd;
  el.addEventListener('transitionend', onTransitionEnd);
}

export function slideClose(el) {
  if (!el || !el.classList.contains('expanded')) return;
  
  // Clear any existing transition end listeners
  el.removeEventListener('transitionend', el._slideTransitionHandler);
  
  // Set up CSS transition if not already present
  if (!el.style.transition) {
    el.style.transition = 'height 0.3s ease-out, opacity 0.3s ease-out';
  }
  
  // Set current height explicitly and prepare for transition
  el.style.overflow = 'hidden';
  el.style.height = el.scrollHeight + 'px';
  
  // Force reflow
  el.offsetHeight;
  
  // Start the closing animation
  requestAnimationFrame(() => {
    el.style.height = '0px';
    el.style.opacity = '0';
  });
  
  // Clean up after animation completes
  const onTransitionEnd = (evt) => {
    if (evt.target !== el) return;
    if (evt.propertyName === 'height') {
      el.style.display = 'none';
      el.style.height = '';
      el.style.opacity = '';
      el.style.overflow = '';
      el.classList.remove('expanded');
      el.removeEventListener('transitionend', onTransitionEnd);
      delete el._slideTransitionHandler;
    }
  };
  
  el._slideTransitionHandler = onTransitionEnd;
  el.addEventListener('transitionend', onTransitionEnd);
}