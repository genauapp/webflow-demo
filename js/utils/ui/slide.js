export function slideOpen(el, displayMode = 'block') {
  if (!el || el.classList.contains('expanded')) return;
  
  // Save original display value
  el._originalDisplay = displayMode;
  
  // Set initial state
  el.style.display = displayMode;
  el.style.height = '0';
  el.style.opacity = '0';
  el.classList.add('expanded'); // Add expanded class immediately
  
  // Force reflow before animating
  void el.offsetHeight;
  
  // Start animation
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
  el.style.height = `${el.scrollHeight}px`;
  el.style.opacity = '1';

  // Cleanup after transition
  const onTransitionEnd = () => {
    el.style.height = '';
    el.removeEventListener('transitionend', onTransitionEnd);
  };
  el.addEventListener('transitionend', onTransitionEnd);
}

export function slideClose(el) {
  if (!el || !el.classList.contains('expanded')) return;
  
  // Set initial state
  el.style.height = `${el.scrollHeight}px`;
  el.style.opacity = '1';
  
  // Force reflow before animating
  void el.offsetHeight;
  
  // Start animation
  el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
  el.style.height = '0';
  el.style.opacity = '0';

  // Cleanup after transition
  const onTransitionEnd = () => {
    el.classList.remove('expanded');
    el.style.display = 'none';
    el.style.height = '';
    el.style.opacity = '';
    el.removeEventListener('transitionend', onTransitionEnd);
  };
  el.addEventListener('transitionend', onTransitionEnd);
}