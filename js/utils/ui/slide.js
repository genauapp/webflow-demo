const animationStates = new WeakMap();

// Create or get animation wrapper
function getSlideWrapper(element) {
  if (!element) return null;
  
  // Check for existing wrapper
  if (element.parentElement?.hasAttribute('data-slide-wrapper')) {
    return element.parentElement;
  }
  
  // Create new wrapper
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-slide-wrapper', 'true');
  wrapper.style.overflow = 'hidden';
  wrapper.style.transition = 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
  
  // Insert wrapper and move element into it
  element.parentNode.insertBefore(wrapper, element);
  wrapper.appendChild(element);
  
  return wrapper;
}

export function slideOpen(element, displayType = 'block') {
  if (!element) return;
  
  const wrapper = getSlideWrapper(element);
  if (!wrapper) return;
  
  // Prevent animation conflicts
  if (animationStates.get(wrapper)) return;
  animationStates.set(wrapper, 'opening');
  
  // Reset initial state
  wrapper.style.display = displayType;
  wrapper.style.height = '0';
  wrapper.style.opacity = '0';
  
  // Get current height (force layout calculation)
  const startHeight = wrapper.offsetHeight;
  const targetHeight = element.scrollHeight;
  
  // Double-check if already visible
  if (targetHeight === 0) {
    animationStates.delete(wrapper);
    return;
  }
  
  // Trigger reflow before animating
  wrapper.offsetHeight;
  
  // Animate to target height
  wrapper.style.height = `${targetHeight}px`;
  wrapper.style.opacity = '1';
  
  // Cleanup after animation completes
  const finish = () => {
    if (animationStates.get(wrapper) !== 'opening') return;
    
    // Enable natural height changes
    wrapper.style.height = 'auto';
    animationStates.delete(wrapper);
    
    // Remove transition temporarily to prevent jumpiness
    wrapper.style.transition = 'none';
    requestAnimationFrame(() => {
      wrapper.style.transition = '';
    });
    
    wrapper.removeEventListener('transitionend', finish);
  };
  
  wrapper.addEventListener('transitionend', finish);
  setTimeout(finish, 500); // Fallback timeout
}

export function slideClose(element) {
  if (!element) return;
  
  const wrapper = getSlideWrapper(element);
  if (!wrapper) return;
  
  // Prevent conflicts
  if (animationStates.get(wrapper)) return;
  animationStates.set(wrapper, 'closing');
  
  // Capture current height
  const startHeight = element.scrollHeight;
  
  // Only animate if element has visible height
  if (startHeight <= 0) {
    wrapper.style.display = 'none';
    animationStates.delete(wrapper);
    return;
  }
  
  // Set starting point
  wrapper.style.height = `${startHeight}px`;
  wrapper.style.opacity = '1';
  
  // Trigger reflow
  wrapper.offsetHeight;
  
  // Animate collapse
  wrapper.style.height = '0';
  wrapper.style.opacity = '0';
  
  // Final cleanup
  const finish = () => {
    if (animationStates.get(wrapper) !== 'closing') return;
    
    wrapper.style.display = 'none';
    wrapper.style.height = 'auto'; // Reset for future animations
    animationStates.delete(wrapper);
    
    wrapper.removeEventListener('transitionend', finish);
  };
  
  wrapper.addEventListener('transitionend', finish);
  setTimeout(finish, 500); // Fallback timeout
}