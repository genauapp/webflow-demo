export function slideOpen(el, displayMode = 'block') {
  if (!el || el.classList.contains('expanded')) return;
  
  // Set initial state
  el.style.display = displayMode;
  el.style.height = '0';
  el.style.opacity = '0';
  el.classList.add('expanded');
  
  // Get natural height
  const fullHeight = el.scrollHeight + 'px';
  
  // Trigger reflow to apply initial state
  void el.offsetHeight;
  
  // Start transition
  el.style.height = fullHeight;
  el.style.opacity = '1';
}

export function slideClose(el) {
  if (!el || !el.classList.contains('expanded')) return;
  
  // Capture current height
  const currentHeight = el.scrollHeight + 'px';
  
  // Prepare for transition
  el.style.height = currentHeight;
  void el.offsetHeight;  // Trigger reflow
  
  // Start transition
  el.style.height = '0';
  el.style.opacity = '0';
  
  // Cleanup after transition
  const onEnd = (evt) => {
    if (evt.propertyName !== 'height') return;
    el.style.display = 'none';
    el.classList.remove('expanded');
    el.removeEventListener('transitionend', onEnd);
  };
  
  el.addEventListener('transitionend', onEnd);
}